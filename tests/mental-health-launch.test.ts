import {describe,expect,it} from 'vitest';
import {readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {services,DOMAIN,SITE_NAME,basePaths,sitemapPaths} from '../src/lib/site';
import {articles} from '../src/lib/articles';
import {researchItems} from '../src/lib/research';
import {alternatives} from '../src/lib/alternatives';
const root=path.resolve(__dirname,'..');
const read=(p:string)=>readFileSync(path.join(root,p),'utf8');
const corpus=(dir:string)=>readdirSync(path.join(root,dir)).filter(x=>x.endsWith('.mdx'));

describe('mental health administrator launch contract',()=>{
 it('uses exact independent identity and focused route corpus',()=>{
  expect(SITE_NAME).toBe('Mental Health Administrator'); expect(DOMAIN).toBe('mentalhealthadministrator.com');
  expect(services).toHaveLength(8); expect(basePaths).toHaveLength(10); expect(sitemapPaths).toHaveLength(18);
 });
 it('loads the complete editorial corpus',()=>{
  expect(corpus('content/articles')).toHaveLength(5); expect(corpus('content/research')).toHaveLength(20); expect(corpus('content/alternatives')).toHaveLength(4);
  expect(articles).toHaveLength(5); expect(researchItems).toHaveLength(20); expect(alternatives).toHaveLength(4);
 });
 it('defines the practice desk design rather than reference styling',()=>{
  const css=read('src/app/globals.css');
  for(const token of ['--paper:#f7f3ea','--aubergine:#2b202b','--moss:#617969','--apricot:#e98263','--lavender:#ddd5e7']) expect(css.toLowerCase().replaceAll(' ','')).toContain(token);
  expect(css).toContain('prefers-reduced-motion'); expect(css).not.toContain('--coral: #eb5b55');
  const home=read('src/app/page.tsx'); for(const marker of ['practice-desk-hero','operations-index','principles-strip','day-at-desk','editorial-ledger']) expect(home).toContain(marker);
 });
 it('keeps healthcare administration nonclinical and truthful',()=>{
  for(const service of services){expect(service.boundaries.length).toBeGreaterThanOrEqual(4);expect(service.tasks.length).toBeGreaterThanOrEqual(6);expect(service.process).toHaveLength(4)}
  const all=[...services.map(x=>JSON.stringify(x)),...articles.map(x=>x.body),...alternatives.map(x=>x.body)].join('\n').toLowerCase();
  expect(all).not.toMatch(/guarantee(?:d)? outcomes|we are hipaa compliant|improve clinical outcomes/);
 });
 it('uses the exact form warning, funnel source, and fail closed delivery',()=>{
  const form=read('src/components/LeadForm.tsx'); expect(form).toContain('Do not include client names, diagnoses, appointment details, or other protected health information.'); expect(form).toContain('mentalhealthadministrator.com');
  const api=read('src/app/api/submit-lead/route.ts'); expect(api).toContain("source:'mentalhealthadministrator.com'"); expect(api).toContain('status:503');
 });
 it('contains no stale parent identity or prohibited dash characters in visitor source',()=>{
  const dirs=['src','content']; const files:string[]=[];
  const walk=(p:string)=>{for(const e of readdirSync(path.join(root,p),{withFileTypes:true})){const r=path.join(p,e.name);if(e.isDirectory())walk(r);else if(/\.(tsx?|mdx|css)$/.test(e.name))files.push(r)}}; dirs.forEach(walk);
  for(const file of files){const text=read(file);expect(text,`${file} stale brand`).not.toMatch(/Security Monitoring Service|securitymonitoringservice\.com/);expect(text,`${file} prohibited dash`).not.toMatch(/[\u2014\u2013]/)}
 });
});
