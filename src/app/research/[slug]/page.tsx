import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { researchItems, getResearch } from '@/lib/research';
import { ContentDetail } from '@/components/Listing';
export function generateStaticParams() { return researchItems.map((item) => ({ slug: item.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const item = getResearch((await params).slug); if (!item) return {}; return { title: item.seoTitle, description: item.description, alternates: { canonical: `/research/${item.slug}` }, openGraph: { type: 'article', title: item.title, description: item.description, images: [{ url: item.featuredImage, alt: item.heroImageAlt }], publishedTime: item.publishedAt, modifiedTime: item.updatedAt } }; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const item = getResearch((await params).slug); if (!item) notFound(); return <ContentDetail item={item} />; }
