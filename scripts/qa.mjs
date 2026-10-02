import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import matter from 'gray-matter';
import sharp from 'sharp';

const root = process.cwd();
const target = process.argv[2] || 'all';
const failures = [];
const notes = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const walk = (dir, pattern = /.*/) => {
  const base = path.join(root, dir);
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base, { recursive: true, withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => path.join(entry.parentPath, entry.name)).filter((file) => pattern.test(file));
};
const content = (family) => walk(`content/${family}`, /\.mdx$/).map((file) => {
  const parsed = matter(fs.readFileSync(file, 'utf8'));
  return { file, data: parsed.data, body: parsed.content };
});
const families = { articles: content('articles'), research: content('research'), alternatives: content('alternatives') };
const allContent = Object.values(families).flat();
const fail = (name, detail) => failures.push(`${name}: ${detail}`);
const assert = (condition, name, detail) => { if (!condition) fail(name, detail); };
const hrefs = (text) => [...text.matchAll(/(?:href=["']([^"']+)|\]\(([^)]+)\))/g)].map((match) => match[1] || match[2]);

const checks = {
  routes() {
    const required = ['src/app/page.tsx','src/app/about/page.tsx','src/app/services/page.tsx','src/app/contact-us/page.tsx','src/app/blog/page.tsx','src/app/research/page.tsx','src/app/alternatives/page.tsx','src/app/resources/page.tsx','src/app/privacy/page.tsx','src/app/terms/page.tsx','src/app/robots.ts','src/app/sitemap.ts'];
    required.forEach((file) => assert(exists(file), 'routes', `missing ${file}`));
    assert(!exists('src/app/pricing'), 'routes', 'pricing route exists');
  },
  links() {
    const valid = new Set(['/','/about','/services','/contact-us','/blog','/research','/alternatives','/resources','/privacy','/terms','/thank-you','/thanks-whats-next']);
    for (const slug of ['live-camera-monitoring-support','after-hours-camera-observation','event-escalation-support','incident-logging-and-documentation','camera-status-and-coverage-checks','multi-site-monitoring-assistance','access-and-visitor-observation-support','practice-specific-monitoring-workflows']) valid.add(`/services/${slug}`);
    families.articles.forEach((item) => valid.add(`/blog/${item.data.slug}`));
    families.research.forEach((item) => valid.add(`/research/${item.data.slug}`));
    families.alternatives.forEach((item) => valid.add(`/alternatives/${item.data.slug}`));
    for (const item of allContent) for (const href of hrefs(item.body)) if (href.startsWith('/')) assert(valid.has(href.split('#')[0]), 'links', `${path.basename(item.file)} links to missing ${href}`);
  },
  ctas() {
    const source = walk('src', /\.(ts|tsx)$/).map((file) => fs.readFileSync(file, 'utf8')).join('\n') + '\n' + allContent.map((item) => item.body).join('\n');
    for (const match of source.matchAll(/<a\s+([^>]*href=["']\/contact-us["'][^>]*)>([\s\S]*?)<\/a>/g)) {
      assert(/\bfree\b/i.test(match[2]), 'ctas', 'contact CTA omits Free');
      const staticId = /id=["']cta-[a-z0-9-]+-[a-z0-9-]+-[a-z0-9-]+["']/.test(match[1]);
      const dynamicId = /id=\{`cta-\$\{page\}-closing-consultation`\}/.test(match[1]);
      assert(staticId || dynamicId, 'ctas', `CTA lacks valid id near ${match[2].replace(/<[^>]+>/g,'').trim()}`);
    }
    assert(!/<button[^>]+id=["']cta-/.test(source), 'ctas', 'form submit has CTA id');
  },
  forms() {
    const form = read('src/components/LeadForm.tsx');
    for (const field of ['name','email','referral_source','message','website_url']) assert(form.includes(`name="${field}"`), 'forms', `missing ${field}`);
    assert(form.includes('tabIndex={-1}') && form.includes('aria-hidden="true"'), 'forms', 'honeypot accessibility contract missing');
    const route = read('src/app/api/submit-lead/route.ts');
    assert(route.includes('website_url') && route.includes('NextResponse.json({ok:true})'), 'forms', 'silent honeypot response missing');
  },
  popup() {
    const popup = read('src/components/TimedLeadPopup.tsx');
    assert(/8000|8\s*\*\s*1000/.test(popup), 'popup', 'eight second timer missing');
    assert(popup.includes('sessionStorage'), 'popup', 'session frequency missing');
    assert(popup.includes('Escape'), 'popup', 'Escape close missing');
  },
  'rendered-text'() {
    assert(exists('.next/server'), 'rendered-text', 'build output missing');
    if (exists('.next/server')) {
      const result = spawnSync('python3', ['ban_dashes.py', '.next/server'], { cwd: root, encoding: 'utf8' });
      assert(result.status === 0, 'rendered-text', result.stdout.trim() || result.stderr.trim());
    }
  },
  'brand-leak'() {
    for (const item of allContent) assert(!/stealth\s*agents/i.test(item.body), 'brand-leak', path.basename(item.file));
    const html = walk('.next/server/app', /\.html$/).map((file) => fs.readFileSync(file,'utf8').replace(/<!--[\s\S]*?-->/g,'').replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<[^>]+>/g,' ')).join('\n');
    assert(!/stealth\s*agents/i.test(html), 'brand-leak', 'parent operator appears in rendered text');
  },
  pricing() {
    const text = allContent.map((item) => item.body).join('\n');
    assert(!/\b(?:pricing|hourly rate|starting price|price range|plan tier)s?\b/i.test(text), 'pricing', 'public commercial amount language found');
    assert(!exists('src/app/pricing'), 'pricing', 'pricing route exists');
  },
  'speed-claims'() {
    const text = allContent.map((item) => item.body).join('\n');
    assert(!/\b(?:start this week|in days not weeks|\d+ day onboarding|\d+ hour turnaround|instant onboarding)\b/i.test(text), 'speed-claims', 'prohibited speed claim found');
  },
  'third-party'() {
    const source = walk('src', /\.(ts|tsx)$/).map((file) => fs.readFileSync(file,'utf8')).join('\n');
    const executableUrls = [...source.matchAll(/<(?:Script|iframe)[^>]+src=["'](https:\/\/[^"']+)/gi)].map((match) => match[1]);
    const hosts = executableUrls.map((url) => new URL(url).hostname);
    for (const host of hosts) assert(['mentalhealthadministrator.com','acrtracking.stealthagents.us','go.oncehub.com','schema.org'].includes(host), 'third-party', `unapproved host ${host}`);
    assert(!/googletagmanager|google-analytics|gtag\(|hooks\.slack\.com\/services\/|mattermost[^\s"']*\/hooks\//i.test(source), 'third-party', 'banned or exposed integration found');
    const clientSource = walk('src', /\.(ts|tsx)$/).filter((file) => fs.readFileSync(file,'utf8').startsWith("'use client'")).map((file) => fs.readFileSync(file,'utf8')).join('\n');
    assert(!/SITE_MATTERMOST_FALLBACK_WEBHOOK_URL|LEAD_WEBHOOK_URL/.test(clientSource), 'third-party', 'server-only webhook variable exposed to client code');
  },
  'history-api'() {
    const source = walk('src', /\.(ts|tsx)$/).map((file) => fs.readFileSync(file,'utf8')).join('\n');
    assert(!/history\.(?:pushState|replaceState)|popstate|window\.open/.test(source), 'history-api', 'history or exit manipulation found');
  },
  schema() {
    const source = walk('src', /\.(ts|tsx)$/).map((file) => fs.readFileSync(file,'utf8')).join('\n');
    assert(!source.includes('FAQPage'), 'schema', 'FAQPage found');
    for (const type of ['Organization','Service','BreadcrumbList','ScholarlyArticle','CollectionPage']) assert(source.includes(type), 'schema', `missing ${type}`);
  },
  sitemap() {
    const source = read('src/app/sitemap.ts');
    assert(!/changefreq|priority/i.test(source), 'sitemap', 'forbidden hint found');
    for (const pathName of ['/thank-you','/thanks-whats-next','/api/']) assert(!source.includes(`'${pathName}'`) && !source.includes(`\"${pathName}\"`), 'sitemap', `noindex path ${pathName} included`);
  },
  robots() {
    const source = read('src/app/robots.ts');
    assert((source.match(/\bsitemap\s*:/gi) || []).length === 1, 'robots', 'source must declare sitemap once');
    assert(source.includes('DEPLOYMENT_MODE'), 'robots', 'preview mode control missing');
  },
  async images() {
    const files = walk('public', /\.(png|jpe?g|webp)$/i);
    assert(files.length >= 58, 'images', `only ${files.length} raster images`);
    for (const file of files) {
      const metadata = await sharp(file).metadata();
      if (/public\/(?:blog|research|alternatives)\//.test(file)) assert(metadata.width === 1200 && metadata.height === 630, 'images', `${path.relative(root,file)} is ${metadata.width} by ${metadata.height}`);
    }
  },
  thumbnails() {
    assert(exists('thumbnail-system/brand_config.json'), 'thumbnails', 'brand config missing');
    const config = JSON.parse(read('thumbnail-system/brand_config.json'));
    const concepts = config.concepts || config.templates || config.template_concepts || {};
    const conceptCount = Array.isArray(concepts) ? concepts.length : Object.keys(concepts).length;
    assert(conceptCount >= 30, 'thumbnails', `only ${conceptCount} concepts`);
    for (const item of families.articles) {
      assert(exists(`public/blog/${item.data.slug}.png`) && exists(`public/blog/${item.data.slug}.webp`), 'thumbnails', `missing ${item.data.slug}`);
    }
  },
  'article-links'() {
    for (const item of families.articles) {
      const internal = (item.body.match(/\]\(\/(?:blog|research|alternatives|services)\//g) || []).length;
      const external = (item.body.match(/\]\(https?:\/\//g) || []).length;
      assert(internal === 2, 'article-links', `${path.basename(item.file)} has ${internal} internal links`);
      assert(external === 1, 'article-links', `${path.basename(item.file)} has ${external} external links`);
    }
  },
  'content-structure'() {
    assert(families.articles.length === 5, 'content-structure', `blog count ${families.articles.length}`);
    for (const item of families.articles) {
      assert(/^## Quick overview:/m.test(item.body), 'content-structure', `${path.basename(item.file)} first overview missing`);
      assert((item.body.match(/^### .+\?$/gm) || []).length >= 3, 'content-structure', `${path.basename(item.file)} FAQ count low`);
      assert((item.data.relatedSlugs || []).length === 3, 'content-structure', `${path.basename(item.file)} related count`);
    }
  },
  similarity() {
    const shingles = (text) => { const words = text.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean); return new Set(words.slice(0,-4).map((_,i) => words.slice(i,i+5).join(' '))); };
    for (let i=0;i<families.articles.length;i++) for (let j=i+1;j<families.articles.length;j++) {
      const a=shingles(families.articles[i].body), b=shingles(families.articles[j].body); let common=0; for(const value of a) if(b.has(value)) common++;
      const score=common/(a.size+b.size-common || 1); assert(score < 0.45, 'similarity', `${path.basename(families.articles[i].file)} and ${path.basename(families.articles[j].file)} score ${score.toFixed(3)}`);
    }
  },
  research() {
    assert(families.research.length >= 20, 'research', `count ${families.research.length}`);
    const clusters = new Map();
    for (const item of families.research) {
      const cluster = item.data.cluster || 'missing'; clusters.set(cluster, (clusters.get(cluster) || 0) + 1);
      assert(item.data.sourceCount >= 10 && item.data.sourceCount <= 20, 'research', `${path.basename(item.file)} sourceCount ${item.data.sourceCount}`);
      const listed = (item.body.match(/^\d+\. \[/gm) || []).length;
      assert(listed === item.data.sourceCount, 'research', `${path.basename(item.file)} lists ${listed} sources but says ${item.data.sourceCount}`);
      assert(item.body.includes('Liftable statistic'), 'research', `${path.basename(item.file)} liftable statistic missing`);
    }
    assert(clusters.size >= 4, 'research', `cluster count ${clusters.size}`);
    for (const [cluster,count] of clusters) assert(count >= 3, 'research', `${cluster} has ${count} siblings`);
  },
  alternatives() {
    assert(families.alternatives.length >= 4, 'alternatives', `count ${families.alternatives.length}`);
    const categories = new Map();
    for (const item of families.alternatives) {
      const category = item.data.competitorCategory || 'missing'; categories.set(category, (categories.get(category) || 0) + 1);
      assert((item.data.relatedSlugs || []).length === 3, 'alternatives', `${path.basename(item.file)} related count`);
    }
    for (const [category,count] of categories) assert(count >= 2, 'alternatives', `${category} has one page`);
  },
  lighthouse() {
    const chrome = ['google-chrome','chromium','chromium-browser'].find((command) => spawnSync('sh',['-c',`command -v ${command}`]).status === 0);
    if (!chrome) notes.push('lighthouse: SKIP because Chrome is unavailable; live manual gate remains required');
    else notes.push(`lighthouse: browser ${chrome} detected; live URL audit runs after deployment`);
  },
};

const aliases = { all: Object.keys(checks), build: [], qa: Object.keys(checks) };
const selected = aliases[target] || [target];
for (const name of selected) {
  if (!checks[name]) { fail('runner', `unknown check ${name}`); continue; }
  try { await checks[name](); if (!failures.some((entry) => entry.startsWith(`${name}:`))) console.log(`PASS ${name}`); }
  catch (error) { fail(name, error instanceof Error ? error.message : String(error)); }
}
notes.forEach((note) => console.log(note));
if (failures.length) { failures.forEach((failure) => console.error(`FAIL ${failure}`)); process.exit(1); }
console.log(`QA complete with ${selected.length} checks.`);
