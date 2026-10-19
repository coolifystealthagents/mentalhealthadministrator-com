import {createHash} from 'node:crypto';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {describe,expect,it} from 'vitest';

const root=path.resolve(__dirname,'..');
const read=(file:string)=>readFileSync(path.join(root,file),'utf8');
const sha256=(file:string)=>createHash('sha256').update(readFileSync(path.join(root,file))).digest('hex');

describe('V3 global shell and conversion journey',()=>{
  it('uses the exact primary navigation, accessible mobile behavior, and parent attribution in both landmarks',()=>{
    const layout=read('src/components/Layout.tsx');
    const css=read('src/app/globals.css');
    expect(layout).toContain("['Home','/']");
    expect(layout).toContain("['Services','/services']");
    expect(layout).toContain("['Contact Us','/contact-us']");
    expect(layout).toContain('aria-expanded={open}');
    expect(layout).toContain('aria-controls="primary-navigation"');
    expect(layout).toContain("event.key==='Escape'");
    expect(layout).toContain("event.key!=='Tab'");
    expect(layout).toContain("document.body.style.overflow='hidden'");
    expect(layout).toContain('element.inert=true');
    expect(layout).toContain('menuButton.current?.focus()');
    expect(layout).toContain('Skip to main content');
    expect(layout.match(/<ParentBrand\/>/g)).toHaveLength(2);
    expect(layout).toContain('Powered by StealthAgents');
    expect(layout).toContain('/images/stealth-agents-logo-black.png');
    expect(layout).not.toMatch(/font-size:0/);
    expect(css).toMatch(/\.site-header\{[^}]*position:sticky/);
    expect(css).toMatch(/\.skip-link:focus/);
    expect(css).toMatch(/\.menu-toggle\{[^}]*display:none/);
    expect(css).toMatch(/@media\(max-width:\d+px\)[\s\S]*\.menu-toggle\{[^}]*display:/);
    expect(layout).toContain("window.matchMedia('(min-width:1101px)')");
    expect(layout).toContain("desktop.addEventListener('change',leaveDrawer)");
    expect(css).toMatch(/@media\(max-width:\d+px\)[\s\S]*\.nav nav\.is-open/);
    expect(css).not.toMatch(/@media\(max-width:\d+px\)[\s\S]*\.nav \.parent-brand\{[^}]*display:none/);
  });

  it('removes the global timed lead popup and its old QA contract',()=>{
    expect(existsSync(path.join(root,'src/components/TimedLeadPopup.tsx'))).toBe(false);
    expect(read('src/app/layout.tsx')).not.toContain('TimedLeadPopup');
    expect(read('scripts/qa.mjs')).not.toMatch(/popup\(\)|TimedLeadPopup|eight second timer/);
    expect(read('package.json')).not.toContain('qa:popup');
  });

  it('checks in unique approved review provenance and renders one record per review without controls or cloned data',()=>{
    const records=JSON.parse(read('src/data/stealth-agents-reviews.json')) as Array<{quote:string;name:string;role:string;sourceUrl:string;verifiedOn:string;evidenceId:string;evidenceDigest:string}>;
    expect(records.length).toBeGreaterThanOrEqual(10);
    expect(new Set(records.map(({quote,name,role})=>`${quote}|${name}|${role}`)).size).toBe(records.length);
    for(const record of records){
      expect(record.sourceUrl).toBe('https://stealthagents.com');
      expect(record.verifiedOn).toBe('2026-10-16');
      expect(record.evidenceId).toMatch(/^stealthagents-homepage-review-\d{2}$/);
      expect(record.evidenceDigest).toBe(createHash('sha256').update(`${record.quote}|${record.name}|${record.role}|5`).digest('hex'));
    }
    expect(new Set(records.map(record=>record.evidenceId)).size).toBe(records.length);
    expect(records).toContainEqual(expect.objectContaining({quote:'Lindsay has been incredible. She handles the tactical work, which has freed me up to focus on bigger-picture initiatives.',name:'Chad Sublet',role:'Business Owner'}));
    const marquee=read('src/components/ReviewMarquee.tsx');
    const css=read('src/app/globals.css')+read('src/app/contact-us/contact.css');
    expect(marquee).toContain('StealthAgents reviews');
    expect(marquee).toContain('reviews.map');
    expect(marquee).toContain('appendChild');
    expect(marquee).toContain('prefers-reduced-motion: reduce');
    expect(marquee).toContain("addEventListener('mouseenter'");
    expect(marquee).toContain("addEventListener('focusin'");
    expect(marquee).toContain('tabIndex={0}');
    expect(marquee).toContain('aria-label="5 out of 5 stars"');
    expect(marquee).toContain('<h3>Client perspective</h3>');
    expect(marquee).not.toMatch(/concat|\.\.\.reviews|button|controls/i);
    expect(css).toMatch(/\.review-stars\{[^}]*color:#/);
    expect(css).toMatch(/@media\(prefers-reduced-motion:reduce\)[\s\S]*\.review-marquee-track\{[^}]*overflow-x:auto/);
  });

  it('keeps the complete lead contract above the fold and excludes OnceHub from contact',()=>{
    const contact=read('src/app/contact-us/page.tsx');
    const form=read('src/components/LeadForm.tsx');
    const css=read('src/app/contact-us/contact.css');
    expect(contact).toContain('<ReviewMarquee');
    expect(contact).toContain('<LeadForm placement="contact-page"/>');
    expect(contact).not.toMatch(/oncehub/i);
    expect(contact).not.toContain('contact-hero-long');
    expect(contact).not.toMatch(/>0[1-4]</);
    expect(css).toMatch(/\.contact-conversion/);
    expect(css).toMatch(/@media\(min-width:1100px\)[\s\S]*\.contact-conversion/);
    expect(css).toMatch(/@media\(min-width:1100px\)[\s\S]*\.contact-form-card form/);
    for(const field of ['first_name','last_name','email','phone_country','phone','company','company_website','company_size','positions_to_fill','referral_source','message','website_url'])expect(form).toContain(`name="${field}"`);
    expect(form).toContain("fetch('/api/submit-lead'");
    expect(form).not.toContain('tracker.trackLead({');
    expect(form).toContain("window.location.assign('/thank-you')");
  });

  it('uses the exact official parent plate and locally verified first party assets',()=>{
    const contact=read('src/app/contact-us/page.tsx');
    expect(contact).toContain('Official team, Bacolod');
    expect(contact).toContain('contact-team-plate');
    expect(contact).toMatch(/contact-team-plate[\s\S]*stealth-agents-logo-black\.png[\s\S]*Official team, Bacolod/);
    expect(contact).toContain('/images/team-bacolod.jpg');
    expect(contact).toContain('/images/stealth-agents-logo-black.png');
    expect(sha256('public/images/stealth-agents-logo-black.png')).toBe('bc5b225c1bf37d71ab282bc6d59b519e717263a8ecddd2423225a56d47416e45');
    expect(sha256('public/images/team-bacolod.jpg')).toBe('e80f0e94a80f5ddceba7fbcf723774689e47089bce7981c9f2bdb4205ea52767');
  });

  it('embeds the exact OnceHub URL only on thank-you with fallback, noindex, and CSP support',()=>{
    const thankYou=read('src/app/thank-you/page.tsx');
    const direct=read('src/app/thanks-whats-next/page.tsx');
    const contact=read('src/app/contact-us/page.tsx');
    expect(thankYou.match(/https:\/\/go\.oncehub\.com\/StealthAgentsTeam/g)).toHaveLength(2);
    expect(thankYou).not.toContain('</iframe>');
    expect(thankYou).toContain('robots:{index:false,follow:false}');
    expect(contact).not.toMatch(/oncehub/i);
    expect(direct).toMatch(/booking confirmed/i);
    expect(direct).toContain('Your consultation time has been booked');
    expect(direct).not.toContain('<BookingEvent');
    expect(thankYou).toContain('If the scheduler does not load');
    expect(read('next.config.ts')).toContain('frame-src https://go.oncehub.com');
    expect(read('next.config.ts')).toContain('https://acrtracking.stealthagents.us');
    expect(read('next.config.ts')).toContain('camera=("https://go.oncehub.com")');
    expect(read('next.config.ts')).toContain('microphone=("https://go.oncehub.com")');
  });
});
