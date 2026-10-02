import {afterEach,describe,expect,it,vi} from 'vitest';
import {POST} from '../src/app/api/submit-lead/route';

const req=(body:unknown)=>new Request('http://local/api/submit-lead',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
const originalWebhook=process.env.LEAD_WEBHOOK_URL;

afterEach(()=>{
  vi.restoreAllMocks();
  if(originalWebhook===undefined)delete process.env.LEAD_WEBHOOK_URL;
  else process.env.LEAD_WEBHOOK_URL=originalWebhook;
});

describe('lead API',()=>{
  it('rejects missing name and invalid email',async()=>expect((await POST(req({name:'',email:'bad'}))).status).toBe(400));

  it('silently accepts honeypot without calling the destination',async()=>{
    const fetchSpy=vi.spyOn(globalThis,'fetch');
    const r=await POST(req({name:'Bot',email:'bot@example.com',website_url:'filled'}));
    expect(r.status).toBe(200);
    expect(await r.json()).toMatchObject({ok:true});
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('accepts a valid lead through healthy ACR when the legacy destination is missing',async()=>{
    delete process.env.LEAD_WEBHOOK_URL;
    const fetchSpy=vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response(JSON.stringify({status:'ok',clickhouse:'connected'}),{status:200,headers:{'content-type':'application/json'}}));
    const r=await POST(req({name:'Owner',email:'owner@example.com'}));
    expect(r.status).toBe(200);
    expect(await r.json()).toMatchObject({ok:true,delivery:'acr'});
    expect(fetchSpy).toHaveBeenCalledWith('https://acrtracking.stealthagents.us/api/health',expect.objectContaining({cache:'no-store'}));
  });

  it('does not claim success when both lead delivery and ACR are unavailable',async()=>{
    delete process.env.LEAD_WEBHOOK_URL;
    vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response('',{status:503}));
    const r=await POST(req({name:'Owner',email:'owner@example.com'}));
    expect(r.status).toBe(503);
    expect(await r.json()).toMatchObject({ok:false});
  });

  it('sends a valid lead to the configured server-side destination',async()=>{
    process.env.LEAD_WEBHOOK_URL='https://tracker.example.test/leads';
    const fetchSpy=vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response(null,{status:204}));
    const r=await POST(req({name:'Owner',email:'owner@example.com',referral_source:'Search',message:'Two locations'}));
    expect(r.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url,options]=fetchSpy.mock.calls[0];
    expect(url).toBe(process.env.LEAD_WEBHOOK_URL);
    expect(options).toMatchObject({method:'POST',headers:{'content-type':'application/json'}});
    expect(JSON.parse(String(options?.body))).toMatchObject({name:'Owner',email:'owner@example.com',referral_source:'Search',message:'Two locations',source:'mentalhealthadministrator.com'});
  });

  it('returns an error when the lead destination rejects the request',async()=>{
    process.env.LEAD_WEBHOOK_URL='https://tracker.example.test/leads';
    vi.spyOn(globalThis,'fetch').mockResolvedValue(new Response('',{status:500}));
    expect((await POST(req({name:'Owner',email:'owner@example.com'}))).status).toBe(502);
  });
});
