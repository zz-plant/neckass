import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:8001/';

async function headlineText(page) {
  return (await page.locator('#headline').innerText()).trim();
}

test.describe('Neckass smoke flows', () => {
  test('shuffle updates headline and URL can restore it', async ({ page }) => {
    await page.goto(BASE_URL);

    await expect(page.locator('#headline')).not.toHaveText('Loading...');
    const original = await headlineText(page);

    await page.click('#next-btn');
    await page.waitForTimeout(150);

    const shuffled = await headlineText(page);
    expect(shuffled).not.toEqual(original);

    const restoredUrl = page.url();
    expect(restoredUrl).toContain('headline=');

    const restored = await page.context().newPage();
    await restored.goto(restoredUrl);
    await expect(restored.locator('#headline')).toHaveText(shuffled);
  });

  test('share links include active headline text', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#headline')).not.toHaveText('Loading...');

    const headline = await headlineText(page);
    const twitterHref = await page.locator('#twitter-share').getAttribute('href');

    expect(twitterHref).toBeTruthy();
    expect(decodeURIComponent(twitterHref)).toContain(headline);
  });


  test('URL headline input is rendered as plain text without DOM injection', async ({ page }) => {
    const payload = encodeURIComponent('<img src=x onerror=alert(1)> Breaking');
    await page.goto(`${BASE_URL}?headline=${payload}&source=generated`);

    await expect(page.locator('#headline')).not.toHaveText('Loading...');
    const headline = await headlineText(page);

    expect(headline).toContain('<img src=x onerror=alert(1)> Breaking');
    await expect(page.locator('#headline img')).toHaveCount(0);
    await expect(page.locator('#headline [onerror]')).toHaveCount(0);
  });

  test('export actions are available for current headline', async ({ page }) => {
    await page.goto(BASE_URL);

    await expect(page.locator('#download-mock')).toBeEnabled();
    await expect(page.locator('#copy-mock')).toBeEnabled();
  });

  test('agent interface exposes callable tools', async ({ page }) => {
    await page.goto(BASE_URL);

    const initial = await page.evaluate(async () => window.Neckass.agent.call('get_state'));
    expect(initial).toBeTruthy();
    expect(typeof initial.headline).toBe('string');

    const shuffled = await page.evaluate(async () => window.Neckass.agent.call('shuffle'));
    expect(shuffled).toBeTruthy();
    expect(shuffled.identifier).toBeTruthy();

    const listed = await page.evaluate(async () => window.Neckass.agent.call('list_headlines', { limit: 5 }));
    expect(Array.isArray(listed.items)).toBeTruthy();
  });

  test('history URL helpers preserve supported filters and headline params', async ({ page }) => {
    await page.goto(`${BASE_URL}?section=tech&q=wifi&source=curated`);

    const result = await page.evaluate(() => {
      const { buildHeadlineUrl, getUrlState, DEFAULT_FILTERS, data, slugifyHeadline, isValidHeadlineIndex } = window.Neckass;
      const sampleHeadlines = data.HEADLINES || [];
      const filters = { ...DEFAULT_FILTERS, section: 'tech', query: 'wifi', source: 'curated' };
      const url = buildHeadlineUrl({
        index: 0,
        headlines: sampleHeadlines,
        filters,
        identifierFromIndex: (index) => slugifyHeadline(sampleHeadlines[index]),
        isValidHeadlineIndex
      });
      const parsed = new URL(url);
      const params = Object.fromEntries(parsed.searchParams.entries());
      const state = getUrlState();
      return { params, state };
    });

    expect(result.params.section).toBe('tech');
    expect(result.params.q).toBe('wifi');
    expect(result.params.source).toBe('curated');
    expect(result.params.headline).toBeTruthy();
    expect(result.state.section).toBe('tech');
    expect(result.state.query).toBe('wifi');
  });

  test('filters helper returns expected eligible indexes and shared JSON parse fallback works', async ({ page }) => {
    await page.goto(BASE_URL);

    const result = await page.evaluate(() => {
      const { getEligibleIndexes, isValidHeadlineIndex, safeJsonParse } = window.Neckass;
      const headlines = [
        'Tech desk confirms wifi prophecy in startup cafeteria',
        'Culture club debates midnight playlist diplomacy',
        'Oddity alert: ghost printer files for PTO'
      ];
      const eligible = getEligibleIndexes({
        headlines,
        baseHeadlineCount: 3,
        filters: { section: 'tech', query: 'wifi', source: 'curated', panel: 'recent', layout: 'standard' },
        isValidHeadlineIndex
      });
      return {
        eligible,
        badJsonFallback: safeJsonParse('{oops', { ok: false }),
        goodJson: safeJsonParse('{"ok":true}', { ok: false })
      };
    });

    expect(result.eligible).toEqual([0]);
    expect(result.badJsonFallback).toEqual({ ok: false });
    expect(result.goodJson).toEqual({ ok: true });
  });
});
