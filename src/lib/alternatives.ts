import { loadContent } from './content';

export const alternatives = loadContent('alternatives', 'alternatives');
export const getAlternative = (slug: string) => alternatives.find((item) => item.slug === slug);
