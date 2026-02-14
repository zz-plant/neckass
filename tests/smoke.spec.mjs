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

  test('export actions are available for current headline', async ({ page }) => {
    await page.goto(BASE_URL);

    await expect(page.locator('#download-mock')).toBeEnabled();
    await expect(page.locator('#copy-mock')).toBeEnabled();
  });
});
