import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {services,ORIGIN,serviceTitleSuffix,serviceGroupFor} from '@/lib/site';
import {serviceSchema,breadcrumbSchema} from '@/lib/schema';
import {Breadcrumbs} from '@/components/Content';
import {ClosingCTA} from '@/components/Layout';

export function generateStaticParams(){return services.map(({slug})=>({slug}))}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const service=services.find((item)=>item.slug===slug);
 if(!service)return{};
 return{title:`${service.title} ${serviceTitleSuffix(slug)}`,description:service.summary,alternates:{canonical:`${ORIGIN}/services/${slug}`}};
}

export default async function ServicePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const service=services.find((item)=>item.slug===slug);
 if(!service)notFound();
 const crumbs=[{name:'Home',path:'/'},{name:'Services',path:'/services'},{name:service.title,path:`/services/${slug}`}];
 const related=services.filter((item)=>item.slug!==slug).sort((a,b)=>Number(serviceGroupFor(b.slug)===serviceGroupFor(slug))-Number(serviceGroupFor(a.slug)===serviceGroupFor(slug))).slice(0,3);
 return <>
  <section className="service-hero shell">
   <Breadcrumbs items={crumbs.map((item)=>({label:item.name,href:item.path}))}/>
   <div className="service-hero-grid">
    <div><p className="eyebrow">Nonclinical practice administration</p><h1>{service.title}</h1><p className="lede">{service.summary}</p><p className="service-audience"><b>Built for:</b> {service.audience}</p><Link className="button" href="/contact-us" id="cta-service-hero-consultation">Book a Free Consultation</Link></div>
    <figure className="service-hero-media"><img src={service.image} alt={service.imageAlt}/><figcaption>Practice workflow: {service.diagram.join(' to ')}</figcaption></figure>
   </div>
  </section>

  <section className="service-problem"><div className="shell service-problem-grid"><p className="eyebrow light">The operational gap</p><h2>Important work can happen<br/>and still <em>lose its owner.</em></h2><p>{service.problem}</p></div></section>

  <section className="section shell service-scope">
   <div className="service-section-heading"><div><p className="eyebrow">Work the assistant can handle</p><h2>Clear tasks.<br/><em>Visible outputs.</em></h2></div><p>The assignment begins with written client instructions. The assistant works from approved systems, source records, decision limits, and named contacts.</p></div>
   <div className="service-task-grid"><ul className="service-task-list">{service.tasks.map((task)=><li key={task}>{task}</li>)}</ul><aside className="service-outputs"><p className="eyebrow">What your team receives</p><ul>{service.deliverables.map((item)=><li key={item}>{item}</li>)}</ul></aside></div>
  </section>

  <section className="service-process section"><div className="shell"><div className="service-section-heading"><div><p className="eyebrow">A defined operating process</p><h2>From your rules<br/>to a <em>usable record.</em></h2></div></div><div className="service-process-grid">{service.process.map((step)=><article key={step.title}><h3>{step.title}</h3><p>{step.detail}</p></article>)}</div></div></section>

  <section className="section shell service-readiness"><div className="service-section-heading"><div><p className="eyebrow">Prepare the assignment</p><h2>Required inputs and<br/><em>quality controls.</em></h2></div><p>A useful launch starts with current source material, limited access, and checks that make routine work reviewable.</p></div><div className="service-readiness-grid"><article><h3>Required inputs</h3><ul>{service.inputs.map((item)=><li key={item}>{item}</li>)}</ul></article><article><h3>Quality controls</h3><ul>{service.qualityControls.map((item)=><li key={item}>{item}</li>)}</ul></article></div></section>

  <section className="section shell service-scenario"><div><p className="eyebrow">A practical example</p><h2>What this can look like<br/><em>in daily operations.</em></h2></div><blockquote>{service.scenario}</blockquote></section>

  <section className="service-mid-cta"><div className="shell"><div><p className="eyebrow light">Start with one workflow</p><h2>Show us the work that is being missed.</h2></div><div><p>We can discuss the systems, source records, required fields, decision limits, and contact steps your team wants documented.</p><Link className="button button-light" href="/contact-us" id="cta-service-mid-consultation">Book a Free Consultation</Link></div></div></section>

  <section className="section shell service-boundaries"><p className="eyebrow">Clear service boundaries</p><h2>Remote support helps your operation. Authority stays with your responsible team.</h2><div className="boundary-grid">{service.boundaries.map((boundary)=><p key={boundary}>{boundary}</p>)}</div></section>

  <section className="service-data-safeguards"><div className="shell"><div className="service-section-heading"><div><p className="eyebrow light">Secure handling rules</p><h2>Use only what the assignment needs.</h2></div><p>Access and records are scoped before work begins. The client keeps system ownership and approval authority.</p></div><div className="safeguard-grid"><article><h3>Least access</h3><p>Use separate named accounts with the least access needed for assigned sites, records, and actions. Do not share credentials.</p></article><article><h3>Protected sign-in</h3><p>Use client-approved secure transfer methods and multi-factor authentication wherever the client system supports it.</p></article><article><h3>Traceable work</h3><p>Keep activity, change, and handoff records in approved systems so the client can review work.</p></article><article><h3>Limited data life</h3><p>Collect only required fields and follow the client’s retention and deletion schedule.</p></article></div></div></section>

  <section className="section shell service-faqs"><p className="eyebrow">Frequently asked questions</p><h2>Questions about the scope</h2><div>{service.faqs.map((faq)=><details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>

  <section className="section shell service-related"><div className="service-section-heading"><div><p className="eyebrow">Related services</p><h2>Build the next useful handoff.</h2></div></div><div className="cards">{related.map((item)=><article className="card" key={item.slug}><h3><Link href={`/services/${item.slug}`}>{item.title}</Link></h3><p>{item.summary}</p><Link className="text-link" href={`/services/${item.slug}`}>Review the scope</Link></article>)}</div></section>

  <section className="service-next-action"><div className="shell"><p className="eyebrow light">Next action</p><h2>Bring one queue and its current handoff.</h2><p>We will help you identify the routine, source records, quality checks, and qualified decision owners.</p><Link className="button button-light" href="/contact-us" id="cta-service-next-action">Book a Free Consultation</Link></div></section>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(serviceSchema(slug))}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema(crumbs))}}/><ClosingCTA page={slug}/>
 </>;
}
