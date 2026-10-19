import type { Metadata } from 'next';
import { researchItems } from '@/lib/research';
import { ContentListing } from '@/components/Listing';
export const metadata: Metadata = { title: 'Mental Health Practice Administration Research Library', description: 'Explore evidence-aware research notes for practice administrative support, documentation standards, communication, and workflow design.', alternates: { canonical: '/research' } };
export default function Page() { return <ContentListing title="Practice administration research" intro="Structured research notes for thoughtful mental health practice administration." items={researchItems.slice(0, 12)} totalItems={researchItems.length} base="/research" image="/images/research.svg" />; }
