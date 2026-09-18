import { expect, test } from '@playwright/test';
import { buildFeed } from '../functions/feed.xml.js';
import { issueNumber, selectLead } from '../functions/lib/issue.mjs';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:8001/';

test.describe('The Corbin Falls Gazette', () => {
    // The issue is the product. These cover what a reader actually opens:
    // that today's paper renders, that a back issue loads from the archive,
    // and that the corrections chain points at the lead it claims to.
    test('the front page renders a complete issue', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));

        const issue = await page.evaluate(() => window.Neckass.currentIssue);

        await expect(page.locator('#masthead-date')).toHaveText(
            issue.mastheadLine,
        );
        expect(issue.mastheadLine).toMatch(/Vol\. [IVX]+, No\. \d+$/);
        await expect(page.locator('#lead-headline')).toHaveText(
            issue.lead.headline,
        );
        // Wire form: the deck opens on a dateline.
        await expect(page.locator('#lead-deck')).toHaveText(
            `${issue.dateline} — ${issue.lead.deck}`,
        );
        expect(issue.dateline).toMatch(/^CORBIN FALLS, [A-Z][a-z.]+ \d{1,2}$/);
        await expect(page.locator('#lead-byline')).toHaveText(
            issue.lead.byline,
        );
        await expect(page.locator('#weather-line')).toHaveText(issue.weather);
        // Real numbers above the forecaster's note.
        await expect(page.locator('#weather-numbers')).toHaveText(
            issue.weatherNumbers,
        );
        expect(issue.weatherNumbers).toMatch(
            /^High -?\d+°, low -?\d+°\. Winds [NESW]{1,2} \d+ mph\. Sunset \d{1,2}:\d{2} p\.m\.$/,
        );

        // Every section is dealt at its documented size. A pool that empties
        // would silently shorten one of these.
        await expect(page.locator('#briefs-list li')).toHaveCount(7);
        await expect(page.locator('#corrections-list li')).toHaveCount(4);
        await expect(page.locator('#notices-list li')).toHaveCount(3);
        // The first correction is the dull one and never mentions him.
        const firstCorrection = await page
            .locator('#corrections-list li')
            .first()
            .innerText();
        expect(firstCorrection).not.toMatch(/Neckass/);
        await expect(page.locator('#classifieds-list li')).toHaveCount(5);
        await expect(page.locator('#letters-list li')).toHaveCount(2);

        // No section may repeat an item inside one issue.
        for (const [selector, label] of [
            ['#briefs-list li', 'briefs'],
            ['#corrections-list li', 'corrections'],
            ['#classifieds-list li', 'classifieds'],
        ]) {
            const items = await page.locator(selector).allInnerTexts();
            expect(
                new Set(items).size,
                `${label} repeat inside one issue`,
            ).toBe(items.length);
        }

        // The lead must not also be running as a brief.
        const briefs = await page.locator('#briefs-list li').allInnerTexts();
        expect(briefs).not.toContain(issue.lead.headline);

        // The lead's own classified and letter run in the same issue.
        const ads = await page.locator('#classifieds-list li').allInnerTexts();
        expect(ads).toContain(issue.lead.classified);
        const letters = await page
            .locator('#letters-list .letter-body')
            .allInnerTexts();
        expect(
            letters.some((text) => text.includes(issue.lead.letter.body)),
        ).toBe(true);
    });

    test('the weather cut is drawn for the forecast on file', async ({
        page,
    }) => {
        await page.goto(BASE_URL);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));

        // The cut is one drawing with four switches, set from the first word
        // of the forecast. A break here is silent: the sky just stops matching
        // what the column says.
        const result = await page.evaluate(() => {
            const { weatherLayers } = window.Neckass.frontPage;
            const cut = document.getElementById('weather-cut');
            const styles = getComputedStyle(cut);
            const read = (name) =>
                Number(styles.getPropertyValue(`--${name}`).trim());
            return {
                cases: [
                    'Sunny, going by the window.',
                    'Overcast. Ugh, this weather.',
                    'Rain. He will not bring a jacket.',
                    'Wind. The picnic is indoors.',
                    'Unsettled. He picked the forecast he preferred.',
                ].map(weatherLayers),
                drawn: {
                    sun: read('sun'),
                    cloud: read('cloud'),
                    rain: read('rain'),
                    wind: read('wind'),
                },
                forecast: window.Neckass.currentIssue.weather,
            };
        });

        expect(result.cases).toEqual([
            { sun: 1, cloud: 0, rain: 0, wind: 0 },
            { sun: 0, cloud: 1, rain: 0, wind: 0 },
            { sun: 0, cloud: 1, rain: 1, wind: 0 },
            { sun: 0, cloud: 1, rain: 0, wind: 1 },
            { sun: 1, cloud: 1, rain: 0, wind: 0 },
        ]);

        // Whatever ran today, the sky on the page is the sky for that line,
        // and something is always showing.
        const expected = await page.evaluate(
            (line) => window.Neckass.frontPage.weatherLayers(line),
            result.forecast,
        );
        expect(result.drawn).toEqual(expected);
        expect(Object.values(result.drawn).some(Boolean)).toBe(true);
    });

    test("today's corrections retract yesterday's actual lead", async ({
        page,
    }) => {
        await page.goto(BASE_URL);
        await page.waitForFunction(() => Boolean(window.Neckass?.issue));

        // Walk a spread of issues rather than only today, so the chain is
        // checked across many lead pairings.
        const checked = await page.evaluate(() => {
            const { issue } = window.Neckass;
            const results = [];
            for (const value of [
                '2025-03-04',
                '2026-09-02',
                '2026-09-03',
                '2027-01-19',
                '2027-11-30',
            ]) {
                const date = issue.parseIssueDate(value);
                const today = issue.composeIssue(date);
                const previous = issue.composeIssue(
                    new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate() - 1,
                    ),
                );
                results.push({
                    value,
                    // [0] is the routine correction; [1] is the chained one.
                    first: today.corrections[1],
                    expected: previous.lead.correction,
                    previousNumber: previous.number,
                    number: today.number,
                });
            }
            return results;
        });

        for (const entry of checked) {
            expect(entry.number, entry.value).toBe(entry.previousNumber + 1);
            // The retraction printed today is the one attached to the lead
            // that actually ran yesterday.
            expect(entry.first, entry.value).toBe(entry.expected);
        }
    });

    test('a back issue loads from its URL and offers the way back', async ({
        page,
    }) => {
        await page.goto(`${BASE_URL}?issue=2025-06-11`);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));

        const issue = await page.evaluate(() => window.Neckass.currentIssue);
        expect(issue.issueParam).toBe('2025-06-11');

        await expect(page.locator('#masthead-date')).toContainText(
            `No. ${issue.number}`,
        );
        const notice = page.locator('#back-issue-notice');
        await expect(notice).toBeVisible();
        await expect(notice).toContainText(`No. ${issue.number}`);

        // Today's issue must not show the banner.
        await page.goto(BASE_URL);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));
        await expect(page.locator('#back-issue-notice')).toBeHidden();
    });

    test('a malformed issue param falls back to today', async ({ page }) => {
        await page.goto(`${BASE_URL}?issue=not-a-date`);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));

        const [rendered, today] = await page.evaluate(() => [
            window.Neckass.currentIssue.number,
            window.Neckass.issue.issueNumber(new Date()),
        ]);
        expect(rendered).toBe(today);
        await expect(page.locator('#back-issue-notice')).toBeHidden();
    });

    test('the archive lists issues that resolve to real papers', async ({
        page,
    }) => {
        await page.goto(`${BASE_URL}archive.html`);
        const links = page.locator('a[href*="?issue="]');
        await expect(links.first()).toBeVisible();
        expect(await links.count()).toBeGreaterThan(5);

        // Follow one and confirm it renders the issue it advertised.
        const href = await links.nth(3).getAttribute('href');
        const param = new URL(href, BASE_URL).searchParams.get('issue');
        await page.goto(new URL(href, BASE_URL).toString());
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));

        const issue = await page.evaluate(() => window.Neckass.currentIssue);
        expect(issue.issueParam).toBe(param);
        await expect(page.locator('#lead-headline')).toHaveText(
            issue.lead.headline,
        );
    });

    test('the issue reads without JavaScript', async ({ browser }) => {
        const context = await browser.newContext({ javaScriptEnabled: false });
        const page = await context.newPage();
        await page.goto(BASE_URL);

        // The standing issue in the markup must be a real paper, not a shell.
        await expect(page.locator('#lead-headline')).not.toBeEmpty();
        await expect(page.locator('#lead-deck')).not.toBeEmpty();
        await expect(page.locator('#briefs-list li').first()).not.toBeEmpty();
        await expect(
            page.locator('#corrections-list li').first(),
        ).not.toBeEmpty();
        await expect(page.locator('#weather-line')).not.toBeEmpty();
        await expect(page.locator('#letters-list li').first()).not.toBeEmpty();
        await expect(page.locator('#masthead-date')).not.toBeEmpty();
        await context.close();
    });

    // The feed and the social card compose the lead in the Workers runtime,
    // from their own copy of the arithmetic and their own extract of the
    // leads. If either drifts from modules/issue.js the paper starts
    // advertising a headline it is not running.
    test('worker and browser agree on the lead for a given issue', async ({
        page,
    }) => {
        await page.goto(BASE_URL);
        await page.waitForFunction(() => Boolean(window.Neckass?.issue));

        const dates = [
            '2024-09-29',
            '2025-01-01',
            '2026-09-02',
            '2026-12-25',
            '2027-06-14',
        ];

        const fromBrowser = await page.evaluate((values) => {
            const { issue } = window.Neckass;
            const leads = window.Neckass.data.LEADS;
            return values.map((value) => {
                const date = issue.parseIssueDate(value);
                const number = issue.issueNumber(date);
                return {
                    number,
                    headline: issue.selectLead(number, leads)?.headline ?? null,
                };
            });
        }, dates);

        const fromWorker = dates.map((value) => {
            const [year, month, day] = value.split('-').map(Number);
            const number = issueNumber(
                new Date(Date.UTC(year, month - 1, day)),
            );
            return { number, headline: selectLead(number)?.headline ?? null };
        });

        expect(fromWorker).toEqual(fromBrowser);
        for (const entry of fromWorker) expect(entry.headline).toBeTruthy();
    });

    test('the feed is well-formed and leads with the current issue', async ({
        page,
    }) => {
        const now = new Date(Date.UTC(2026, 8, 2));
        const xml = buildFeed(now);

        expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(
            true,
        );
        expect(xml).toContain('<atom:link href="https://neckass.com/feed.xml"');

        const items = xml.match(/<item>/g) ?? [];
        expect(items.length).toBe(30);

        const firstTitle = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>/.exec(
            xml,
        )?.[1];
        const headline = selectLead(issueNumber(now))?.headline ?? '';
        // The feed escapes for XML, so compare against the escaped headline.
        const escaped = headline
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
        expect(firstTitle).toBe(escaped);

        // Nothing may leave a raw ampersand or angle bracket in the document.
        expect(/&(?!amp;|lt;|gt;|quot;|apos;)/.test(xml)).toBe(false);

        // The browser must be offered the feed it advertises.
        await page.goto(BASE_URL);
        await expect(
            page.locator('link[rel="alternate"][type="application/rss+xml"]'),
        ).toHaveAttribute('href', '/feed.xml');
    });

    test('every page carries the icon set', async ({ page }) => {
        for (const path of ['', 'about.html', 'archive.html', 'prompts.html']) {
            await page.goto(`${BASE_URL}${path}`);
            await expect(
                page.locator('link[rel="icon"][href="/favicon.svg"]'),
            ).toHaveCount(1);
            await expect(
                page.locator('link[rel="apple-touch-icon"]'),
            ).toHaveCount(1);
            await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
        }
    });
});
