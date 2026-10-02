# Recurring operations

## Weekly

- Review form delivery, analytics endpoint health, broken links, and Coolify deployment status.
- Run the test, build, deterministic QA, dependency audit, and Docker gates.
- Review open GitHub issues with `status: triage` and assign one domain label.

## Monthly

- Recheck external citations and the `lastVerified` date for research pages.
- Review alternatives demand evidence before adding a new comparison category.
- Check Core Web Vitals and Lighthouse on the canonical deployed URL.
- Review analytics for useful content gaps without publishing public pricing or unsupported claims.

## Quarterly

- Review privacy and terms text, access boundaries, escalation wording, and source freshness.
- Exercise rollback from the previous successful deployment.
- Review thumbnail concept distribution and image uniqueness.

## Automation safety

Scheduled agents may open issues or write reviewed repair prompts. They must not publish pricing, change production indexing, deploy fixes, or handle visitor data without an explicit release workflow. Credentials belong in platform secret stores, never repository files or issue bodies.
