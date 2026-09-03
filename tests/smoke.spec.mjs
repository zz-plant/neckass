import { expect, test } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:8001/';

async function headlineText(page) {
    return (await page.locator('#headline').innerText()).trim();
}

test.describe('Neckass smoke flows', () => {
    test('shuffle updates headline and URL can restore it', async ({
        page,
    }) => {
        await page.goto(BASE_URL);
        await page.waitForFunction(() =>
            Boolean(window.Neckass?.app && window.Neckass?.agent),
        );

        await expect(page.locator('#headline')).not.toHaveText('Loading...');
        const original = await headlineText(page);

        await page.click('#next-btn');
        await expect(page.locator('#headline')).not.toHaveText(original);

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
        await page.waitForFunction(() =>
            Boolean(window.Neckass?.app && window.Neckass?.agent),
        );
        await expect(page.locator('#headline')).not.toHaveText('Loading...');

        const headline = await headlineText(page);
        await expect(page.locator('#twitter-share')).toHaveAttribute(
            'href',
            /twitter\.com|x\.com/,
        );
        const twitterHref = await page
            .locator('#twitter-share')
            .getAttribute('href');

        expect(twitterHref).toBeTruthy();
        expect(decodeURIComponent(twitterHref)).toContain(headline);
    });

    test('URL headline input is rendered as plain text without DOM injection', async ({
        page,
    }) => {
        const payload = encodeURIComponent(
            '<img src=x onerror=alert(1)> Breaking',
        );
        await page.goto(`${BASE_URL}?headline=${payload}`);
        await page.waitForFunction(() => Boolean(window.Neckass?.app));

        await expect(page.locator('#headline')).not.toHaveText('Loading...');
        const headline = await headlineText(page);

        expect(headline).toContain('<img src=x onerror=alert(1)> Breaking');
        await expect(page.locator('#headline img')).toHaveCount(0);
        await expect(page.locator('#headline [onerror]')).toHaveCount(0);
    });

    test('export actions are available for current headline', async ({
        page,
    }) => {
        await page.goto(BASE_URL);
        await page.waitForFunction(() => Boolean(window.Neckass?.app));

        await expect(page.locator('#download-clipping')).toBeEnabled();
        await expect(page.locator('#copy-clipping')).toBeEnabled();
    });

    test('exported front page fills its canvas', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForFunction(() => Boolean(window.Neckass?.app));

        // The export clones the card and copies computed styles onto the
        // clone. A regression there silently drops the card's own padding and
        // grid row-gap, so the artwork bunches into a corner and the PNG comes
        // out mostly blank — while every button still looks fine. Compare the
        // rendered pixels against the card actually on screen.
        const result = await page.evaluate(async () => {
            const card = document.getElementById('clipping-front');
            const rect = card.getBoundingClientRect();
            const dataUrl = await window.htmlToImage.toPng(card, {
                pixelRatio: 2,
                width: Math.round(rect.width),
                height: Math.round(rect.height),
            });

            const image = new Image();
            await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = reject;
                image.src = dataUrl;
            });

            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            const { data } = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height,
            );

            // Find the lowest row holding ink, i.e. anything clearly darker
            // than the newsprint ground.
            let lastInkRow = 0;
            for (let y = 0; y < canvas.height; y += 1) {
                for (let x = 0; x < canvas.width; x += 1) {
                    const i = (y * canvas.width + x) * 4;
                    // Alpha matters: untouched canvas is transparent black,
                    // which would otherwise read as ink everywhere and make
                    // this assertion unfalsifiable.
                    if (
                        data[i + 3] > 200 &&
                        data[i] < 140 &&
                        data[i + 1] < 140 &&
                        data[i + 2] < 140
                    ) {
                        lastInkRow = y;
                        break;
                    }
                }
            }

            return {
                height: canvas.height,
                inkReaches: lastInkRow / canvas.height,
            };
        });

        // The footer rule sits near the bottom of the card, so ink should run
        // most of the way down. The old bug left this around 0.6.
        expect(result.inkReaches).toBeGreaterThan(0.8);
    });

    test('agent interface exposes callable tools', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForFunction(() => Boolean(window.Neckass?.agent));

        const initial = await page.evaluate(async () =>
            window.Neckass.agent.call('get_state'),
        );
        expect(initial).toBeTruthy();
        expect(typeof initial.headline).toBe('string');

        const shuffled = await page.evaluate(async () =>
            window.Neckass.agent.call('shuffle'),
        );
        expect(shuffled).toBeTruthy();
        expect(shuffled.identifier).toBeTruthy();

        const listed = await page.evaluate(async () =>
            window.Neckass.agent.call('list_headlines', { limit: 5 }),
        );
        expect(Array.isArray(listed.items)).toBeTruthy();
    });

    test('history URL helpers carry the headline and drop stale filter params', async ({
        page,
    }) => {
        // The section/q/source/panel/layout parameters belonged to a filter
        // system that never had controls; links that still carry them must
        // resolve to the headline and shed the rest.
        await page.goto(`${BASE_URL}?section=tech&q=wifi&source=curated`);
        await page.waitForFunction(() => Boolean(window.Neckass?.app));

        const result = await page.evaluate(() => {
            const {
                buildHeadlineUrl,
                getUrlState,
                data,
                slugifyHeadline,
                isValidHeadlineIndex,
            } = window.Neckass;
            const sampleHeadlines = data.HEADLINES || [];
            const url = buildHeadlineUrl({
                index: 0,
                headlines: sampleHeadlines,
                identifierFromIndex: (index) =>
                    slugifyHeadline(sampleHeadlines[index]),
                isValidHeadlineIndex,
            });
            const parsed = new URL(url);
            const params = Object.fromEntries(parsed.searchParams.entries());
            const state = getUrlState();
            return { params, state };
        });

        expect(result.params.headline).toBeTruthy();
        expect(result.params.section).toBeUndefined();
        expect(result.params.q).toBeUndefined();
        expect(result.params.source).toBeUndefined();
        expect(result.state.headline).toBeNull();
        expect(result.state.hasHeadlineParam).toBe(false);
    });

    test('shared JSON parse falls back on malformed input', async ({
        page,
    }) => {
        await page.goto(BASE_URL);
        await page.waitForFunction(() => Boolean(window.Neckass?.app));

        const result = await page.evaluate(() => {
            const { safeJsonParse } = window.Neckass;
            return {
                badJsonFallback: safeJsonParse('{oops', { ok: false }),
                goodJson: safeJsonParse('{"ok":true}', { ok: false }),
            };
        });

        expect(result.badJsonFallback).toEqual({ ok: false });
        expect(result.goodJson).toEqual({ ok: true });
    });
});
