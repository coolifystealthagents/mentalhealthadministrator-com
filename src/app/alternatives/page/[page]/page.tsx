import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { alternatives } from '@/lib/alternatives';
import { ContentListing } from '@/components/Listing';
const pageSize = 12;
export function generateStaticParams() { return Array.from({ length: Math.max(0, Math.ceil(alternatives.length / pageSize) - 1) }, (_, index) => ({ page: String(index + 2) })); }
export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> { const n = Number((await params).page); return { title: `Monitoring Alternatives, Page ${n}`, description: 'Additional practice administration workflow comparisons.', alternates: { canonical: `/alternatives/page/${n}` } }; }
export default async function Page({ params }: { params: Promise<{ page: string }> }) { const n = Number((await params).page); if (!Number.isInteger(n) || n < 2) notFound(); const items = alternatives.slice((n - 1) * pageSize, n * pageSize); if (!items.length) notFound(); return <ContentListing title={`Alternatives library page ${n}`} intro="Additional practice administration workflow comparisons." items={items} totalItems={alternatives.length} currentPage={n} pageSize={pageSize} base="/alternatives" image="/images/alternatives.svg" />; }
