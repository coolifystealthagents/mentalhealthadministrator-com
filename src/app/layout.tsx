import type {Metadata} from 'next';
import {DM_Sans,Newsreader} from 'next/font/google';
import Script from 'next/script';
import {Header,Footer} from '@/components/Layout';
import {organizationSchema} from '@/lib/schema';
import './globals.css';
const sans=DM_Sans({subsets:['latin'],variable:'--font-sans'});const display=Newsreader({subsets:['latin'],variable:'--font-serif'});
export const metadata:Metadata={metadataBase:new URL('https://mentalhealthadministrator.com'),title:{default:'Virtual Assistants for Mental Health Administration',template:'%s | Mental Health Administrator'},description:'Nonclinical virtual assistants support intake, scheduling, referrals, payer administration, records, and routine communication for mental health practices.',alternates:{canonical:'/'},openGraph:{type:'website',siteName:'Mental Health Administrator',images:['/og-default.svg']},twitter:{card:'summary_large_image',images:['/og-default.svg']}};
const acrConfig=`window.ACR_TRACKER_CONFIG={siteId:'mental-health-administrator',endpoint:'/ingest/track',debug:false,funnelSteps:[{path:'/contact-us',step:1,label:'Form Page',event:'funnel_form_page'},{path:'/thank-you',step:2,label:'Form Submitted',event:'funnel_form_submitted'},{path:'/thanks-whats-next',step:3,label:'Booking Confirmed',event:'funnel_booking_confirmed'}]};`;
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={`${sans.variable} ${display.variable}`}><body><Script id="acr-tracker-config" strategy="beforeInteractive">{acrConfig}</Script><Script id="acr-tracker-bundle" src="https://acrtracking.stealthagents.us/v1/tracker.js" strategy="afterInteractive"/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organizationSchema)}}/><Header/><main id="main-content" tabIndex={-1}>{children}</main><Footer/></body></html>}
