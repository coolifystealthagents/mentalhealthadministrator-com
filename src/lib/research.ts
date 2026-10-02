import { loadContent } from './content';

export const researchItems = loadContent('research', 'research');
export const getResearch = (slug: string) => researchItems.find((item) => item.slug === slug);
