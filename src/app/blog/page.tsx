import type { Metadata } from 'next';
import Link from 'next/link';
import { articles } from '@/lib/articles';
import { ContentListing } from '@/components/Listing';

export const metadata: Metadata = { title: 'Mental Health Practice Administration Articles and Guides', description: 'Practical articles about live human administrative support, documentation, communication workflows, and responsible practice operations.', alternates: { canonical: '/blog' } };
const categories = [...new Set(articles.map((item) => item.category))].sort();
export default function Page() {
  return <ContentListing title="Practice administration articles" intro="Practical guidance for mental health teams building dependable administrative, communication, and documentation workflows." items={articles.slice(0, 12)} totalItems={articles.length} base="/blog" image="/images/blog.svg">
    <nav className="filter-pills shell" aria-label="Blog categories"><Link href="/blog" aria-current="page">All ({articles.length})</Link>{categories.map((category) => { const count = articles.filter((item) => item.category === category).length; return <Link key={category} href={`/blog/category/${encodeURIComponent(category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}`}>{category} ({count})</Link>; })}</nav>
  </ContentListing>;
}
