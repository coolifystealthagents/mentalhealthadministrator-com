import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articles } from '@/lib/articles';
import { ContentListing } from '@/components/Listing';
const pageSize = 12;
export function generateStaticParams() { return Array.from({ length: Math.max(0, Math.ceil(articles.length / pageSize) - 1) }, (_, index) => ({ page: String(index + 2) })); }
export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> { const n = Number((await params).page); return { title: `Practice Administration Articles, Page ${n}`, description: 'Additional practical practice administration articles.', alternates: { canonical: `/blog/page/${n}` } }; }
export default async function Page({ params }: { params: Promise<{ page: string }> }) { const n = Number((await params).page); if (!Number.isInteger(n) || n < 2) notFound(); const items = articles.slice((n - 1) * pageSize, n * pageSize); if (!items.length) notFound(); return <ContentListing title={`Practice administration articles page ${n}`} intro="Additional practical practice administration articles." items={items} totalItems={articles.length} currentPage={n} pageSize={pageSize} base="/blog" image="/images/blog.svg" />; }
