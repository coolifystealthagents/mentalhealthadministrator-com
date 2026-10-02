import type { Metadata } from 'next';
import { researchItems } from '@/lib/research';
import { ContentListing } from '@/components/Listing';
export const metadata: Metadata = { title: 'Security Practice Administration Research Library', description: 'Explore evidence aware research notes for practice administrative support, incident records, workflow design, and responsible human monitoring support.', alternates: { canonical: '/research' } };
export default function Page() { return <ContentListing title="Camera monitoring research" intro="Structured research notes for thoughtful practice camera operations." items={researchItems.slice(0, 12)} totalItems={researchItems.length} base="/research" image="/images/research.svg" />; }
