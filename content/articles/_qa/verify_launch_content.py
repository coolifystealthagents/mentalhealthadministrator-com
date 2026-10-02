from pathlib import Path
from collections import Counter
import re
import yaml

ROOT = Path(__file__).resolve().parents[3]
ARTICLE_DIR = ROOT / "content/articles"
ALTERNATIVE_DIR = ROOT / "content/alternatives"
articles = sorted(ARTICLE_DIR.glob("*.mdx"))
alternatives = sorted(ALTERNATIVE_DIR.glob("*.mdx"))
errors = []
article_slugs = {path.stem for path in articles}
alternative_slugs = {path.stem for path in alternatives}

if len(articles) != 5:
    errors.append(f"Expected 5 articles, found {len(articles)}")
if len(alternatives) != 4:
    errors.append(f"Expected 4 alternatives, found {len(alternatives)}")

def parse(path):
    source = path.read_text(encoding="utf-8")
    parts = source.split("---", 2)
    if len(parts) != 3:
        errors.append(f"{path.name}: invalid frontmatter boundaries")
        return {}, source, source
    return yaml.safe_load(parts[1]) or {}, parts[2], source

for kind, paths in (("article", articles), ("alternative", alternatives)):
    for path in paths:
        data, body, source = parse(path)
        words = len(re.findall(r"\b[\w']+\b", body))
        h2s = re.findall(r"^## (.+)$", body, re.MULTILINE)
        faqs = len(re.findall(r"^### .+\?$", body, re.MULTILINE))
        tables = len(re.findall(r"^\|[^\n]+\|\n\|(?:\s*---\s*\|)+$", body, re.MULTILINE))
        internal = len(re.findall(r"\]\(/(?:blog|research|alternatives|services)/", body))
        external = len(re.findall(r"\]\(https?://", body))
        if words < 900:
            errors.append(f"{path.name}: only {words} body words")
        if data.get("author") != "Mental Health Administrator Editorial Team":
            errors.append(f"{path.name}: wrong author")
        if len(data.get("relatedSlugs", [])) != 3:
            errors.append(f"{path.name}: relatedSlugs must contain 3 entries")
        valid_related = article_slugs if kind == "article" else alternative_slugs
        missing_related = set(data.get("relatedSlugs", [])) - valid_related
        if missing_related:
            errors.append(f"{path.name}: missing related targets {sorted(missing_related)}")
        if any(mark in source for mark in ("\u2013", "\u2014")):
            errors.append(f"{path.name}: prohibited dash character")
        prohibited = r"\b(?:HIPAA compliant|HIPAA compliance|pricing|hourly rate|starting price|guaranteed outcome|testimonial)s?\b"
        if re.search(prohibited, body, re.IGNORECASE):
            errors.append(f"{path.name}: prohibited claim or commercial language")
        if kind == "article":
            focus = str(data.get("tags", [""])[0]).lower()
            if not h2s or focus not in h2s[0].lower():
                errors.append(f"{path.name}: first H2 does not contain the focus keyword")
            if not 2 <= tables <= 4:
                errors.append(f"{path.name}: expected 2 to 4 tables, found {tables}")
            if internal != 2:
                errors.append(f"{path.name}: expected 2 internal body links, found {internal}")
            linked_blog_slugs = re.findall(r"\]\(/blog/([a-z0-9-]+)(?:#[^)]+)?\)", body)
            missing_links = set(linked_blog_slugs) - article_slugs
            if missing_links:
                errors.append(f"{path.name}: missing internal targets {sorted(missing_links)}")
            if external != 1:
                errors.append(f"{path.name}: expected 1 external body link, found {external}")
            if faqs < 3:
                errors.append(f"{path.name}: expected at least 3 visible FAQs, found {faqs}")
            if not re.match(r"\s*(?:A|An|Appointment|Referral)", body):
                errors.append(f"{path.name}: opening does not begin with a direct answer")
        print(f"{kind}: {path.name}: {words} words, {tables} tables, {faqs} FAQs, {internal} internal links, {external} external links")

categories = Counter()
for path in alternatives:
    data, _, _ = parse(path)
    categories[str(data.get("competitorCategory", "missing"))] += 1
if sorted(categories.values()) != [2, 2]:
    errors.append(f"Alternative categories are not balanced 2 and 2: {dict(categories)}")

if errors:
    for error in errors:
        print(f"FAIL: {error}")
    raise SystemExit(1)
print(f"PASS: verified 5 articles and 4 alternatives in two balanced categories: {dict(categories)}")
