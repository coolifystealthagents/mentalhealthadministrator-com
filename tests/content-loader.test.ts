import { describe, expect, it } from 'vitest';
import { articles } from '../src/lib/articles';
import { researchItems } from '../src/lib/research';
import { alternatives } from '../src/lib/alternatives';

describe('content launch corpus', () => {
  it('loads exactly five launch blog articles', () => {
    expect(articles).toHaveLength(5);
    expect(new Set(articles.map((item) => item.slug)).size).toBe(5);
  });

  it('loads twenty research articles in four balanced clusters', () => {
    expect(researchItems).toHaveLength(20);
    const counts = researchItems.reduce<Record<string, number>>((all, item) => {
      all[item.cluster || 'missing'] = (all[item.cluster || 'missing'] || 0) + 1;
      return all;
    }, {});
    expect(Object.keys(counts)).toHaveLength(4);
    expect(Object.values(counts)).toEqual([5, 5, 5, 5]);
  });

  it('loads four alternatives in two non-singleton categories', () => {
    expect(alternatives).toHaveLength(4);
    const counts = alternatives.reduce<Record<string, number>>((all, item) => {
      all[item.competitorCategory || 'missing'] = (all[item.competitorCategory || 'missing'] || 0) + 1;
      return all;
    }, {});
    expect(Object.keys(counts)).toHaveLength(2);
    expect(Object.values(counts)).toEqual([2, 2]);
  });

  it('loads full bodies and required relationship data', () => {
    for (const item of [...articles, ...researchItems, ...alternatives]) {
      expect(item.body.length).toBeGreaterThan(500);
      expect(item.featuredImage).toMatch(/^\//);
    }
    for (const item of [...articles, ...alternatives]) {
      expect(item.relatedSlugs).toHaveLength(3);
    }
  });
});
