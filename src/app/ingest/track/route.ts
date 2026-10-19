import {NextRequest,NextResponse} from 'next/server';

export const runtime='nodejs';

const TRACK_URL='https://acrtracking.stealthagents.us/api/track';
const SITE_ID='mental-health-administrator';
const MAX_BODY_BYTES=256_000;
const MAX_EVENTS=50;
const WINDOW_MS=60_000;
const MAX_BUCKETS=4_096;
const blockedBrowserEvents=new Set(['lead_submit','empty_form_submit','form_submit']);
const buckets=new Map<string,{count:number;reset:number}>();
let lastPrune=0;

type JsonRecord=Record<string,unknown>;

function json(body:Record<string,unknown>,status:number){return NextResponse.json(body,{status,headers:{'Cache-Control':'no-store'}})}
function isRecord(value:unknown):value is JsonRecord{return Boolean(value)&&typeof value==='object'&&!Array.isArray(value)}
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
function trustedClientIp(request:NextRequest){
 if(process.env.TRUST_PROXY_HEADERS!=='1')return '';
 return (request.headers.get('cf-connecting-ip')||request.headers.get('x-real-ip')||request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'').slice(0,64);
}
function validEvent(event:unknown):event is JsonRecord{
 if(!isRecord(event))return false;
 if(typeof event.client_event_id!=='string'||event.client_event_id.length<16||event.client_event_id.length>80)return false;
 if(typeof event.event_type!=='string'||!/^[a-z][a-z0-9_]{0,63}$/.test(event.event_type))return false;
 if(typeof event.timestamp!=='string'||!Number.isFinite(Date.parse(event.timestamp)))return false;
 if(typeof event.page_url!=='string'||event.page_url.length>2_000||!/^https?:\/\//.test(event.page_url))return false;
 if(typeof event.page_path!=='string'||event.page_path.length>1_000||!event.page_path.startsWith('/'))return false;
 if(typeof event.event_metadata!=='string'||event.event_metadata.length>64_000)return false;
 try{if(!isRecord(JSON.parse(event.event_metadata)))return false}catch{return false}
 return true;
}

export async function POST(request:NextRequest){
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return json({error:'Content-Type must be application/json.'},415);
 const declared=Number(request.headers.get('content-length')||0);
 if(Number.isFinite(declared)&&declared>MAX_BODY_BYTES)return json({error:'Payload too large'},413);
 let body='';
 try{body=await request.text()}catch{return json({error:'Unable to read payload'},400)}
 if(new TextEncoder().encode(body).byteLength>MAX_BODY_BYTES)return json({error:'Payload too large'},413);
 let payload:unknown;
 try{payload=JSON.parse(body)}catch{return json({error:'Invalid JSON'},400)}
 if(!isRecord(payload)||payload.site_id!==SITE_ID||!Array.isArray(payload.events)||payload.events.length<1||payload.events.length>MAX_EVENTS||!payload.events.every(validEvent))return json({error:'Invalid tracking payload'},400);
 const ip=trustedClientIp(request);
 if(!take('track:global',3_000)||(ip&&!take(`track:ip:${ip}`,300)))return json({error:'Too many requests'},429);
 const events=payload.events.filter((event)=>!blockedBrowserEvents.has(String((event as JsonRecord).event_type))&&!String((event as JsonRecord).event_type).startsWith('lead_submit_'));
 if(events.length===0)return json({status:'accepted',filtered:true},202);
 try{
  const headers:Record<string,string>={'Content-Type':'application/json'};
  if(ip){headers['X-Forwarded-For']=ip;headers['X-ACR-Client-IP']=ip}
  const upstream=await fetch(TRACK_URL,{method:'POST',headers,body:JSON.stringify({...payload,events}),cache:'no-store',signal:AbortSignal.timeout(10_000)});
  const text=await upstream.text();
  return new NextResponse(text,{status:upstream.status,headers:{'Content-Type':upstream.headers.get('content-type')||'application/json','Cache-Control':'no-store'}});
 }catch{return json({error:'Tracking upstream unavailable'},502)}
}
