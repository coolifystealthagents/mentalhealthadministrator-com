import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type ContentKind = 'blog' | 'research' | 'alternatives';

export type Banner = {
  id: string;
  title: string;
  label: string;
  href: string;
};

export type ContentItem = {
  kind: ContentKind;
  slug: string;
  title: string;
  seoTitle: string;
  pageH1?: string;
  description: string;
  excerpt?: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  cluster?: string;
  competitor?: string;
  competitorCategory?: string;
  tags: string[];
  featuredImage: string;
  heroImageAlt: string;
  readingTime: string;
  sourceCount?: number;
  lastVerified?: string;
  keyTakeaways: string[];
  keyStats: string[];
  relatedSlugs: string[];
  topBanner?: Banner;
  middleBanner?: Banner;
  bottomBanner?: Banner;
  testimonial: null | Record<string, unknown>;
  body: string;
};

const asDate = (value: unknown) => {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value || '');
};
const asStrings = (value: unknown) => Array.isArray(value) ? value.map(String) : [];

export function loadContent(directory: string, kind: ContentKind): ContentItem[] {
  const root = path.join(process.cwd(), 'content', directory);
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root)
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => {
      const source = fs.readFileSync(path.join(root, name), 'utf8');
      const { data, content } = matter(source);
      const required = ['slug', 'title', 'seoTitle', 'author', 'publishedAt', 'category', 'featuredImage', 'heroImageAlt', 'readingTime'];
      for (const field of required) {
        if (!data[field]) throw new Error(`${directory}/${name} is missing ${field}`);
      }
      const description = String(data.description || data.excerpt || '');
      if (!description) throw new Error(`${directory}/${name} is missing description or excerpt`);
      return {
        kind,
        slug: String(data.slug),
        title: String(data.title),
        seoTitle: String(data.seoTitle),
        pageH1: data.pageH1 ? String(data.pageH1) : undefined,
        description,
        excerpt: data.excerpt ? String(data.excerpt) : undefined,
        author: String(data.author),
        publishedAt: asDate(data.publishedAt),
        updatedAt: asDate(data.updatedAt || data.publishedAt),
        category: String(data.category),
        cluster: data.cluster ? String(data.cluster) : undefined,
        competitor: data.competitor === undefined ? undefined : String(data.competitor),
        competitorCategory: data.competitorCategory ? String(data.competitorCategory) : undefined,
        tags: asStrings(data.tags),
        featuredImage: String(data.featuredImage),
        heroImageAlt: String(data.heroImageAlt),
        readingTime: String(data.readingTime),
        sourceCount: data.sourceCount === undefined ? undefined : Number(data.sourceCount),
        lastVerified: data.lastVerified ? asDate(data.lastVerified) : undefined,
        keyTakeaways: asStrings(data.key_takeaways || data.keyTakeaways),
        keyStats: asStrings(data.keyStats),
        relatedSlugs: asStrings(data.relatedSlugs),
        topBanner: data.topBanner,
        middleBanner: data.middleBanner,
        bottomBanner: data.bottomBanner,
        testimonial: data.testimonial || null,
        body: content.trim(),
      } satisfies ContentItem;
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title));
}

export const byNewest = (items: ContentItem[]) => [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title));

export function headingId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

export function h2Headings(body: string) {
  return body.split('\n').flatMap((line) => {
    const match = line.match(/^##\s+(.+)$/);
    return match ? [{ id: headingId(match[1].replace(/[*_`]/g, '')), label: match[1].replace(/[*_`]/g, '') }] : [];
  });
}
