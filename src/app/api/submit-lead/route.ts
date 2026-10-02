import {NextResponse} from 'next/server';
import {sendLeadFallbackToMattermost} from '../../../lib/lead-fallback-mattermost';

export const runtime='nodejs';

interface LeadPayload{
  name?:unknown;
  email?:unknown;
  referral_source?:unknown;
  message?:unknown;
  website_url?:unknown;
}

type CleanLead={name:string;email:string;referral_source:string;message:string};
const ACR_HEALTH_URL='https://acrtracking.stealthagents.us/api/health';
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const recent=new Map<string,number[]>();

function text(value:unknown,max:number){return typeof value==='string'?value.trim().slice(0,max):''}
function clientKey(req:Request){return req.headers.get('cf-connecting-ip')||req.headers.get('x-real-ip')||req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown'}
function rateLimited(key:string){
  const now=Date.now();
  const kept=(recent.get(key)||[]).filter((time)=>now-time<60_000);
  if(kept.length>=5)return true;
  kept.push(now);recent.set(key,kept);return false;
}
async function acrAcceptingLeads(){
  try{
    const response=await fetch(ACR_HEALTH_URL,{cache:'no-store',signal:AbortSignal.timeout(2_000)});
    if(!response.ok)return false;
    const health=await response.json();
    return health?.status==='ok'&&health?.clickhouse==='connected';
  }catch{return false}
}
function scheduleFallback(lead:CleanLead,request:Request){
  void sendLeadFallbackToMattermost({
    ...lead,
    pageUrl:request.headers.get('referer')||'https://mentalhealthadministrator.com/contact-us',
    userAgent:request.headers.get('user-agent')||undefined,
  });
}

export async function POST(request:Request){
  let body:LeadPayload;
  try{body=await request.json()}catch{return NextResponse.json({ok:false,error:'Invalid request.'},{status:400})}

  if(text(body.website_url,200))return NextResponse.json({ok:true});
  const lead:CleanLead={
    name:text(body.name,120),
    email:text(body.email,254).toLowerCase(),
    referral_source:text(body.referral_source,160),
    message:text(body.message,4000),
  };
  if(!lead.name||!EMAIL.test(lead.email))return NextResponse.json({ok:false,error:'Please enter a valid name and email.'},{status:400});
  if(rateLimited(clientKey(request)))return NextResponse.json({ok:false,error:'Please wait before trying again.'},{status:429});

  const destination=process.env.LEAD_WEBHOOK_URL;
  if(!destination){
    if(!await acrAcceptingLeads()){
      console.error('Lead submission unavailable: ACR is not accepting leads and LEAD_WEBHOOK_URL is not configured.');
      return NextResponse.json({ok:false,error:'Lead delivery is temporarily unavailable.'},{status:503});
    }
    scheduleFallback(lead,request);
    return NextResponse.json({ok:true,delivery:'acr'});
  }

  try{
    const response=await fetch(destination,{
      method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify({...lead,source:'mentalhealthadministrator.com',submitted_at:new Date().toISOString()}),
      signal:AbortSignal.timeout(10_000),
    });
    if(!response.ok)throw new Error(`Lead destination returned ${response.status}`);
    scheduleFallback(lead,request);
    return NextResponse.json({ok:true,delivery:'webhook'});
  }catch(error){
    console.error('Lead delivery failed.',error instanceof Error?error.message:error);
    return NextResponse.json({ok:false,error:'Lead delivery failed.'},{status:502});
  }
}
