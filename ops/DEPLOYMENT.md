# Deployment and release runbook

## Modes

`DEPLOYMENT_MODE=preview` is the safe default. It returns a sitewide crawler disallow rule. Use `DEPLOYMENT_MODE=production` only when the canonical domain is attached, TLS is valid, and the release checklist is complete.

## Coolify

- Build pack: Dockerfile
- Container port: 3000
- Health path: `/`
- Production domain: `https://mentalhealthadministrator.com`
- Optional alias: `https://www.mentalhealthadministrator.com`
- Required environment: `DEPLOYMENT_MODE`
- Optional environment: `REVALIDATE_SECRET`, `GEMINI_API_KEY`

## Release gate

1. Run `npm ci`, `npm test`, `npm run build`, and `npm run qa:all`.
2. Build the Docker image and request `/`, `/robots.txt`, `/sitemap.xml`, one service, one blog article, one research page, and one alternatives page.
3. In preview mode, confirm robots disallow indexing.
4. Confirm Cloudflare DNS and TLS reach the intended Coolify application.
5. Run Lighthouse on the deployed URL. Record a skip only when a browser is unavailable.
6. Test one valid form submission and one honeypot submission. Do not include visitor data in logs.
7. Switch to production mode only after canonical-domain verification, then confirm robots allows indexing and the sitemap uses the canonical origin.

## Rollback

Redeploy the previous successful image or commit in Coolify, restore preview mode if indexing safety is uncertain, and document the affected route and verification results in a GitHub issue.
