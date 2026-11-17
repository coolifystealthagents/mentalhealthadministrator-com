import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(__dirname, '..');
const read = (file: string) => readFileSync(path.join(root, file), 'utf8');

const assets = [
  'public/images/services-administrator-scheduling.webp',
  'public/images/blog-administrative-workflow.webp',
  'public/images/research-operations-analysis.webp',
];

const serviceHeroes = [
  ['mental-health-intake-and-referral-coordination', 'Mental health intake coordinator reviewing a referral form before a documented handoff'],
  ['mental-health-appointment-scheduling', 'Practice administrator updating an approved appointment schedule at a shared workspace'],
  ['mental-health-client-communication', 'Support professional listening carefully during a private client conversation'],
  ['behavioral-health-insurance-administration', 'Administrator reviewing insurance eligibility documents and source records'],
  ['mental-health-billing-and-claims-follow-up', 'Billing administrator reconciling claim status and payer records at a desk'],
  ['mental-health-ehr-and-records-administration', 'Records administrator indexing approved documents in a controlled digital workspace'],
  ['mental-health-provider-credentialing-support', 'Credentialing coordinator checking provider source documents and renewal details'],
  ['mental-health-practice-reporting-and-workflows', 'Operations administrator reviewing practice workflow reports and aging queues'],
] as const;

describe('Services, Blog, and Research hero imagery', () => {
  it('maps each route to a distinct image with descriptive alt text', () => {
    const services = read('src/app/services/page.tsx');
    const blog = read('src/app/blog/page.tsx');
    const research = read('src/app/research/page.tsx');

    expect(services).toContain('/images/services-administrator-scheduling.webp');
    expect(services).toContain('Behavioral health practice administrator coordinating a clinic schedule in a calm office');
    expect(blog).toContain('/images/blog-administrative-workflow.webp');
    expect(blog).toContain('Open notebook and administrative workflow materials arranged on a quiet office desk');
    expect(research).toContain('/images/research-operations-analysis.webp');
    expect(research).toContain('Operations analyst reviewing de-identified planning materials at an office table');
  });

  it('ships optimized responsive WebP assets', async () => {
    for (const file of assets) {
      const absolute = path.join(root, file);
      expect(existsSync(absolute), file).toBe(true);
      expect(statSync(absolute).size, file).toBeLessThan(200_000);
      const metadata = await sharp(absolute).metadata();
      expect(metadata.format, file).toBe('webp');
      expect(metadata.width, file).toBe(1536);
      expect(metadata.height, file).toBe(1024);
    }

    const css = read('src/app/globals.css');
    expect(css).toContain('.listing-hero-image{width:100%;aspect-ratio:3/2;object-fit:cover;object-position:center}');
    expect(css).toContain('.listing-hero-image{aspect-ratio:4/3}');
  });

  it('ships a distinct optimized photo for every service detail route', async () => {
    const site = read('src/lib/site.ts');
    const seen = new Set<string>();

    for (const [slug, alt] of serviceHeroes) {
      const relative = `public/images/services/${slug}.webp`;
      const publicPath = `/images/services/${slug}.webp`;
      const absolute = path.join(root, relative);

      expect(site, slug).toContain(`'${slug}':'${publicPath}'`);
      expect(site, slug).toContain(`imageAlt:'${alt}'`);
      expect(seen.has(publicPath), publicPath).toBe(false);
      seen.add(publicPath);
      expect(existsSync(absolute), relative).toBe(true);
      expect(statSync(absolute).size, relative).toBeLessThan(200_000);

      const metadata = await sharp(absolute).metadata();
      expect(metadata.format, relative).toBe('webp');
      expect(metadata.width, relative).toBe(1536);
      expect(metadata.height, relative).toBe(1024);
    }
  });

  it('uses one aligned two-column header contract for editorial details', () => {
    const listing = read('src/components/Listing.tsx');
    const css = read('src/app/globals.css');

    expect(listing).toContain('className="article-header-copy"');
    expect(css).toContain('.article-header{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:start');
    expect(css).toContain('.article-header-copy');
    expect(css).toContain('.article-hero{display:block;width:100%;height:auto;object-fit:contain;object-position:center}');
    expect(css).not.toContain('.article-hero{order:2;aspect-ratio:4/3}');
    expect(css).toContain('@media(max-width:760px)');
    expect(css).toContain('.article-header{grid-template-columns:1fr}');
  });
});
