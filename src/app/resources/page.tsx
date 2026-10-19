import type { Metadata } from 'next';
import Link from 'next/link';
import { articles } from '@/lib/articles';
import { researchItems } from '@/lib/research';
import { alternatives } from '@/lib/alternatives';
import type { ContentItem } from '@/lib/content';
export const metadata: Metadata = { title: 'Practice Administration Resources', description: 'Browse recent practical articles, sourced research, and operational comparisons for responsible practice administration workflows.', alternates: { canonical: '/resources' } };
function Section({ title, path, items }: { title: string; path: string; items: ContentItem[] }) { return <section className="section shell"><div className="section-heading"><h2>{title}</h2><Link href={path}>View all</Link></div><div className="cards">{items.slice(0, 6).map((item) => <article className="card" key={item.slug}><img src={item.featuredImage} alt={item.heroImageAlt} loading="lazy" /><p className="eyebrow">{item.category}</p><h3><Link href={`${path}/${item.slug}`}>{item.title}</Link></h3><p>{item.description}</p></article>)}</div></section>; }
export default function Page() { return <><section className="hero shell"><div><p className="eyebrow">Resource center</p><h1>Mental health administration library</h1><p className="lede">Practical guidance, sourced evidence, and clear comparisons for practice teams.</p></div><img src="/images/resources.svg" alt="Organized practice administration resource library" /></section><Section title="Latest articles" path="/blog" items={articles} /><Section title="Latest research" path="/research" items={researchItems} /><Section title="Latest alternatives" path="/alternatives" items={alternatives} /></>; }
