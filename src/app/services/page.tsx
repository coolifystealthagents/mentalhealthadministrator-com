import Link from 'next/link';
import {services} from '@/lib/site';
import {ClosingCTA} from '@/components/Layout';

export const metadata={title:'Services',description:'Eight focused nonclinical virtual assistant services for mental health practice administration.',alternates:{canonical:'/services'}};

const launchSteps=[
 ['Map the queue','Name the current systems, incoming work, required fields, decision owners, and service expectations.'],
 ['Separate decisions','Identify every clinical, payer, coding, records, financial, and legal exception that requires authorized review.'],
 ['Build the routine','Create approved templates, statuses, quality checks, and handoff rules for repeatable administration.'],
 ['Review and refine','Reconcile completed work, inspect exceptions, and update the written workflow under practice ownership.']
];

export default function Services(){return <>
 <section className="hero shell"><div><p className="eyebrow">The administrative service index</p><h1>Choose the workflow that needs <em>a reliable owner.</em></h1><p className="lede">Eight focused service scopes cover access, scheduling, routine communication, payer work, records, credentialing, claims follow-up, and practice reporting.</p><Link className="button" href="/contact-us" id="cta-services-hero-consultation">Book a Free Consultation</Link></div><img src="/images/services.svg" alt="Abstract administrative index with organized documents and status markers"/></section>
 <section className="section shell"><div className="section-heading"><div><p className="eyebrow">All services</p><h2>Concrete tasks.<br/><em>Visible boundaries.</em></h2></div><p>Each scope starts with approved source systems and written routing rules. No service delegates clinical judgment, crisis response, coding decisions, or release authority.</p></div><div className="service-directory-grid">{services.map((service)=><article className="service-directory-card" key={service.slug}><h3><Link href={`/services/${service.slug}`}>{service.title}</Link></h3><p>{service.summary}</p><p className="ledger-label">Built for</p><p>{service.audience}</p><Link className="text-link" href={`/services/${service.slug}`} id={`cta-services-${service.slug}`}>Review the scope</Link></article>)}</div></section>
 <section className="day-at-desk"><div className="shell"><div className="day-heading"><p className="eyebrow light">How assignments begin</p><h2>Start narrow.<br/><em>Document the handoff.</em></h2></div><div className="day-list">{launchSteps.map(([title,copy])=><article key={title}><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div></section>
 <ClosingCTA page="services"/>
 </>}
