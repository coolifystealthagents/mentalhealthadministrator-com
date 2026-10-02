import type { MetadataRoute } from 'next';
import { ORIGIN, services } from '@/lib/site';
import { articles } from '@/lib/articles';
import { researchItems } from '@/lib/research';
import { alternatives } from '@/lib/alternatives';
const entry = (path: string, modified: string | Date = new Date('2026-09-01')) => ({ url: `${ORIGIN}${path}`, lastModified: modified });
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['/', '/about', '/services', '/contact-us', '/blog', '/research', '/alternatives', '/resources', '/privacy', '/terms'];
  const categories = [...new Set(articles.map((item) => item.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')))];
  const pages = researchItems.length > 12 ? ['/research/page/2'] : [];
  return [
    ...staticPaths.map((path) => entry(path)),
    ...services.map((item) => entry(`/services/${item.slug}`)),
    ...articles.map((item) => entry(`/blog/${item.slug}`, item.updatedAt)),
    ...researchItems.map((item) => entry(`/research/${item.slug}`, item.updatedAt)),
    ...alternatives.map((item) => entry(`/alternatives/${item.slug}`, item.updatedAt)),
    ...categories.map((slug) => entry(`/blog/category/${slug}`)),
    ...pages.map((path) => entry(path)),
  ];
}
