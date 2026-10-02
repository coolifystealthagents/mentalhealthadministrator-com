# Data Handling Boundaries

## Purpose and status

This document defines minimum operating boundaries for nonclinical administrative work by Mental Health Administrator. It is a scope-control document, not a representation of HIPAA compliance, a business associate agreement, a security certification, legal advice, or a substitute for the client's privacy and security program.

No protected or sensitive client data should be accessed until the parties have identified the data involved, approved systems, permitted actions, account controls, retention instructions, incident contacts, and applicable contract terms. Availability or suitability of any agreement is not asserted here.

## Data minimization rules

1. Use only data required for a named administrative task.
2. Prefer status, reference number, owner, and date over free-text copies of clinical content.
3. Do not collect symptoms, diagnoses, treatment details, medication details, psychotherapy notes, or safety narratives for administrative convenience.
4. Do not copy production data into personal notes, test tools, screenshots, chat systems, or unapproved automation.
5. Do not use client data to train models, create demonstrations, build marketing material, or serve another customer.
6. Preserve source attribution for payer-reported, provider-approved, and client-supplied facts.

## Permitted handling by workflow

| Workflow | Minimum necessary administrative data | Excluded action |
|---|---|---|
| Intake and referral | Contact details, approved demographics, referral source, form status, requested administrative category, owner | Recording a clinical interview, screening result, diagnosis, risk label, or assistant-selected provider fit |
| Scheduling | Client identifier, approved appointment type, provider, time, location, contact preference, administrative status | Inferring urgency, changing level of care, or recording unnecessary symptom detail |
| Client communication | Contact channel, message timestamp, administrative category, transfer owner, delivery status | Interpreting clinical content or expanding it into an assistant-authored clinical summary |
| Insurance | Member and payer identifiers, payer response, reference number, authorization status, stated dates | Guaranteeing coverage or creating clinical justification |
| Billing and claims | Approved claim fields, payer status, remittance information, reference number, authorized correction status | Choosing codes, changing clinical facts, or deciding balances and collection actions |
| EHR and records | Approved demographics, document type, received date, request status, access and filing history | Authoring clinical notes, merging identities, approving disclosure, or changing retention rules |
| Credentialing | Provider-approved professional facts, source documents, dates, payer status, attestation status | Signing, attesting, hiding disclosures, or making eligibility conclusions |
| Reporting | Approved operational fields, defined counts, queue age, source and reporting period | Clinical profiling, quality-of-care conclusions, or unnecessary row-level disclosure |

## Access controls

Each user must have an individually assigned account where the client system supports it. Access must be limited by customer, system, role, record type, and permitted action. Multi-factor authentication should be enabled wherever supported and approved. Credentials must not be shared in documents, email, chat, or personal password stores. Production access must not be reused for testing.

The client owns approval for account creation, role changes, exports, integrations, and access removal. Access must be reviewed when responsibilities change and removed promptly when work ends. A virtual assistant cannot approve their own expanded access.

## Approved locations and transfer

Work remains in client-approved systems and communication channels. Local downloads, removable media, personal email, consumer file sharing, browser extensions, unapproved transcription, and unapproved AI tools are outside scope. If an approved transfer is necessary, use the client-designated method, verify the recipient, limit the content, and record the transfer where required.

## Retention, exports, and deletion

The client defines authoritative retention and deletion instructions. Working copies should not be created unless necessary and approved. Approved temporary files require a named location, purpose, owner, and deletion point. The assistant records deletion or access-return steps but does not independently decide whether a legal, regulatory, clinical, or business record may be destroyed.

Bulk export, printing, screenshot capture, and offline storage are disabled or avoided unless expressly authorized for a defined need. When an engagement ends, account removal, token revocation, shared-link closure, and return or deletion of approved working material are documented.

## High sensitivity records

Psychotherapy notes, safety plans, abuse reports, substance-use records, reproductive health information, minor records, court materials, and other specially restricted information require explicit client determination before any access. They are excluded by default. An assistant does not decide which law, consent, privilege, or disclosure rule applies.

## Incident and misdirection rule

If data is sent to the wrong recipient, exposed, lost, accessed unexpectedly, or found in an unapproved location:

1. Stop further access, copying, sending, or deletion unless the client incident instruction says otherwise.
2. Preserve factual details such as time, system, account, action, recipient, and observed scope.
3. Notify the client's designated privacy or security contact through the approved channel.
4. Do not investigate beyond authorization, contact affected people, characterize legal impact, or promise an outcome.
5. Follow client-directed containment and documentation steps.

This is administrative incident routing, not breach determination, legal analysis, or regulatory notification.

## Quality and identity controls

Use at least two client-approved identifiers before changing a record or directing a message where the workflow requires identity confirmation. Possible duplicates, conflicting identifiers, unusual access, and uncertain recipients cause a pause and owner review. The assistant does not merge profiles, resolve identity conflicts, or disclose records independently.

## Preflight record

Before access begins, retain a scope record naming the client owner, service, systems, permitted data, prohibited data, role, approved channels, authentication method, retention instruction, incident contact, clinical transfer contact, review date, and termination step. Missing or contradictory fields block the affected work.
