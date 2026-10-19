import {NextResponse} from 'next/server';
import {sendLeadFallbackToMattermost} from '../../../lib/lead-fallback-mattermost';

export const runtime='nodejs';

const ACR_TRACK_URL='https://acrtracking.stealthagents.us/api/track';
const SITE_ID='mental-health-administrator';
const MAX_BODY_BYTES=64_000;
const WINDOW_MS=60_000;
const MAX_BUCKETS=4_096;
const buckets=new Map<string,{count:number;reset:number}>();
let lastPrune=0;
const PERSONAL_EMAIL_DOMAINS=new Set(['gmail.com','googlemail.com','yahoo.com','hotmail.com','outlook.com','live.com','icloud.com','aol.com','proton.me','protonmail.com']);
const COMPANY_SIZES=new Set(['1 to 10','11 to 50','51 to 200','201 to 500','501+']);
const POSITION_COUNTS=new Set(['1','2 to 3','4 to 10','11+','Not sure yet']);
const REFERRAL_SOURCES=new Set(['Search engine','Referral','Social media','Stealth Agents','Other']);

type LeadRecord=Record<string,unknown>;

function response(body:Record<string,unknown>,status:number){return NextResponse.json(body,{status,headers:{'Cache-Control':'no-store'}})}
function clean(value:unknown,max=500){return typeof value==='string'?value.trim().slice(0,max):''}
function pruneBuckets(now:number){
 if(now-lastPrune<WINDOW_MS&&buckets.size<MAX_BUCKETS)return;
 for(const [key,bucket] of buckets){if(bucket.reset<=now)buckets.delete(key)}
 while(buckets.size>=MAX_BUCKETS){const oldest=buckets.keys().next().value as string|undefined;if(!oldest)break;buckets.delete(oldest)}
 lastPrune=now;
}
function take(key:string,limit:number){
 const now=Date.now();pruneBuckets(now);const current=buckets.get(key);
 if(!current||current.reset<=now){buckets.set(key,{count:1,reset:now+WINDOW_MS});return true}
 if(current.count>=limit)return false;
 current.count+=1;return true;
}
function trustedClientIp(request:Request){
 if(process.env.TRUST_PROXY_HEADERS!=='1')return '';
 return clean(request.headers.get('cf-connecting-ip')||request.headers.get('x-real-ip')||request.headers.get('x-forwarded-for')?.split(',')[0],64);
}
async function readJson(request:Request):Promise<LeadRecord|NextResponse>{
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return response({ok:false,error:'Content-Type must be application/json.'},415);
 const declared=Number(request.headers.get('content-length')||0);
 if(Number.isFinite(declared)&&declared>MAX_BODY_BYTES)return response({ok:false,error:'Request body is too large.'},413);
 let text='';
 try{text=await request.text()}catch{return response({ok:false,error:'Unable to read request body.'},400)}
 if(new TextEncoder().encode(text).byteLength>MAX_BODY_BYTES)return response({ok:false,error:'Request body is too large.'},413);
 try{const parsed=JSON.parse(text);return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:response({ok:false,error:'Invalid JSON object.'},400)}catch{return response({ok:false,error:'Invalid JSON.'},400)}
}
function acrPayload(lead:Record<string,string>){
 const source=`mentalhealthadministrator.com:${lead.placement||'page'}`;
 const metadata={
  lead_name:lead.name,
  lead_email:lead.email,
  lead_phone:lead.phone,
  phone_country:lead.phone_country,
  lead_message:lead.message,
  lead_source:source,
  lead_form_id:`lead-form-${lead.placement||'page'}`,
  business:lead.business,
  company_website:lead.company_website,
  company_size:lead.company_size,
  positions_to_fill:lead.positions_to_fill,
  referral_source:lead.referral_source,
 };
 return {site_id:SITE_ID,events:[{
  client_event_id:crypto.randomUUID(),event_type:'lead_submit',timestamp:new Date().toISOString(),
  session_id:`server-${crypto.randomUUID()}`,user_id:'',anonymous_id:'',
  page_url:'https://mentalhealthadministrator.com/contact-us',page_path:'/contact-us',
  page_title:'Contact Us | Mental Health Administrator',referrer:'',utm_source:'',utm_medium:'',utm_campaign:'',utm_term:'',utm_content:'',
  screen_width:0,screen_height:0,scroll_depth:0,time_on_page:0,event_value:source,event_metadata:JSON.stringify(metadata),
 }]};
}
function fallbackLead(lead:Record<string,string>,request:Request){return {name:lead.name,email:lead.email,phoneCountry:lead.phone_country,phone:lead.phone,business:lead.business,companyWebsite:lead.company_website,message:lead.message,companySize:lead.company_size,positions:lead.positions_to_fill,referral:lead.referral_source,pageUrl:request.headers.get('referer')||'https://mentalhealthadministrator.com/contact-us',userAgent:request.headers.get('user-agent')||undefined}}

