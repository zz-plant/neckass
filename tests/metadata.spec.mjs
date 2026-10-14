import { expect, test } from '@playwright/test';
import { composeIssue, parseIssueDate } from '../modules/issue.js';

const EDGE_URL = process.env.PLAYWRIGHT_EDGE_URL || 'http://127.0.0.1:8800/';
const STATIC_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:8001/';
const schemas = (html) =>
    [
        ...html.matchAll(
            /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
        ),
    ].map((match) => JSON.parse(match[1]));

test('issue metadata describes the actual satirical lead and its permalink at the edge', async ({
    request,
}) => {
    const date = '2025-06-11';
    const issue = composeIssue(parseIssueDate(date));
    const response = await request.get(`${EDGE_URL}?issue=${date}`);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    const article = schemas(html).find((node) => node['@type'] === 'Article');
    expect(article).toBeDefined();
    expect(article.headline).toBe(issue.lead.headline);
    expect(article.description).toBe(issue.lead.deck);
    expect(article.genre).toBe('Satire');
    expect(article.url).toBe(`https://neckass.com/?issue=${date}`);
    expect(article.image).toBe(`https://neckass.com/card.png?issue=${date}`);
    expect(article).not.toHaveProperty('author');
    expect(article).not.toHaveProperty('datePublished');
    expect(schemas(html).some((node) => node['@type'] === 'NewsArticle')).toBe(
        false,
    );
    expect(html).toContain(
        `<link rel="canonical" href="https://neckass.com/?issue=${date}">`,
    );
    expect(html).toContain(
        `<meta property="og:url" content="https://neckass.com/?issue=${date}">`,
    );
});

test('issue metadata matches the rendered paper on a static host too', async ({
    page,
}) => {
    await page.goto(`${STATIC_URL}?issue=2025-06-11`);
    await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));
    const metadata = await page.evaluate(() => ({
        issue: window.Neckass.currentIssue,
        schema: JSON.parse(
            document.getElementById('issue-jsonld')?.textContent || '{}',
        ),
    }));
    expect(metadata.schema.headline).toBe(metadata.issue.lead.headline);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        metadata.issue.lead.deck,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        'https://neckass.com/?issue=2025-06-11',
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        'https://neckass.com/card.png?issue=2025-06-11',
    );
});

test('a future issue does not become a published article in crawler metadata', async ({
    request,
}) => {
    const response = await request.get(`${EDGE_URL}?issue=2099-01-01`);
    const html = await response.text();
    const article = schemas(html).find((node) => node['@type'] === 'Article');
    expect(article).toBeDefined();
    expect(article.url).not.toContain('2099-01-01');
    expect(html).toContain(
        '<link rel="canonical" href="https://neckass.com/">',
    );
    expect(html).not.toContain('card.png?issue=2099-01-01');
});
