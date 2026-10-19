import {describe,expect,it,vi} from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {sendLeadFallbackToMattermost} from '../src/lib/lead-fallback-mattermost';
import {POST as proxyTrack} from '../src/app/ingest/track/route';

const root=path.resolve(__dirname,'..');
const read=(file:string)=>fs.readFileSync(path.join(root,file),'utf8');

const sourceFiles=()=>fs.readdirSync(path.join(root,'src'),{recursive:true})
  .filter((file)=>typeof file==='string' && /\.(ts|tsx)$/.test(file))
  .map((file)=>read(path.join('src',file as string)));

describe('ACR 0.4.19 canonical installation',()=>{
  it('installs one explicit production config and one hosted bundle at the root',()=>{
    const layout=read('src/app/layout.tsx');
    expect(layout).toContain('id="acr-tracker-config"');
    expect(layout).toContain('strategy="beforeInteractive"');
    expect(layout).toContain('window.ACR_TRACKER_CONFIG');
    expect(layout.replace(/\s+/g,'')).toContain("siteId:'mental-health-administrator'");
    expect(layout.replace(/\s+/g,'')).toContain("endpoint:'/ingest/track'");
    expect(layout.replace(/\s+/g,'')).toContain('debug:false');
    expect(layout).not.toContain('test: true');
    expect(layout.match(/https:\/\/acrtracking\.stealthagents\.us\/v1\/tracker\.js/g)).toHaveLength(1);
    expect(layout).not.toMatch(/tracker\.js\?v=/);
    expect(layout.replace(/\s+/g,'')).toContain("{path:'/contact-us',step:1");
    expect(layout.replace(/\s+/g,'')).toContain("{path:'/thank-you',step:2");
    expect(layout.replace(/\s+/g,'')).toContain("{path:'/thanks-whats-next',step:3");
  });

  it('uses the bounded first-party proxy contract',()=>{
    const route=read('src/app/ingest/track/route.ts');
    const compact=route.replace(/\s+/g,'');
    for(const marker of [
      "exportconstruntime='nodejs'",
      'MAX_BODY_BYTES=256_000',
      "request.headers.get('cf-connecting-ip')",
      "request.headers.get('x-real-ip')",
      "request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()",
      "process.env.TRUST_PROXY_HEADERS!=='1'",
      "headers['X-Forwarded-For']=ip",
      "headers['X-ACR-Client-IP']=ip",
      "cache:'no-store'",
      'AbortSignal.timeout(10_000)',
      "'Cache-Control':'no-store'",
      "returnjson({error:'Payloadtoolarge'},413)",
      "returnjson({error:'Trackingupstreamunavailable'},502)",
    ]) expect(compact).toContain(marker);
    expect(route).toContain('https://acrtracking.stealthagents.us/api/track');
  });

  it('declares the hosted browser API while server-side delivery owns the accepted lead event',()=>{
    const globals=read('src/types/global.d.ts');
    const form=read('src/components/LeadForm.tsx');
    expect(globals).toContain('ACR_TRACKER_CONFIG?');
    expect(globals).toContain('trackLead:');
    expect(form).not.toContain('tracker.trackLead({');
    expect(form).not.toContain("track('lead_submitted'");
  });

  it('validates proxy payloads and removes browser-owned lead events',async()=>{
    const wrongType=new Request('http://local/ingest/track',{method:'POST',headers:{'content-type':'text/plain'},body:'{}'});
    expect((await proxyTrack(wrongType as never)).status).toBe(415);
    const malformed=new Request('http://local/ingest/track',{method:'POST',headers:{'content-type':'application/json'},body:'{"site_id":"wrong","events":[]}'});
    expect((await proxyTrack(malformed as never)).status).toBe(400);
    const fetchSpy=vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response('{"status":"ok"}',{status:202,headers:{'content-type':'application/json'}}));
    const valid=new Request('http://local/ingest/track',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({site_id:'mental-health-administrator',events:[
      {client_event_id:'11111111-1111-4111-8111-111111111111',event_type:'lead_submit',timestamp:new Date().toISOString(),page_url:'https://mentalhealthadministrator.com/contact-us',page_path:'/contact-us',event_metadata:'{}'},
      {client_event_id:'22222222-2222-4222-8222-222222222222',event_type:'pageview',timestamp:new Date().toISOString(),page_url:'https://mentalhealthadministrator.com/contact-us',page_path:'/contact-us',event_metadata:'{}'}
    ]})});
    expect((await proxyTrack(valid as never)).status).toBe(202);
    expect(fetchSpy).toHaveBeenCalledOnce();
    const forwarded=JSON.parse(String(fetchSpy.mock.calls[0][1]?.body));
    expect(forwarded.events.map((event:{event_type:string})=>event.event_type)).toEqual(['pageview']);
  });

  it('implements the site-owned two-probe server fallback without exposing a webhook',()=>{
    const fallback=read('src/lib/lead-fallback-mattermost.ts');
    const api=read('src/app/api/submit-lead/route.ts');
    expect(fallback).toContain("'use server'");
    expect(fallback).toContain('SITE_MATTERMOST_FALLBACK_WEBHOOK_URL');
    expect(fallback).toContain("ACR_FALLBACK_FORCE_DOWN === '1'");
    expect(fallback.match(/await isACRHealthy\(\)/g)?.length).toBe(2);
    expect(fallback).toContain('setTimeout(resolve, 15_000)');
    expect(fallback).toContain('new AbortController()');
    expect(fallback).toContain('controller.abort(), 2_000');
    expect(fallback).toContain('[SITE-DIRECT:${SITE_ID}]');
    expect(api).toContain('sendLeadFallbackToMattermost');
    expect(api).toContain("acceptedBody?.status!=='ok'");
    expect(api).toContain('await sendLeadFallbackToMattermost');
    expect(api).toContain('{forceDelivery:true}');
    expect(api).not.toContain('void sendLeadFallbackToMattermost');
    expect(api).toContain('company_website:lead.company_website');
    expect(api).toContain('MAX_BUCKETS');
    expect(api).toContain('pruneBuckets');
    const proxy=read('src/app/ingest/track/route.ts');
    expect(proxy).toContain('MAX_BUCKETS');
    expect(proxy).toContain('pruneBuckets');
    expect(api).toContain("event_type:'lead_submit'");
    const all=sourceFiles().join('\n');
    expect(all).not.toMatch(/https?:\/\/[^\s'"`]+\/hooks\//);
    expect(all).not.toContain("ACR_FALLBACK_FORCE_DOWN='1'");
  });

  it('forces validated leads through safe lossless fallback rendering',async()=>{
    const originalWebhook=process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL;
    process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL='https://mattermost.example.test/fallback';
    const fetchSpy=vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response(null,{status:204}));
    fetchSpy.mockClear();
    const longMessage=`line one\n@channel\n# heading\n${'x'.repeat(3967)}END`;
    try{
      await sendLeadFallbackToMattermost({name:'DeLaCruz',email:'owner@example.com',phone:'+1 5550100',message:'Psychotherapy',pageUrl:'https://mentalhealthadministrator.com/contact-us'},{forceDelivery:true});
      await sendLeadFallbackToMattermost({name:'Practice owner',email:'owner@example.com',phone:'+1 5550100',message:longMessage,pageUrl:'https://mentalhealthadministrator.com/contact-us'},{forceDelivery:true});
      expect(fetchSpy).toHaveBeenCalledTimes(2);
      const first=JSON.parse(String(fetchSpy.mock.calls[0][1]?.body)).text as string;
      expect(first).toContain('Psychotherapy');
      const second=JSON.parse(String(fetchSpy.mock.calls[1][1]?.body)).text as string;
      expect(second).toContain('END');
      expect(second).not.toContain('\n@channel');
      expect(second).not.toContain('\n# heading');
      expect(second).toContain('@\u200bchannel');
    }finally{
      vi.restoreAllMocks();
      if(originalWebhook===undefined)delete process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL;
      else process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL=originalWebhook;
    }
  });

  it('bounds both unhealthy ACR probes before fallback delivery',async()=>{
    const originalWebhook=process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL;
    process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL='https://mattermost.example.test/fallback';
    vi.useFakeTimers();
    const fetchSpy=vi.spyOn(globalThis,'fetch').mockImplementation((url,options)=>{
      if(String(url).includes('/api/health'))return new Promise((_,reject)=>{
        options?.signal?.addEventListener('abort',()=>reject(new DOMException('Timed out','AbortError')),{once:true});
      });
      return Promise.resolve(new Response(null,{status:204}));
    });
    try{
      const delivery=sendLeadFallbackToMattermost({name:'Practice owner',email:'owner@example.com',phone:'5550100',pageUrl:'https://mentalhealthadministrator.com/contact-us'});
      await vi.runAllTimersAsync();
      await delivery;
      expect(fetchSpy.mock.calls.filter(([url])=>String(url).includes('/api/health'))).toHaveLength(2);
      expect(fetchSpy).toHaveBeenLastCalledWith('https://mattermost.example.test/fallback',expect.objectContaining({signal:expect.any(AbortSignal)}));
    }finally{
      vi.useRealTimers();
      vi.restoreAllMocks();
      if(originalWebhook===undefined)delete process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL;
      else process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL=originalWebhook;
    }
  });

  it('derives current service routes rather than allowing retired camera slugs',()=>{
    const qa=read('scripts/qa.mjs');
    expect(qa).toContain("const siteSource = read('src/lib/site.ts')");
    expect(qa).toContain('serviceSlugs.forEach((slug) => valid.add(`/services/${slug}`))');
    expect(qa).not.toContain('live-camera-monitoring-support');
  });

  it('gives every marketing action a valid stable CTA id',()=>{
    const files=['src/app/page.tsx','src/app/about/page.tsx','src/app/services/[slug]/page.tsx','src/components/Layout.tsx'];
    const source=files.map(read).join('\n');
    const ids=[...source.matchAll(/id=(?:"cta-[a-z0-9-]+"|\{`cta-[^`]+`\})/g)].map((match)=>match[0]);
    expect(ids.length).toBeGreaterThan(8);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
