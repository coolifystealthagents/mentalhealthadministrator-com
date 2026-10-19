import {afterEach,describe,expect,it,vi} from 'vitest';
import {POST} from '../src/app/api/submit-lead/route';

const req=(body:unknown,headers:Record<string,string>={})=>new Request('http://local/api/submit-lead',{method:'POST',headers:{'content-type':'application/json',...headers},body:JSON.stringify(body)});
const fullLead={placement:'contact-page',first_name:'Pat',last_name:'Owner',name:'Pat Owner',email:'pat@practice.example',phone_country:'+1',phone:'555 0100',company:'Practice',company_website:'https://practice.example',company_size:'11 to 50',positions_to_fill:'2 to 3',referral_source:'Search engine'};
const originalWebhook=process.env.LEAD_WEBHOOK_URL;

afterEach(()=>{
  vi.restoreAllMocks();
  if(originalWebhook===undefined)delete process.env.LEAD_WEBHOOK_URL;
  else process.env.LEAD_WEBHOOK_URL=originalWebhook;
});

describe('lead API',()=>{
  it('rejects missing name and invalid email',async()=>expect((await POST(req({name:'',email:'bad'}))).status).toBe(400));

  it('enforces the complete contact form contract server-side',async()=>{
    const formSource=await import('node:fs').then(({readFileSync})=>readFileSync(new URL('../src/components/LeadForm.tsx',import.meta.url),'utf8'));
    expect(formSource).not.toContain('<option value="other">Other</option>');
    const fetchSpy=vi.spyOn(globalThis,'fetch');
    expect((await POST(req({...fullLead,company:''}))).status).toBe(400);
    expect((await POST(req({...fullLead,email:'pat@gmail.com'}))).status).toBe(400);
    expect((await POST(req({...fullLead,company_size:'Huge'}))).status).toBe(400);
    expect((await POST(req({...fullLead,phone_country:'other'}))).status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('silently accepts honeypot without calling the destination',async()=>{
    const fetchSpy=vi.spyOn(globalThis,'fetch');
    const r=await POST(req({name:'Bot',email:'bot@example.com',website_url:'filled'}));
    expect(r.status).toBe(200);
    expect(await r.json()).toMatchObject({ok:true});
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('delivers a valid lead to ACR before accepting when the legacy destination is missing',async()=>{
    delete process.env.LEAD_WEBHOOK_URL;
    const fetchSpy=vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response(JSON.stringify({status:'ok'}),{status:202,headers:{'content-type':'application/json'}}));
    const r=await POST(req({name:'Owner',email:'owner@example.com',phone_country:'+44',phone:'20 7946 0958'}));
    expect(r.status).toBe(200);
    expect(await r.json()).toMatchObject({ok:true,delivery:'acr'});
    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url,options]=fetchSpy.mock.calls[0];
    expect(url).toBe('https://acrtracking.stealthagents.us/api/track');
    const payload=JSON.parse(String(options?.body));
    expect(payload.site_id).toBe('mental-health-administrator');
    expect(payload.events).toHaveLength(1);
    expect(payload.events[0]).toMatchObject({event_type:'lead_submit',event_value:'mentalhealthadministrator.com:page'});
    expect(JSON.parse(payload.events[0].event_metadata)).toMatchObject({lead_name:'Owner',lead_email:'owner@example.com',lead_phone:'+44 20 7946 0958',phone_country:'+44',company_website:''});
  });

  it('forces bounded fallback delivery after an actual ACR submission rejection',async()=>{
    delete process.env.LEAD_WEBHOOK_URL;
    const originalFallback=process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL;
    process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL='https://mattermost.example.test/fallback';
    const fetchSpy=vi.spyOn(globalThis,'fetch').mockImplementation((url)=>Promise.resolve(String(url).includes('mattermost')?new Response(null,{status:204}):new Response('',{status:503})));
    try{
      const r=await POST(req({name:'Owner',email:'owner@example.com'}));
      expect(r.status).toBe(503);
      expect(await r.json()).toMatchObject({ok:false});
      expect(fetchSpy.mock.calls.map(([url])=>String(url))).toEqual(['https://acrtracking.stealthagents.us/api/track','https://mattermost.example.test/fallback']);
    }finally{
      if(originalFallback===undefined)delete process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL;
      else process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL=originalFallback;
    }
  });

  it('rejects a transport-level ACR success whose body does not acknowledge acceptance',async()=>{
    delete process.env.LEAD_WEBHOOK_URL;
    vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response(JSON.stringify({status:'error'}),{status:202,headers:{'content-type':'application/json'}}));
    const r=await POST(req({name:'Owner',email:'owner@example.com'}));
    expect(r.status).toBe(503);
    expect(await r.json()).toMatchObject({ok:false});
  });

  it('requires JSON and rejects oversized lead bodies before parsing',async()=>{
    expect((await POST(req({name:'Owner',email:'owner@example.com'},{'content-type':'text/plain'}))).status).toBe(415);
    expect((await POST(req({name:'Owner',email:'owner@example.com'},{'content-length':'70000'}))).status).toBe(413);
  });

  it('emits one accepted ACR event and mirrors the lead to the configured destination',async()=>{
    process.env.LEAD_WEBHOOK_URL='https://tracker.example.test/leads';
    const fetchSpy=vi.spyOn(globalThis,'fetch').mockImplementation((url)=>Promise.resolve(String(url).includes('acrtracking')?new Response(JSON.stringify({status:'ok'}),{status:202,headers:{'content-type':'application/json'}}):new Response(null,{status:204})));
    const r=await POST(req({...fullLead,phone_country:'+63',phone:'917 555 0100',message:'Two locations'}));
    expect(r.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    const [url,options]=fetchSpy.mock.calls[0];
    expect(url).toBe(process.env.LEAD_WEBHOOK_URL);
    expect(options).toMatchObject({method:'POST',headers:{'content-type':'application/json'}});
    expect(JSON.parse(String(options?.body))).toMatchObject({name:'Pat Owner',email:'pat@practice.example',phone_country:'+63',phone:'+63 917 555 0100',company_website:'https://practice.example',source:'mentalhealthadministrator.com'});
    expect(fetchSpy.mock.calls[1][0]).toBe('https://acrtracking.stealthagents.us/api/track');
    const acr=JSON.parse(String(fetchSpy.mock.calls[1][1]?.body));
    expect(JSON.parse(acr.events[0].event_metadata)).toMatchObject({company_website:'https://practice.example'});
  });

  it('returns an error when the lead destination rejects the request',async()=>{
    process.env.LEAD_WEBHOOK_URL='https://tracker.example.test/leads';
    vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response('',{status:500}));
    expect((await POST(req({name:'Owner',email:'owner@example.com'}))).status).toBe(502);
  });
});
