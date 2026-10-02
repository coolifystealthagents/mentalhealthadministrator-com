import {describe,expect,it} from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

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
      "'X-Forwarded-For':clientIp",
      "'X-ACR-Client-IP':clientIp",
      "cache:'no-store'",
      'AbortSignal.timeout(10_000)',
      "'Cache-Control':'no-store'",
      "status:413",
      "status:502",
    ]) expect(compact).toContain(marker);
    expect(route).toContain('https://acrtracking.stealthagents.us/api/track');
  });

  it('declares the hosted browser API and tracks the full lead only after site delivery',()=>{
    const globals=read('src/types/global.d.ts');
    const form=read('src/components/LeadForm.tsx');
    expect(globals).toContain('ACR_TRACKER_CONFIG?');
    expect(globals).toContain('trackLead:');
    expect(form).toContain('tracker.trackLead({');
    expect(form.indexOf('if(!r.ok)')).toBeLessThan(form.indexOf('tracker.trackLead({'));
    for(const field of ['name','email','referral_source','message','source','formId']) expect(form).toContain(field);
    expect(form).not.toContain("track('lead_submitted'");
  });

  it('implements the site-owned two-probe server fallback without exposing a webhook',()=>{
    const fallback=read('src/lib/lead-fallback-mattermost.ts');
    const api=read('src/app/api/submit-lead/route.ts');
    expect(fallback).toContain("'use server'");
    expect(fallback).toContain('SITE_MATTERMOST_FALLBACK_WEBHOOK_URL');
    expect(fallback).toContain("ACR_FALLBACK_FORCE_DOWN === '1'");
    expect(fallback.match(/await isACRHealthy\(\)/g)?.length).toBe(2);
    expect(fallback).toContain('setTimeout(resolve, 15_000)');
    expect(fallback).toContain('AbortSignal.timeout(2_000)');
    expect(fallback).toContain('[SITE-DIRECT:${SITE_ID}]');
    expect(api).toContain('sendLeadFallbackToMattermost');
    expect(api.indexOf('if(!response.ok)throw')).toBeLessThan(api.lastIndexOf('scheduleFallback'));
    const all=sourceFiles().join('\n');
    expect(all).not.toMatch(/https?:\/\/[^\s'"`]+\/hooks\//);
    expect(all).not.toContain("ACR_FALLBACK_FORCE_DOWN='1'");
  });

  it('gives every marketing action a valid stable CTA id',()=>{
    const files=['src/app/page.tsx','src/app/about/page.tsx','src/app/services/[slug]/page.tsx','src/components/Layout.tsx'];
    const source=files.map(read).join('\n');
    const ids=[...source.matchAll(/id=(?:"cta-[a-z0-9-]+"|\{`cta-[^`]+`\})/g)].map((match)=>match[0]);
    expect(ids.length).toBeGreaterThan(8);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