export async function POST(request:Request){
 const parsed=await readJson(request);if(parsed instanceof NextResponse)return parsed;
 if(clean(parsed.website_url,200))return response({ok:true},200);
 const name=clean(parsed.name,120),email=clean(parsed.email,254).toLowerCase();
 if(!name||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return response({ok:false,error:'Name and valid email are required.'},400);
 const placement=clean(parsed.placement,80)||'page';
 const firstName=clean(parsed.first_name,60),lastName=clean(parsed.last_name,60),business=clean(parsed.company,160);
 const companySize=clean(parsed.company_size,80),positions=clean(parsed.positions_to_fill,80),referral=clean(parsed.referral_source,160);
 if(placement==='contact-page'&&(!firstName||!lastName||!business||!COMPANY_SIZES.has(companySize)||!POSITION_COUNTS.has(positions)||!REFERRAL_SOURCES.has(referral)||PERSONAL_EMAIL_DOMAINS.has(email.split('@')[1]||'')))return response({ok:false,error:'Complete the required consultation fields with a business email.'},400);
 const website=clean(parsed.company_website,300);
 if(website){try{const url=new URL(website);if(!['http:','https:'].includes(url.protocol))throw new Error()}catch{return response({ok:false,error:'Enter a valid company website URL.'},400)}}
 const ip=trustedClientIp(request);
 if(!take('lead:global',120)||!take(`lead:email:${email}`,20)||(ip&&!take(`lead:ip:${ip}`,20)))return response({ok:false,error:'Too many requests. Please try again later.'},429);
 const phoneCountry=clean(parsed.phone_country,8);const localPhone=clean(parsed.phone,40);
 if(phoneCountry&&!/^\+\d{1,4}$/.test(phoneCountry))return response({ok:false,error:'Invalid phone country code.'},400);
 const phone=[phoneCountry,localPhone].filter(Boolean).join(' ');
 const lead={
  name,email,phone_country:phoneCountry,phone,business,company_website:website,
  company_size:companySize,positions_to_fill:positions,referral_source:referral,
  message:clean(parsed.message,4000),placement,source:'mentalhealthadministrator.com',
 };
 const webhook=process.env.LEAD_WEBHOOK_URL;
 if(webhook){
  try{
   const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8_000);
   try{const destination=await fetch(webhook,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(lead),signal:controller.signal,cache:'no-store'});if(!destination.ok)throw new Error(`Lead destination returned ${destination.status}`)}finally{clearTimeout(timer)}
  }catch(error){
   console.error('Lead delivery failed.',error instanceof Error?error.message:'Unknown delivery error');
   await sendLeadFallbackToMattermost(fallbackLead(lead,request),{forceDelivery:true});
   return response({ok:false,error:'Delivery is temporarily unavailable. Please try again.'},502);
  }
  try{
   const tracked=await fetch(ACR_TRACK_URL,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(acrPayload(lead)),signal:AbortSignal.timeout(10_000),cache:'no-store'});
   const trackedBody=await tracked.json().catch(()=>null) as {status?:string}|null;
   if(!tracked.ok||trackedBody?.status!=='ok')console.error('Accepted lead tracking was not acknowledged.',tracked.status);
  }catch(error){console.error('Accepted lead tracking failed.',error instanceof Error?error.message:'Unknown tracking error')}
  return response({ok:true,delivery:'webhook'},200);
 }
 try{
  const accepted=await fetch(ACR_TRACK_URL,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(acrPayload(lead)),signal:AbortSignal.timeout(10_000),cache:'no-store'});
  const acceptedBody=await accepted.json().catch(()=>null) as {status?:string}|null;
  if(!accepted.ok||acceptedBody?.status!=='ok')throw new Error(`ACR lead endpoint did not acknowledge acceptance (${accepted.status})`);
  return response({ok:true,delivery:'acr'},200);
 }catch(error){
  console.error('Lead delivery failed.',error instanceof Error?error.message:'Unknown delivery error');
  await sendLeadFallbackToMattermost(fallbackLead(lead,request),{forceDelivery:true});
  return response({ok:false,error:'Delivery is temporarily unavailable. Please try again.'},503);
 }
}
