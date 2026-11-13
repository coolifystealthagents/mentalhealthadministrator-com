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
});
