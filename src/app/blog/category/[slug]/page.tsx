import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articles } from '@/lib/articles';
import { ContentListing } from '@/components/Listing';
const toSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export function generateStaticParams() { return [...new Set(articles.map((item) => toSlug(item.category)))].map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const slug = (await params).slug; const first = articles.find((item) => toSlug(item.category) === slug); if (!first) return {}; return { title: `${first.category} Articles`, description: `Practical ${first.category.toLowerCase()} guidance for practice camera operations.`, alternates: { canonical: `/blog/category/${slug}` } }; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const slug = (await params).slug; const items = articles.filter((item) => toSlug(item.category) === slug); if (!items.length) notFound(); return <ContentListing title={items[0].category} intro={`Articles filed under ${items[0].category}.`} items={items} totalItems={items.length} base="/blog" image="/images/blog.svg" />; }
