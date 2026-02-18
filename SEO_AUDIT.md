# SEO Audit — neckass.com

Date: 2026-02-18  
Scope: technical/on-page SEO review from repository source files plus live-host reachability checks.

## Method

- Reviewed page metadata and structured data in `index.html`.
- Reviewed crawler controls in `robots.txt` and `sitemap.xml`.
- Ran HTTP reachability checks against `https://neckass.com/` using `curl`.

## Executive summary

The site has a strong baseline for on-page SEO (title, meta description, canonical, Open Graph, Twitter cards, and JSON-LD). The most critical issue is that the live host currently returns `403 Forbidden` to direct HTTP checks, which can block crawling/indexing if search engine bots receive the same response.

## Findings

### 1) **Critical** — homepage returns `403 Forbidden` in live checks

- `curl -I https://neckass.com/` returned `HTTP/1.1 403 Forbidden`.
- `curl -IL -A 'Mozilla/5.0' https://neckass.com/` also returned `HTTP/1.1 403 Forbidden`.

**Why it matters:** If this behavior applies to search crawlers, indexing and ranking will be severely impacted regardless of good metadata.

**Recommendation:**
- Update edge/WAF/bot-protection rules to allow crawl access for legitimate bots (Googlebot, Bingbot, etc.) and normal browser traffic to `GET /`.
- Re-verify with Search Console URL Inspection and server logs after the rule change.

### 2) **Good** — metadata fundamentals are in place

Implemented in `index.html`:
- Descriptive title tag.
- Meta description.
- Canonical URL.
- Robots meta (`index, follow, max-image-preview:large`).
- Open Graph + Twitter card metadata.

**Recommendation:** keep this structure; ensure text remains aligned with on-page UX copy when shipping major positioning changes.

### 3) **Good** — structured data is present

`index.html` includes JSON-LD for both:
- `WebSite`
- `WebPage`

**Recommendation:** keep schemas in sync with real page capabilities. If no site search endpoint is supported, remove or replace `SearchAction` to avoid potentially misleading structured data.

### 4) **Good** — crawl directives and sitemap exist

- `robots.txt` allows all user agents and points to sitemap.
- `sitemap.xml` exists and includes the homepage URL.

**Recommendation:**
- Keep `<lastmod>` updated on content/metadata changes.
- If additional indexable pages are introduced, add them promptly.

### 5) **Opportunity** — social image compatibility hardening

Current OG/Twitter image points to an SVG (`og-image.svg`). Some platforms/crawlers are less reliable with SVG for rich cards.

**Recommendation:** provide a PNG fallback (e.g., `1200x630`) and reference it in OG/Twitter tags for broader compatibility.

## Prioritized action plan

1. Fix production 403 behavior for homepage crawlability (**P0**).
2. Validate crawl/index state in Google Search Console and Bing Webmaster Tools (**P0**).
3. Add PNG social preview fallback and verify cards in platform validators (**P1**).
4. Review `SearchAction` schema realism; remove if unsupported (**P1**).
5. Continue updating sitemap `<lastmod>` with each meaningful release (**P2**).

## Quick verification commands

```bash
curl -I https://neckass.com/
curl -IL -A 'Mozilla/5.0' https://neckass.com/
curl https://neckass.com/robots.txt
curl https://neckass.com/sitemap.xml
```
