export const SITE_NAME='Mental Health Administrator';
export const DOMAIN='mentalhealthadministrator.com';
export const ORIGIN=`https://${DOMAIN}`;
export const EMAIL='hello@mentalhealthadministrator.com';
export const EDITORIAL_TEAM='Mental Health Administrator Editorial Team';

export type Service={
  slug:string;
  title:string;
  summary:string;
  audience:string;
  problem:string;
  tasks:string[];
  deliverables:string[];
  process:{title:string;detail:string}[];
  scenario:string;
  diagram:[string,string,string,string];
  boundaries:string[];
};

export const services:Service[]=[
  {
    slug:'mental-health-intake-and-referral-coordination',
    title:'Mental Health Intake and Referral Coordination',
    summary:'Nonclinical administration for receiving inquiries, collecting client-approved demographic details, and routing referral records to qualified practice staff.',
    audience:'Independent clinicians, group practices, and behavioral health organizations with referral inquiries spread across phone, email, portal, and partner channels.',
    problem:'Referral inquiries can stall when contact details, consent status, requested service, source records, and ownership are incomplete or stored in separate places. Qualified staff then spend time locating administrative facts instead of reviewing cases and making clinical decisions.',
    tasks:['Log new inquiries in the client-approved system','Collect only the approved demographic and contact fields','Send client-approved forms and administrative instructions','Record receipt status for consent and referral documents','Check directories for client-specified nonclinical matching fields such as location, hours, and accepted plan','Route complete records to the named licensed or authorized reviewer','Send approved status updates without interpreting symptoms or urgency'],
    deliverables:['Intake administration checklist','Referral inquiry queue','Missing-document follow-up log','Reviewer handoff record','Administrative status message history'],
    process:[{title:'Define the intake fields',detail:'The practice names approved channels, required administrative fields, forms, owners, and routing rules.'},{title:'Collect and organize',detail:'The assistant records supplied information and tracks forms without conducting a clinical interview or screening.'},{title:'Route for qualified review',detail:'The organized record goes to the practice professional responsible for suitability, urgency, and care decisions.'},{title:'Close the administrative loop',detail:'Approved status messages, ownership, and unresolved document requests are recorded.'}],
    scenario:'A group practice receives a referral from a primary care office with a client name and phone number but no signed release or insurance image. The assistant logs the inquiry, sends the practice-approved paperwork, records what arrives, and routes the completed administrative packet to the intake clinician. The clinician, not the assistant, decides whether the practice is appropriate and what happens next.',
    diagram:['Inquiry received','Fields organized','Qualified review','Status recorded'],
    boundaries:['No crisis response, triage, diagnosis, treatment, or clinical screening','No determination of clinical fit, urgency, level of care, or provider appropriateness','No promise of acceptance, appointment availability, benefits, or payment','Any symptom, safety, or urgent concern is transferred to the client-designated qualified professional or emergency pathway without assessment by the assistant']
  },
  {
    slug:'mental-health-appointment-scheduling',
    title:'Mental Health Appointment Scheduling',
    summary:'Administrative calendar support based on provider-approved availability, appointment types, booking rules, and communication templates.',
    audience:'Mental health practices that need consistent scheduling, rescheduling, waitlist, and reminder administration across multiple clinicians or locations.',
    problem:'Calendars become unreliable when appointment lengths, locations, provider availability, cancellation rules, and waitlist ownership are handled inconsistently. Administrative scheduling can reduce the back-and-forth while clinical placement decisions remain with qualified practice staff.',
    tasks:['Maintain provider-approved availability blocks','Book only approved appointment types and durations','Send confirmation, reminder, and preparation templates','Process routine reschedule and cancellation requests','Maintain a waitlist using client-defined administrative criteria','Record no-shows and late cancellations without making fee decisions','Route requests that fall outside scheduling rules to the named practice owner'],
    deliverables:['Current appointment calendar','Scheduling exception queue','Waitlist activity log','Confirmation and reminder history','Daily schedule handoff'],
    process:[{title:'Document booking rules',detail:'The practice supplies availability, appointment labels, durations, locations, restrictions, and exception owners.'},{title:'Process routine requests',detail:'The assistant books, moves, or cancels visits only where the approved rules clearly allow it.'},{title:'Route exceptions',detail:'Clinical questions, unusual placement requests, and rule conflicts go to qualified practice staff.'},{title:'Confirm and reconcile',detail:'The calendar, messages, unresolved requests, and next-day schedule are checked and handed off.'}],
    scenario:'A returning client asks to move a standard follow-up visit because of a work conflict. The assistant offers openings already approved for that provider and visit type, updates the selected time, and sends the standard confirmation. When the client also asks whether the longer gap is clinically safe, the assistant does not answer and routes that question to the clinician.',
    diagram:['Approved calendar','Routine request','Exception routing','Confirmed schedule'],
    boundaries:['No triage, symptom assessment, clinical prioritization, or advice about how long a client can wait','No conversion of appointment type, level of care, or provider assignment without authorized approval','No crisis response or emergency scheduling decisions','No guarantee that a requested time, clinician, benefit, or service will be available']
  },
  {
    slug:'mental-health-client-communication',
    title:'Mental Health Client Communication',
    summary:'Nonclinical inbox, phone, reminder, and follow-up administration using practice-approved messages and routing instructions.',
    audience:'Clinicians and behavioral health office teams whose routine administrative messages compete with documentation, sessions, and practice management work.',
    problem:'Clients need clear answers about forms, office hours, directions, scheduling steps, records requests, and payment processes. When routine communication shares channels with clinical concerns, every message needs a documented owner and a firm boundary between administrative response and professional judgment.',
    tasks:['Monitor assigned administrative inboxes and voicemail queues','Categorize messages using client-defined nonclinical labels','Respond with approved office and process information','Send forms, directions, portal instructions, and reminder templates','Record contact attempts and confirmed receipt','Route clinical, safety, medication, and complaint messages to named staff','Maintain an unresolved-message queue with ownership and timestamps'],
    deliverables:['Administrative communication log','Template response library','Routed-message register','Unresolved contact queue','Daily communication handoff'],
    process:[{title:'Set channels and categories',detail:'The client identifies monitored channels, approved templates, response limits, owners, and emergency notices.'},{title:'Handle routine administration',detail:'The assistant answers only process questions covered by current approved information.'},{title:'Transfer protected topics',detail:'Clinical content, safety concerns, medication questions, and disputes are passed to the designated practice professional.'},{title:'Document the outcome',detail:'Attempts, transfers, responses, acknowledgment, and open ownership are recorded in the approved system.'}],
    scenario:'A client leaves a voicemail asking for the office address, a copy of the telehealth login instructions, and advice about a new medication effect. The assistant sends the approved location and login information, records the contact, and immediately routes the medication portion to the designated clinical team member without interpreting it or suggesting an action.',
    diagram:['Message captured','Admin reply','Protected topic routed','Outcome logged'],
    boundaries:['No counseling, diagnosis, treatment guidance, medication advice, clinical screening, or interpretation of symptoms','No crisis counseling, risk assessment, or determination that a person is safe','No rewriting of clinical messages in a way that changes their meaning','Client-approved emergency language and transfer instructions are followed, but the assistant does not act as an emergency service']
  },
  {
    slug:'behavioral-health-insurance-administration',
    title:'Behavioral Health Insurance Administration',
    summary:'Administrative eligibility, authorization, and payer follow-up based on payer responses and practice-approved procedures, without coverage guarantees.',
    audience:'Behavioral health practices that need organized insurance checks, authorization status tracking, and payer correspondence before and during administrative billing workflows.',
    problem:'Insurance information changes, portal responses can be incomplete, and authorization dates or visit counts can be missed. Staff need the source response captured accurately while benefit interpretation, service selection, and financial decisions remain with authorized practice personnel.',
    tasks:['Collect insurance details through approved channels','Submit eligibility inquiries using payer tools','Record payer-reported benefit information with date and source','Track authorization requests prepared or approved by authorized staff','Monitor authorization dates and payer-reported unit or visit status','Request missing administrative documents','Route inconsistent responses and coverage questions to the practice owner'],
    deliverables:['Eligibility response record','Authorization status tracker','Payer contact log','Missing-information queue','Coverage exception handoff'],
    process:[{title:'Confirm required inputs',detail:'The practice defines required member fields, payer channels, approved services, responsible reviewers, and documentation rules.'},{title:'Retrieve source responses',detail:'The assistant submits administrative inquiries and records the payer response without converting it into a guarantee.'},{title:'Track and follow up',detail:'Open requests, stated dates, document needs, and contact attempts remain visible in a controlled queue.'},{title:'Hand off exceptions',detail:'Conflicts, denials, clinical criteria, and financial decisions go to authorized practice staff.'}],
    scenario:'Before a scheduled series of visits, the assistant checks the payer portal and records that the response lists a deductible, a stated copayment, and an authorization requirement. The assistant captures the response date and reference number and sends the requirement to the practice owner. The assistant does not tell the client that treatment is covered or decide which clinical information supports authorization.',
    diagram:['Member data','Payer response','Status tracking','Owner review'],
    boundaries:['No guarantee of eligibility, coverage, authorization, reimbursement, or client responsibility','No interpretation of plan language as legal, financial, or clinical advice','No selection of diagnosis, procedure, modifier, or medical-necessity rationale','No submission of clinical facts unless supplied and approved by an authorized practice professional']
  },
  {
    slug:'mental-health-billing-and-claims-follow-up',
    title:'Mental Health Billing and Claims Follow-Up',
    summary:'Administrative claim status, payment posting support, and follow-up from approved source records, without coding or billing judgment.',
    audience:'Mental health practices with outstanding claims, payer requests, remittance records, and client account questions that need consistent administrative follow-through.',
    problem:'Claims can remain unresolved because status responses, remittance details, requests for records, and next owners are scattered. A structured queue can keep administrative follow-up moving without allowing an assistant to choose codes, alter clinical documentation, or determine what anyone owes.',
    tasks:['Submit claim files already approved by authorized practice staff','Check payer acceptance and claim status','Record payer messages, reference numbers, and stated reasons','Post payments and adjustments from approved remittance instructions','Prepare administrative correction queues without changing codes','Track record requests and appeal deadlines for authorized owners','Send approved account-status messages that avoid collection pressure'],
    deliverables:['Claim status work queue','Payer follow-up log','Remittance posting record','Correction and documentation request list','Authorized-owner deadline report'],
    process:[{title:'Receive approved billing inputs',detail:'The practice provides finalized charges, codes, claim data, posting rules, and authorized decision owners.'},{title:'Submit and monitor',detail:'The assistant transmits approved records and captures acceptance, rejection, pending, or processed status.'},{title:'Organize response work',detail:'Payer statements and requests are logged without changing clinical or coding content.'},{title:'Route for decision and close',detail:'Authorized staff resolve coding, appeal, refund, balance, and write-off questions before administrative completion.'}],
    scenario:'A payer marks a submitted claim as rejected because a subscriber identifier does not match its file. The assistant records the exact payer message and reference number, checks the client-supplied registration record, and places the discrepancy in the authorized correction queue. The assistant does not replace the identifier, change a code, bill the client, or characterize the rejection as a denial.',
    diagram:['Approved claim','Status check','Exception queue','Authorized closure'],
    boundaries:['No diagnosis or procedure code selection, coding validation, modifier choice, or medical-necessity judgment','No alteration of clinical notes, dates, charges, or claim facts without authorized direction','No decision on appeals, refunds, write-offs, collections, client balances, or financial hardship','No promise of payer reimbursement or statement that a claim is payable']
  },
  {
    slug:'mental-health-ehr-and-records-administration',
    title:'Mental Health EHR and Records Administration',
    summary:'Controlled nonclinical support for document indexing, record request tracking, demographic updates, and authorized file maintenance.',
    audience:'Mental health organizations that need orderly electronic records, request logs, document naming, and access handoffs without delegating clinical authorship or release decisions.',
    problem:'Misfiled forms, duplicate profiles, incomplete indexes, and untracked record requests make authorized work harder to find. Administrative maintenance can improve order, but clinical notes, amendment decisions, disclosure authority, and retention policy require qualified ownership.',
    tasks:['Index received documents using client-approved categories','Update approved demographic and contact fields from source records','Identify possible duplicate profiles for authorized review','Track consent, release, and records-request status','Prepare document inventories for designated reviewers','Apply approved naming and filing conventions','Record access changes and unresolved data-quality exceptions'],
    deliverables:['Document index','Records-request tracker','Possible-duplicate review queue','Missing or misfiled document report','Access and change log'],
    process:[{title:'Define record controls',detail:'The client specifies systems, document types, naming rules, permitted fields, access roles, and authorized reviewers.'},{title:'Organize approved content',detail:'The assistant files and indexes received material without creating or interpreting clinical documentation.'},{title:'Flag exceptions',detail:'Possible duplicates, conflicting data, release questions, and amendment requests go to an authorized owner.'},{title:'Reconcile and document',detail:'Approved changes, request status, access updates, and remaining exceptions are logged.'}],
    scenario:'A practice receives a signed external assessment, a release form, and a request for records on the same day. The assistant indexes the incoming documents under approved labels and logs the request, but notices two profiles with similar names. The assistant pauses filing to the uncertain profile and asks the records owner to resolve identity and release authority before any disclosure occurs.',
    diagram:['Controlled receipt','Approved indexing','Exception review','Logged resolution'],
    boundaries:['No creation, completion, interpretation, or amendment of clinical notes','No independent decision to merge profiles, release records, approve access, or change retention periods','No clinical screening, diagnosis, treatment, or abstraction that requires professional judgment','No claim of HIPAA compliance, certification, or availability of a business associate agreement']
  },
  {
    slug:'mental-health-provider-credentialing-support',
    title:'Mental Health Provider Credentialing Support',
    summary:'Administrative collection, roster maintenance, portal entry, and status follow-up for provider applications under authorized review.',
    audience:'Solo clinicians, group practices, and behavioral health organizations managing payer enrollment, recredentialing, directory, and roster administration.',
    problem:'Credentialing files depend on dates, source documents, portal entries, attestations, and payer follow-up. Missing items can delay processing, but only providers and authorized organization leaders can attest to accuracy, resolve professional disclosures, or determine enrollment eligibility.',
    tasks:['Maintain provider document and expiration checklists','Request current copies of client-specified source documents','Enter approved information into payer or roster forms','Track application, revalidation, and directory status','Log payer requests and reference numbers','Prepare discrepancy lists for provider review','Schedule reminders for provider-controlled attestations and renewals'],
    deliverables:['Credentialing document checklist','Application status dashboard','Expiration and revalidation calendar','Payer correspondence log','Provider attestation queue'],
    process:[{title:'Build the source checklist',detail:'The organization defines required documents, systems, dates, providers, and authorized signers.'},{title:'Prepare administrative entries',detail:'The assistant organizes source facts and enters only information supported by approved records.'},{title:'Obtain authorized review',detail:'The provider or authorized leader checks disclosures, professional facts, and attestations before submission.'},{title:'Track payer status',detail:'Requests, responses, directory updates, deadlines, and unresolved discrepancies are recorded.'}],
    scenario:'A payer requests an updated license copy and a fresh provider attestation for recredentialing. The assistant adds the request to the tracker, obtains the current public-source document through the approved process, and prepares the portal record. The clinician reviews the professional details and personally completes the attestation before the assistant records the payer confirmation number.',
    diagram:['Source checklist','Admin preparation','Provider attestation','Payer tracking'],
    boundaries:['No signature, attestation, or representation on behalf of a provider or authorized official','No determination of licensure, credentialing eligibility, network acceptance, or regulatory compliance','No alteration or concealment of sanctions, work history, disclosures, or professional facts','No legal advice, compliance certification, or guarantee of enrollment or directory accuracy']
  },
  {
    slug:'mental-health-practice-reporting-and-workflows',
    title:'Mental Health Practice Reporting and Workflows',
    summary:'Administrative dashboards, queue definitions, process documentation, and handoff routines built from client-approved operational data.',
    audience:'Mental health practice owners and operations leaders who need visibility into scheduling, intake, claims, records, and administrative workload without clinical performance scoring.',
    problem:'Operational work is difficult to improve when teams use inconsistent statuses, reports mix unlike measures, and no one owns aging items. Clear definitions and handoffs can show where administrative work is waiting while avoiding conclusions about care quality or clinical outcomes.',
    tasks:['Document administrative workflow stages and owners','Define data fields from client-approved source systems','Build routine counts for inquiries, appointments, claims, and open requests','Maintain aging and exception queues','Reconcile dashboard totals to named source reports','Draft standard operating steps for authorized review','Record approved workflow changes and effective dates'],
    deliverables:['Administrative operations dashboard','Workflow and ownership map','Aging and exception report','Metric definition register','Versioned procedure record'],
    process:[{title:'Choose operational questions',detail:'The practice identifies decisions, source systems, measures, exclusions, owners, and access limits.'},{title:'Define and reconcile',detail:'The assistant documents each measure and checks output against the named administrative source.'},{title:'Publish controlled views',detail:'Approved dashboards and queues are shared only with designated users and include reporting dates and limitations.'},{title:'Review workflow changes',detail:'Practice leaders interpret results, approve process changes, and own any clinical or management conclusion.'}],
    scenario:'A practice owner wants to understand why new-client scheduling is slowing down. The assistant maps timestamps for inquiry receipt, missing forms, clinician review, and first offered appointment, then prepares a weekly administrative aging report. The owner discovers that unsigned forms are the largest queue and changes the reminder process. The report does not score clinicians or infer treatment quality.',
    diagram:['Defined sources','Reconciled measures','Controlled dashboard','Owner decision'],
    boundaries:['No clinical outcome analysis, quality-of-care judgment, diagnosis, treatment recommendation, or provider ranking','No use of a proxy metric to make decisions about an individual client or clinician','No legal, financial, privacy, or compliance certification based on a dashboard','No access expansion or new data collection without client authorization and a documented operational need']
  }
];

export const serviceGroups={
  access:['mental-health-intake-and-referral-coordination','mental-health-appointment-scheduling','mental-health-client-communication'],
  revenue:['behavioral-health-insurance-administration','mental-health-billing-and-claims-follow-up'],
  operations:['mental-health-ehr-and-records-administration','mental-health-provider-credentialing-support','mental-health-practice-reporting-and-workflows']
} as const;

export function serviceGroupFor(slug:string){
  if((serviceGroups.access as readonly string[]).includes(slug))return 'access';
  if((serviceGroups.revenue as readonly string[]).includes(slug))return 'revenue';
  return 'operations';
}

export function serviceTitleSuffix(slug:string){
  const group=serviceGroupFor(slug);
  if(group==='access')return 'for Mental Health Practices';
  if(group==='revenue')return 'for Behavioral Health Administration';
  return 'for Mental Health Practice Operations';
}

export const basePaths=['/','/about','/services','/contact-us','/blog','/research','/alternatives','/resources','/privacy','/terms'];
export const sitemapPaths=[...basePaths,...services.map(service=>`/services/${service.slug}`)];
