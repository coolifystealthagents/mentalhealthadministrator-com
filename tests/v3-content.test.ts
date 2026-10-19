import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { services } from '../src/lib/site';
import { articles } from '../src/lib/articles';
import { researchItems } from '../src/lib/research';
import { alternatives } from '../src/lib/alternatives';
import { contentHeadings } from '../src/lib/content';
import sitemap from '../src/app/sitemap';

const root = path.resolve(__dirname, '..');
const read = (file: string) => readFileSync(path.join(root, file), 'utf8');

function visitorFiles(directory: string) {
  const files: string[] = [];
  const walk = (relative: string) => {
    for (const entry of readdirSync(path.join(root, relative), { withFileTypes: true })) {
      const child = path.join(relative, entry.name);
      if (entry.isDirectory()) walk(child);
      else if (/\.(tsx?|mdx)$/.test(entry.name)) files.push(child);
    }
  };
  walk(directory);
  return files;
}

describe('V3 service and editorial content contract', () => {
  it('gives every service its own media, inputs, controls, and FAQs', () => {
    expect(services).toHaveLength(8);
    for (const service of services) {
      expect(service.image).toBe(`/images/${service.slug}.svg`);
      expect(service.imageAlt.length).toBeGreaterThan(30);
      expect(service.inputs.length).toBeGreaterThanOrEqual(4);
      expect(service.qualityControls.length).toBeGreaterThanOrEqual(4);
      expect(service.faqs.length).toBeGreaterThanOrEqual(3);
      for (const faq of service.faqs) {
        expect(faq.question.length).toBeGreaterThan(15);
        expect(faq.answer.length).toBeGreaterThan(50);
      }
    }
    const detail = read('src/app/services/[slug]/page.tsx');
    for (const marker of ['service.image', 'service.imageAlt', 'Required inputs', 'Quality controls', 'Frequently asked questions', 'Related services', 'Next action']) expect(detail).toContain(marker);
  });

  it('removes decorative numbering from all commercial templates', () => {
    for (const file of ['src/app/page.tsx', 'src/app/about/page.tsx', 'src/app/services/page.tsx', 'src/app/services/[slug]/page.tsx']) {
      const source = read(file);
      expect(source, file).not.toContain('padStart');
      expect(source, file).not.toMatch(/>0[1-9]</);
      expect(source, file).not.toMatch(/>0\{[^}]+\}</);
    }
  });

  it('builds an H2 and H3 editorial outline and renders the interactive TOC', () => {
    const sample = '## Intake workflow\n\n### Required fields\n\n## Handoff';
    expect(contentHeadings(sample)).toEqual([
      { id: 'intake-workflow', label: 'Intake workflow', level: 2 },
      { id: 'required-fields', label: 'Required fields', level: 3 },
      { id: 'handoff', label: 'Handoff', level: 2 },
    ]);
    const listing = read('src/components/Listing.tsx');
    expect(listing).toContain('contentHeadings(item.body)');
    expect(listing).toContain('EditorialToc');
    expect(listing).not.toContain('ReviewCarousel');
    expect(listing).not.toContain('Discuss your camera workflow');
    const toc = read('src/components/EditorialToc.tsx');
    expect(toc).toContain("'use client'");
    expect(toc).toContain('IntersectionObserver');
    expect(toc).toContain('aria-current');
    const css=read('src/app/globals.css');
    expect(css).toContain('max-height:calc(100dvh - 136px)');
    expect(css).toContain('overflow-y:auto');
    expect(css).toMatch(/@media\(max-width:1100px\)[\s\S]*\.article-sidebar\{[^}]*max-height:none[^}]*overflow:visible/);
  });

  it('publishes every valid pagination route exactly once', () => {
    const urls = sitemap().map((item) => item.url);
    expect(urls).toContain('https://mentalhealthadministrator.com/blog/page/2');
    expect(urls).toContain('https://mentalhealthadministrator.com/blog/page/3');
    expect(urls).toContain('https://mentalhealthadministrator.com/research/page/2');
    expect(urls).toContain('https://mentalhealthadministrator.com/research/page/3');
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.some((url) => /thank-you|thanks-whats-next/.test(url))).toBe(false);
  });

  it('keeps visitor-facing source free of stale monitoring language and prohibited punctuation', () => {
    for (const directory of ['src', 'content']) {
      for (const file of visitorFiles(directory)) {
        const source = read(file);
        expect(source, `${file} stale copy`).not.toMatch(/practice camera operations|camera monitoring|security monitoring|live camera monitoring|after-hours camera observation|camera status and coverage|multi-site monitoring|visitor observation support|monitoring workflows/i);
        expect(source, `${file} dash punctuation`).not.toMatch(/[\u2013\u2014]/);
      }
    }
  });

  it('registers the site-specific design fingerprint and prompt controls', () => {
    const registry = JSON.parse(read('design-registry.json'));
    const site = registry.sites.find((entry: { site: string }) => entry.site === 'mentalhealthadministrator.com');
    expect(site).toBeTruthy();
    for (const field of ['industry', 'audience', 'designFamily', 'heroComposition', 'typeCharacter', 'paletteFamily', 'shapeGrammar', 'imageTreatment', 'sectionRhythm', 'navigationTreatment', 'motionSignature', 'density', 'signatureElement', 'designRead']) expect(site[field]).toBeTruthy();
    expect(site.signatureElement).toBe('practice workflow ledger');
    expect(site.designRead).toMatchObject({ DESIGN_VARIANCE: 7, MOTION_INTENSITY: 3, VISUAL_DENSITY: 6, redesignMode: 'evolve', primaryTheme: 'light' });
    for (const field of ['statement', 'primaryAccentStrategy', 'shapeSystem', 'typographyDirection', 'imageDirection', 'motionRationale']) expect(site.designRead[field]).toBeTruthy();
    expect(site).not.toHaveProperty('portfolioComparison');
  });

  it('gives every research record a topic-specific existing hero', () => {
    for (const item of researchItems) {
      expect(item.featuredImage, item.slug).toBe(`/research/${item.slug}.webp`);
      expect(existsSync(path.join(root, 'public', item.featuredImage.slice(1))), item.slug).toBe(true);
    }
  });

  it('matches the reviewed editorial corpus', () => {
    expect(articles).toHaveLength(29);
    expect(researchItems).toHaveLength(30);
    expect(alternatives).toHaveLength(4);
  });
});
