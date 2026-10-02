import {describe,expect,it} from 'vitest';import {readFileSync} from 'node:fs';import path from 'node:path';const root=path.resolve(__dirname,'..');const read=(p:string)=>readFileSync(path.join(root,p),'utf8');
describe('practice desk design system',()=>{
 it('defines the distinct visual tokens',()=>{const css=read('src/app/globals.css').replaceAll(' ','').toLowerCase();for(const t of ['--paper:#f7f3ea','--aubergine:#2b202b','--moss:#617969','--apricot:#e98263','--lavender:#ddd5e7'])expect(css).toContain(t);expect(css).not.toContain('--coral:#eb5b55')});
 it('uses art-directed homepage sections and desk animation',()=>{const home=read('src/app/page.tsx');for(const c of ['practice-desk-hero','operations-index','principles-strip','day-at-desk','editorial-ledger','desk-loop'])expect(home).toContain(c);expect(read('src/app/globals.css')).toContain('8s linear infinite')});
 it('uses the new folio identity and consultation action',()=>{const layout=read('src/components/Layout.tsx');expect(layout).toContain('M7 10c7');expect(layout).toContain('Book a Free Consultation');expect(layout).not.toContain('circle cx="20" cy="20"')});
 it('supports responsive layouts and reduced motion',()=>{const css=read('src/app/globals.css');expect(css).toMatch(/@media\(max-width:650px\)/);expect(css).toMatch(/prefers-reduced-motion:reduce/)});
});
