'use server';

const ACR_HEALTH_URL='https://acrtracking.stealthagents.us/api/health';
const SITE_ID='mental-health-administrator';

export interface FallbackLeadPayload{
  name:string;
  email:string;
  phone?:string;
  referral_source?:string;
  message?:string;
  pageUrl:string;
  userAgent?:string;
}

async function isACRHealthy():Promise<boolean>{
  if(process.env.ACR_FALLBACK_FORCE_DOWN === '1')return false;
  try{
    const response=await fetch(ACR_HEALTH_URL,{signal:AbortSignal.timeout(2_000),cache:'no-store'});
    if(!response.ok)return false;
    const health=await response.json();
    return health?.status==='ok'&&health?.clickhouse==='connected';
  }catch{return false}
}

function escapeMd(value:string|undefined):string{
  return (value||'').replace(/[|`*_{}[\]()#+.!>~-]/g,'\\$&').slice(0,3000);
}

function looksLikeGarbagePiiLead(lead:FallbackLeadPayload):boolean{
  const combined=`${lead.name} ${lead.email} ${lead.phone||''}`.toLowerCase();
  return /(?:testtesttest|asdfasdf|qwertyqwerty)/.test(combined);
}

export async function sendLeadFallbackToMattermost(lead:FallbackLeadPayload):Promise<void>{
  const fallbackWebhook=process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL;
  if(!fallbackWebhook){
    console.warn('[lead-fallback] SITE_MATTERMOST_FALLBACK_WEBHOOK_URL is missing');
    return;
  }
  try{
    if(await isACRHealthy()){
      console.info('[lead-fallback] ACR healthy; site-direct skipped');
      return;
    }
    console.warn('[lead-fallback] ACR probe failed; waiting 15s before re-probe');
    await new Promise((resolve)=>setTimeout(resolve, 15_000));
    if(await isACRHealthy()){
      console.info('[lead-fallback] ACR recovered; site-direct skipped');
      return;
    }
    if(looksLikeGarbagePiiLead(lead)){
      console.warn('[lead-fallback] garbage_pii_lead_submit; site-direct dropped');
      return;
    }
    const lines=[
      `**[SITE-DIRECT:${SITE_ID}] New lead - ${escapeMd(lead.name||lead.email||lead.phone||'unknown')}**`,
      `_Submitted by the site's independent fallback because ACR failed two health probes_`,
      '',
      '| Field | Value |','|---|---|',
      `| Site | ${SITE_ID} |`,
      `| Name | ${escapeMd(lead.name)||'_(empty)_'} |`,
      `| Email | ${escapeMd(lead.email)||'_(empty)_'} |`,
      `| Phone | ${escapeMd(lead.phone)||'_(empty)_'} |`,
      `| Referral | ${escapeMd(lead.referral_source)||'-'} |`,
      `| Page | ${escapeMd(lead.pageUrl)||'-'} |`,
      `| Time | ${new Date().toISOString()} |`,
      lead.message?`**Message:**\n> ${escapeMd(lead.message).replace(/\n/g,'\n> ')}`:'',
    ].filter(Boolean);
    const response=await fetch(fallbackWebhook,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({text:lines.join('\n'),username:`${SITE_ID} Direct (fallback)`,icon_emoji:':warning:'}),
      signal:AbortSignal.timeout(5_000),cache:'no-store',
    });
    if(!response.ok)console.error('[lead-fallback] Mattermost returned',response.status);
  }catch(error){console.error('[lead-fallback] fallback failed',error)}
}
