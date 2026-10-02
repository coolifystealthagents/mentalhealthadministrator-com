import type { Metadata } from 'next';
import { alternatives } from '@/lib/alternatives';
import { ContentListing } from '@/components/Listing';
export const metadata: Metadata = { title: 'Practice Administration Workflow Alternatives Guide', description: 'Compare responsible approaches to practice administrative support, documentation, staffing workflows, and client controlled event escalation support.', alternates: { canonical: '/alternatives' } };
export default function Page() { return <ContentListing title="Monitoring workflow alternatives" intro="Clear comparisons for teams evaluating administrative support approaches." items={alternatives.slice(0, 12)} totalItems={alternatives.length} base="/alternatives" image="/images/alternatives.svg" />; }
