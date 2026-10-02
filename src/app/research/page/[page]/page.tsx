import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { researchItems } from '@/lib/research';
import { ContentListing } from '@/components/Listing';
const pageSize = 12;
export function generateStaticParams() { return Array.from({ length: Math.max(0, Math.ceil(researchItems.length / pageSize) - 1) }, (_, index) => ({ page: String(index + 2) })); }
export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> { const n = Number((await params).page); return { title: `Practice Administration Research, Page ${n}`, description: 'Additional sourced practice administration research notes.', alternates: { canonical: `/research/page/${n}` }, robots: n > Math.ceil(researchItems.length / pageSize) ? { index: false } : undefined }; }
export default async function Page({ params }: { params: Promise<{ page: string }> }) { const n = Number((await params).page); if (!Number.isInteger(n) || n < 2) notFound(); const items = researchItems.slice((n - 1) * pageSize, n * pageSize); if (!items.length) notFound(); return <ContentListing title={`Research library page ${n}`} intro="Additional practice administration research notes." items={items} totalItems={researchItems.length} currentPage={n} pageSize={pageSize} base="/research" image="/images/research.svg" />; }
