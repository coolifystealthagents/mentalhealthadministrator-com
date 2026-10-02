import { loadContent } from './content';

export const articles = loadContent('articles', 'blog');
export const getArticle = (slug: string) => articles.find((item) => item.slug === slug);
