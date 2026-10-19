import type {Metadata} from 'next';

const schedulerUrl='https://go.oncehub.com/StealthAgentsTeam';
export const metadata:Metadata={title:'Schedule Your Free Consultation',description:'Choose a consultation time to discuss a clearly bounded nonclinical practice administration workflow with our support team.',robots:{index:false,follow:false}};

export default function ThankYou(){return <section className="section shell"><p className="eyebrow">Request received</p><h1>Choose a consultation time</h1><p className="lede">Your form was submitted. Use the scheduler below to request a time to discuss your nonclinical administrative workflow. A time is not confirmed until the scheduler shows confirmation.</p><iframe title="Schedule a free consultation with the Stealth Agents team" src={schedulerUrl} width="100%" height="720" style={{border:0}}/><p>If the scheduler does not load, <a href="https://go.oncehub.com/StealthAgentsTeam">open the consultation scheduler in a new page</a>.</p></section>}
