import Link from 'next/link';
import Image from 'next/image';
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
 <section className="services-index-hero shell"><div className="services-index-copy"><p className="eyebrow">Mental health practice administration</p><h1>Give recurring administrative work <em>a clear owner.</em></h1><p className="lede">Choose a focused service for the queue that is slowing access or follow-through: intake, scheduling, payer administration, records, credentialing, claims follow-up, or reporting.</p><Link className="button" href="/contact-us" id="cta-services-hero-consultation">Book a Free Consultation</Link></div><figure className="services-index-photo"><Image src="/images/services-administrator-scheduling.webp" alt="Behavioral health practice administrator coordinating a clinic schedule in a calm office" fill priority sizes="(max-width: 1100px) calc(100vw - 3rem), 45vw"/><figcaption>Administrative support works from your approved systems, priorities, and escalation rules.</figcaption></figure></section>
 <section className="section shell services-directory"><div className="section-heading"><div><p className="eyebrow">Eight focused services</p><h2>Choose by queue,<br/><em>not job title.</em></h2></div><p>Each scope begins with approved source systems, written routing rules, and a named decision owner. Clinical judgment, crisis response, coding decisions, records release, and financial authority remain with the practice.</p></div><div className="service-directory-grid">{services.map((service)=><article className="service-directory-card" key={service.slug}><h3><Link href={`/services/${service.slug}`}>{service.title}</Link></h3><p>{service.summary}</p><p className="ledger-label">Best fit</p><p>{service.audience}</p><Link className="text-link" href={`/services/${service.slug}`} id={`cta-services-${service.slug}`}>See tasks and boundaries</Link></article>)}</div></section>
 <section className="day-at-desk services-launch"><div className="shell"><div className="day-heading"><p className="eyebrow light">How an assignment starts</p><h2>Begin with one queue.<br/><em>Document every handoff.</em></h2><p>Start with a bounded workflow, confirm who owns exceptions, then refine the written routine from real operating feedback.</p></div><div className="day-list">{launchSteps.map(([title,copy])=><article key={title}><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div></section>
 <ClosingCTA page="services"/>
 </>}
