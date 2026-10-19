import Link from 'next/link';
import {LeadForm} from '@/components/LeadForm';
import {ReviewMarquee} from '@/components/ReviewMarquee';
import {EMAIL,ORIGIN,SITE_NAME} from '@/lib/site';
import {breadcrumbSchema} from '@/lib/schema';
import './contact.css';

export const metadata={title:'Contact Us for Mental Health Administration Support',description:'Book a free consultation about nonclinical intake, scheduling, referrals, payer administration, records, credentialing, and practice workflows.',alternates:{canonical:'/contact-us'},openGraph:{title:`Contact Us | ${SITE_NAME}`,description:'Discuss a clearly bounded mental health practice administration role.',url:`${ORIGIN}/contact-us`,images:['/images/contact-us.svg']}};
const steps=[['Workflow discovery','We map the nonclinical queue, source records, systems, required fields, access, volume, and qualified exception owners.'],['Role design','We separate routine administration from clinical, crisis, payer, coding, records-release, legal, financial, and compliance decisions.'],['Candidate matching','Stealth Agents identifies assistants whose administrative and communication experience fits the approved practice role.'],['Controlled launch','You approve templates, permissions, escalation paths, quality checks, and the first workflow before broader use.']];

export default function Contact(){
  const schemas=[breadcrumbSchema([{name:'Home',path:'/'},{name:'Contact Us',path:'/contact-us'}]),{'@context':'https://schema.org','@type':'ContactPage',name:`Contact ${SITE_NAME}`,url:`${ORIGIN}/contact-us`,description:'Consultation page for nonclinical mental health practice administration support.',mainEntity:{'@type':'Organization',name:SITE_NAME,url:ORIGIN,email:EMAIL}}];
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemas)}}/>
    <section className="contact-conversion">
      <div className="contact-shell contact-conversion-grid">
        <div className="contact-conversion-copy">
          <p className="eyebrow light">Contact Us</p>
          <h1>Give the work around care a clear owner.</h1>
          <p className="contact-scope">Nonclinical intake · Scheduling · Referrals · Payer administration · Records · Practice operations</p>
          <p>Tell us which routine workflow needs ownership and where clinical or authorized decisions must take over. Do not submit client or patient information.</p>
          <ReviewMarquee/>
        </div>
        <div className="contact-form-card">
          <p className="eyebrow">Tell us about your needs</p>
          <h2>Book a Free Consultation</h2>
          <LeadForm placement="contact-page"/>
        </div>
      </div>
    </section>

    <section className="contact-parent">
      <div className="contact-shell contact-parent-grid">
        <figure className="contact-team-photo">
          <img src="/images/team-bacolod.jpg" alt="Stealth Agents team in Bacolod"/>
        </figure>
        <div>
          <div className="contact-team-plate"><img className="contact-parent-logo" src="/images/stealth-agents-logo-black.png" alt="Stealth Agents"/><span>Official team, Bacolod</span></div>
          <p className="eyebrow light">Managed service support</p>
          <h2>Mental health administration focus. Stealth Agents support.</h2>
          <p>Stealth Agents provides dedicated remote professionals with structured recruiting, onboarding, role design, and ongoing account support. For a mental health practice, that managed-service model helps turn a defined nonclinical queue into documented responsibilities, access boundaries, approved scripts, quality checks, and clear escalation owners.</p>
          <p>{SITE_NAME} focuses that support on the administrative work around care. Clinical judgment, crisis response, payer interpretation, records-release decisions, and other protected decisions remain with qualified and authorized practice personnel.</p>
          <a className="button button-light" href="#lead-form-contact-page">Book a Free Consultation</a>
        </div>
      </div>
    </section>

    <section className="contact-process-long"><div className="contact-shell"><div className="contact-heading-long"><p className="eyebrow light">After you reach out</p><h2>A controlled path from workflow to launch.</h2></div><div className="contact-step-grid-long">{steps.map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

    <section className="contact-shell contact-prepare-long"><div><p className="eyebrow">Prepare for a useful call</p><h2>Bring context, not protected health information.</h2></div><div className="contact-card-grid-long"><article><h3>Recurring work</h3><p>List administrative intake, calendars, referrals, payer follow-up, credentialing, records indexes, and reports that repeat.</p></article><article><h3>Current ownership</h3><p>Note who handles each task now and which licensed or authorized role owns exceptions.</p></article><article><h3>Systems and access</h3><p>Identify EHR, practice management, payer, portal, document, and communication tools plus minimum access.</p></article><article><h3>Service standard</h3><p>Bring required fields, response paths, escalation timing, privacy rules, and objective quality checks.</p></article></div></section>

    <section className="contact-boundaries-long"><div className="contact-shell contact-two-col"><div><p className="eyebrow light">Responsibility and boundaries</p><h2>Nonclinical support never replaces qualified care or crisis response.</h2><p>Assistants can organize approved administrative fields, calendars, records, payer responses, and routine messages while routing protected topics.</p></div><div className="contact-boundary-card"><h3>Qualified and authorized personnel retain</h3><ul><li>Crisis response, risk assessment, triage, diagnosis, treatment, and medication guidance</li><li>Clinical fit, urgency, level of care, provider assignment, and client acceptance</li><li>Coding, coverage interpretation, payer appeals, billing adjustments, and financial authority</li><li>Records release, privacy, legal, compliance, and security decisions</li><li>Executive judgment and final client or patient commitments</li></ul><p>If someone may be in immediate danger, contact local emergency services or the appropriate crisis resource. This consultation page is not monitored for emergencies.</p></div></div></section>

    <section className="contact-shell contact-starting-long"><div className="contact-heading-long"><p className="eyebrow">Common starting points</p><h2>Begin with one defined administrative queue.</h2></div><div className="contact-link-grid-long"><Link href="/services/mental-health-intake-and-referral-coordination"><strong>Intake and referral coordination</strong><small>Approved fields, forms, and qualified review handoffs</small></Link><Link href="/services/mental-health-appointment-scheduling"><strong>Appointment scheduling</strong><small>Provider-approved calendars and exception routing</small></Link><Link href="/services/behavioral-health-insurance-administration"><strong>Insurance administration</strong><small>Source responses, authorization status, and payer logs</small></Link><Link href="/services/mental-health-ehr-and-records-administration"><strong>EHR and records administration</strong><small>Minimum access, document status, and authorized custody</small></Link></div><Link className="text-link contact-all-services" href="/services">View the full services collection →</Link></section>

    <section className="contact-faq-long"><div className="contact-shell contact-two-col"><div><p className="eyebrow">Frequently asked questions</p><h2>Questions before a consultation.</h2></div><div className="contact-faq-list"><details><summary>What can a mental health administrative assistant handle?</summary><p>An assistant can support approved intake administration, scheduling, referrals, routine communication, eligibility records, authorization tracking, credentialing, records indexes, and reporting.</p></details><details><summary>Can an assistant provide clinical screening or crisis support?</summary><p>No. Assistants do not assess symptoms, risk, urgency, diagnosis, treatment, medication, clinical fit, or safety. Protected topics follow the practice&apos;s qualified transfer and emergency procedures.</p></details><details><summary>Does this page claim HIPAA compliance or BAA availability?</summary><p>No. Sensitive information handling requires separate technical, contractual, privacy, security, and operational review. Do not submit protected health information through this form.</p></details><details><summary>Can support cover several clinicians or locations?</summary><p>Yes, when provider calendars, locations, appointment types, permissions, templates, and escalation owners are clearly documented and separated.</p></details><details><summary>What should we bring to the first call?</summary><p>Bring one administrative workflow, systems, current owners, deidentified examples, required fields, volume, exception rules, and retained decisions.</p></details><details><summary>What happens after the consultation?</summary><p>If there is a fit, the workflow becomes a role outline with candidate requirements, onboarding inputs, access limits, review checks, and a controlled launch plan.</p></details></div></div></section>
  </>;
}
