# Mental Health Administrator

Production Next.js website for remote human administrative support, factual event documentation, and client-defined escalation support.

## Included launch scope

- Eight service pages and conversion funnel
- Five long-form launch articles with deterministic PNG and WebP thumbnails
- Twenty sourced research articles across four balanced clusters
- Four demand-grounded alternatives pages across two balanced categories
- Metadata, canonical URLs, JSON-LD, robots, and generated sitemap
- Analytics proxy and lead form with accessible honeypot handling
- Thirty-concept image framework and 58 validated raster assets
- Tests, named deterministic QA gates, Dockerfile, CI, and operations runbooks

## Local use

```bash
cp .env.example .env.local
npm ci
npm test
npm run build
npm run qa:all
npm run dev
```

Node.js 22 is used in CI. Preview mode is the safe default and blocks indexing. Set `DEPLOYMENT_MODE=production` only after the release checklist in `ops/DEPLOYMENT.md` passes.

## Architecture

The project uses TypeScript, React Server Components by default, Next.js App Router, build-time MDX content loading, a safe allowlisted Markdown renderer, metadata routes, standalone output, Sharp, and a committed Dockerfile. `next build --webpack` is intentional and preserves the scaffold contract.

## Factory provenance exception

The playbook-mandated `factory-scaffold` repository was not accessible to the available GitHub identity. This project reproduces the required scaffold contract locally. No claim is made that the inaccessible repository was cloned. The exception is recorded here and in the release runbook.

## Quality gates

`npm run qa:all` executes 22 named checks for routes, links, CTA IDs and language, forms, popup behavior, rendered prose, brand isolation, pricing and speed claims, third-party scripts, history manipulation, schema, sitemap, robots, images, thumbnails, article link budgets, structure, similarity, research, alternatives, and Lighthouse availability. Lighthouse remains a live deployment gate when Chrome is unavailable locally.

## Operations

- Deployment and rollback: `ops/DEPLOYMENT.md`
- Recurring review cadence: `ops/OPERATIONS.md`
- Issue-specific fix prompts: `ops/fix-prompts/`
