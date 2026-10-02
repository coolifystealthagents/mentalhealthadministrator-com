import { ORIGIN, SITE_NAME, services } from './site';
import type { ContentItem } from './content';

export const organizationSchema = { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: ORIGIN, sameAs: [] };

export const serviceSchema = (slug: string) => {
  const service = services.find((item) => item.slug === slug);
  return { '@context': 'https://schema.org', '@type': 'Service', name: service?.title, description: service?.summary, provider: { '@type': 'Organization', name: SITE_NAME, url: ORIGIN } };
};

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${ORIGIN}${item.path}` })),
});

export const contentSchema = (item: ContentItem) => ({
  '@context': 'https://schema.org',
  '@type': item.kind === 'research' ? 'ScholarlyArticle' : 'Article',
  headline: item.title,
  description: item.description,
  image: `${ORIGIN}${item.featuredImage}`,
  datePublished: item.publishedAt,
  dateModified: item.updatedAt,
  author: { '@type': 'Organization', name: item.author },
  publisher: { '@type': 'Organization', name: SITE_NAME, url: ORIGIN },
  mainEntityOfPage: `${ORIGIN}/${item.kind === 'blog' ? 'blog' : item.kind}/${item.slug}`,
});

export const collectionSchema = (name: string, path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  url: `${ORIGIN}${path}`,
});
