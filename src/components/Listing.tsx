import Link from 'next/link';
import type { ContentItem } from '@/lib/content';
import { contentHeadings } from '@/lib/content';
import { articles } from '@/lib/articles';
import { researchItems } from '@/lib/research';
import { alternatives } from '@/lib/alternatives';
import { Breadcrumbs, KeyTakeaways, RelatedCards } from './Content';
import { MarkdownBody } from './MarkdownBody';
import { EditorialToc } from './EditorialToc';
import { ClosingCTA } from './Layout';
import { breadcrumbSchema, contentSchema } from '@/lib/schema';

const family = (kind: ContentItem['kind']) => kind === 'blog' ? { label: 'Blog', path: '/blog' } : kind === 'research' ? { label: 'Research', path: '/research' } : { label: 'Alternatives', path: '/alternatives' };

function relatedFor(item: ContentItem) {
  const pool = item.kind === 'blog' ? articles : item.kind === 'research' ? researchItems : alternatives;
  if (item.relatedSlugs.length) return item.relatedSlugs.map((slug) => pool.find((entry) => entry.slug === slug)).filter(Boolean).slice(0, 3) as ContentItem[];
  return pool.filter((entry) => entry.slug !== item.slug).map((entry) => ({
    entry,
    score: (entry.cluster && entry.cluster === item.cluster ? 3 : 0) + (entry.category === item.category ? 2 : 0) + entry.tags.filter((tag) => item.tags.includes(tag)).length,
  })).sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title)).slice(0, 3).map(({ entry }) => entry);
}

export function ContentListing({ title, intro, items, base, image, children, currentPage = 1, totalItems = items.length, pageSize = 12 }: { title: string; intro: string; items: ContentItem[]; base: string; image: string; children?: React.ReactNode; currentPage?: number; totalItems?: number; pageSize?: number }) {
  const totalPages = Math.ceil(totalItems / pageSize);
  return <>
    <section className="hero shell"><div><p className="eyebrow">Editorial library</p><h1>{title}</h1><p className="lede">{intro}</p></div><img src={image} alt={`${title} library illustration`} /></section>
    {children}
    <section className="section shell">
      <div className="cards content-cards">{items.map((item) => <article className="card" key={item.slug}>
        <img src={item.featuredImage} alt={item.heroImageAlt} loading="lazy" />
        <p className="eyebrow">{item.category}</p>
        <h2><Link href={`${base}/${item.slug}`}>{item.title}</Link></h2>
        <p>{item.description}</p>
        <p className="fine">{item.publishedAt} · {item.author}</p>
      </article>)}</div>
      {totalPages > 1 && <nav className="pagination" aria-label="Pagination">
        {currentPage > 1 && <Link rel="prev" href={currentPage === 2 ? base : `${base}/page/${currentPage - 1}`}>Previous</Link>}
        <span>Page {currentPage} of {totalPages}</span>
        {currentPage < totalPages && <Link rel="next" href={`${base}/page/${currentPage + 1}`}>Next</Link>}
      </nav>}
    </section>
  </>;
}

export function ContentDetail({ item }: { item: ContentItem }) {
  const section = family(item.kind);
  const related = relatedFor(item);
  const schemas = [contentSchema(item), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: section.label, path: section.path }, { name: item.title, path: `${section.path}/${item.slug}` }])];
  return <>
    {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    <article className="section shell article-shell">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: section.label, href: section.path }, { label: item.title, href: `${section.path}/${item.slug}` }]} />
      <header className="article-header">
        <p className="eyebrow">{item.category}</p>
        <h1>{item.pageH1 || item.title}</h1>
        <p className="lede">{item.description}</p>
        <p className="fine">Published {item.publishedAt} · Updated {item.updatedAt} · {item.readingTime} · {item.author}</p>
        {item.kind === 'research' && <p className="research-badge">Sources: {item.sourceCount} · Last verified: {item.lastVerified}</p>}
        <img className="article-hero" src={item.featuredImage} alt={item.heroImageAlt} />
      </header>
      <KeyTakeaways items={item.keyTakeaways} />
      <div className="article-grid">
        <div className="prose"><MarkdownBody source={item.body} /></div>
        <aside className="article-sidebar" aria-label="Article navigation and practice resources">
          <EditorialToc items={contentHeadings(item.body)} />
          <div className="sidebar-support"><p className="eyebrow">Practice desk support</p><h2>Turn guidance into a bounded workflow</h2><p>Review nonclinical administration scopes, decision boundaries, and the inputs needed for a responsible handoff.</p><ul><li><Link href="/services">Explore administrative services</Link></li><li><Link href="/resources">Browse the resource library</Link></li><li><Link href="/contact-us">Book a Free Consultation</Link></li></ul></div>
        </aside>
      </div>
      <div className="tags" aria-label="Article tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <section className="related"><h2>Related {section.label}</h2><RelatedCards items={related.map((entry) => ({ title: entry.title, href: `${section.path}/${entry.slug}`, description: entry.description }))} /></section>
    </article>
    <ClosingCTA page={`${item.kind}-${item.slug}`} />
  </>;
}
