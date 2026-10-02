import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { alternatives, getAlternative } from '@/lib/alternatives';
import { ContentDetail } from '@/components/Listing';
export function generateStaticParams() { return alternatives.map((item) => ({ slug: item.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const item = getAlternative((await params).slug); if (!item) return {}; return { title: item.seoTitle, description: item.description, alternates: { canonical: `/alternatives/${item.slug}` }, openGraph: { type: 'article', title: item.title, description: item.description, images: [{ url: item.featuredImage, alt: item.heroImageAlt }], publishedTime: item.publishedAt, modifiedTime: item.updatedAt } }; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const item = getAlternative((await params).slug); if (!item) notFound(); return <ContentDetail item={item} />; }
