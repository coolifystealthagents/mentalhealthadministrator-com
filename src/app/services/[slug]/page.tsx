import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {services,ORIGIN,serviceTitleSuffix} from '@/lib/site';
import {serviceSchema,breadcrumbSchema} from '@/lib/schema';
import {Breadcrumbs} from '@/components/Content';
import {ClosingCTA} from '@/components/Layout';

export function generateStaticParams(){return services.map(({slug})=>({slug}))}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const service=services.find((item)=>item.slug===slug);
  if(!service)return{};
  return{
    title:`${service.title} ${serviceTitleSuffix(slug)}`,
    description:service.summary,
    alternates:{canonical:`${ORIGIN}/services/${slug}`}
  };
}

export default async function ServicePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const service=services.find((item)=>item.slug===slug);
  if(!service)notFound();

  const crumbs=[
    {name:'Home',path:'/'},
    {name:'Services',path:'/services'},
    {name:service.title,path:`/services/${slug}`}
  ];

  return <>
    <section className="service-hero shell">
      <Breadcrumbs items={crumbs.map((item)=>({label:item.name,href:item.path}))}/>
      <div className="service-hero-grid">
        <div>
          <p className="eyebrow">Nonclinical practice administration</p>
          <h1>{service.title}</h1>
          <p className="lede">{service.summary}</p>
          <p className="service-audience"><b>Built for:</b> {service.audience}</p>
          <Link className="button" href="/contact-us" id="cta-service-hero-consultation">Book a Free Consultation</Link>
        </div>
        <div className="service-diagram" aria-label={`${service.title} workflow`}>
          <p className="diagram-label">How the work moves</p>
          {service.diagram.map((label,index)=><div className="diagram-step" key={label}>
            <span>{String(index+1).padStart(2,'0')}</span>
            <b>{label}</b>
            {index<service.diagram.length-1&&<i aria-hidden="true">↓</i>}
          </div>)}
        </div>
      </div>
    </section>

    <section className="service-problem">
      <div className="shell service-problem-grid">
        <p className="eyebrow light">The operational gap</p>
        <h2>Important work can happen<br/>and still <em>lose its owner.</em></h2>
        <p>{service.problem}</p>
      </div>
    </section>

    <section className="section shell service-scope">
      <div className="service-section-heading">
        <div><p className="eyebrow">Work the assistant can handle</p><h2>Clear tasks.<br/><em>Visible outputs.</em></h2></div>
        <p>The assignment begins with written client instructions. The assistant works from approved systems, source records, decision limits, and named contacts.</p>
      </div>
      <div className="service-task-grid">
        <ol className="service-task-list">{service.tasks.map((task,index)=><li key={task}><span>{String(index+1).padStart(2,'0')}</span>{task}</li>)}</ol>
        <aside className="service-outputs"><p className="eyebrow">What your team receives</p><ul>{service.deliverables.map((item)=><li key={item}>{item}</li>)}</ul></aside>
      </div>
    </section>

    <section className="service-process section">
      <div className="shell">
        <div className="service-section-heading"><div><p className="eyebrow">A defined operating process</p><h2>From your rules<br/>to a <em>usable record.</em></h2></div></div>
        <div className="service-process-grid">{service.process.map((step,index)=><article key={step.title}><span>{String(index+1).padStart(2,'0')}</span><h3>{step.title}</h3><p>{step.detail}</p></article>)}</div>
      </div>
    </section>

    <section className="section shell service-scenario">
      <div><p className="eyebrow">A practical example</p><h2>What this can look like<br/><em>in daily operations.</em></h2></div>
      <blockquote>{service.scenario}</blockquote>
    </section>

    <section className="service-mid-cta"><div className="shell">
      <div><p className="eyebrow light">Start with one workflow</p><h2>Show us the work that is being missed.</h2></div>
      <div><p>We can discuss the systems, source records, required fields, decision limits, and contact steps your team wants documented.</p><Link className="button button-light" href="/contact-us" id="cta-service-mid-consultation">Book a Free Consultation</Link></div>
    </div></section>

    <section className="section shell service-boundaries">
      <p className="eyebrow">Clear service boundaries</p>
      <h2>Remote support helps your operation. Authority stays with your responsible team.</h2>
      <div className="boundary-grid">{service.boundaries.map((boundary)=><p key={boundary}>{boundary}</p>)}</div>
    </section>

    <section className="service-data-safeguards"><div className="shell">
      <div className="service-section-heading"><div><p className="eyebrow light">Secure handling rules</p><h2>Use only what the assignment needs.</h2></div><p>Access and records are scoped before work begins. The client keeps system ownership and approval authority.</p></div>
      <div className="safeguard-grid">
        <article><span>01</span><h3>Least access</h3><p>Use separate named accounts with the least access needed for assigned sites, records, and actions. Do not share credentials between assistants or customers.</p></article>
        <article><span>02</span><h3>Protected sign-in</h3><p>Use client-approved secure transfer methods and multi-factor authentication wherever the client system supports it. Keep each customer workspace separated.</p></article>
        <article><span>03</span><h3>Traceable work</h3><p>Keep activity, change, and handoff records in approved systems so the client can review who handled an item and when.</p></article>
        <article><span>04</span><h3>Limited data life</h3><p>Collect only required fields and follow the client’s retention and deletion schedule. Return or remove access and working data when the assignment ends.</p></article>
      </div>
    </div></section>

    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(serviceSchema(slug))}}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema(crumbs))}}/>
    <ClosingCTA page={slug}/>
  </>;
}
