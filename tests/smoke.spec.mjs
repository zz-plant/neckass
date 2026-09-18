import { expect, test } from '@playwright/test';
import { buildFeed } from '../functions/feed.xml.js';
import { issueNumber, selectLead } from '../functions/lib/issue.mjs';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:8001/';
// The Pages Functions under workerd; see playwright.config.mjs.
const EDGE_URL = process.env.PLAYWRIGHT_EDGE_URL || 'http://127.0.0.1:8800/';

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

    test('the town map rings the places the day names', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));

        const result = await page.evaluate(() => {
            const { placesNamed } = window.Neckass.frontPage;
            const cut = document.getElementById('map-cut');
            const styles = getComputedStyle(cut);
            const read = (name) =>
                Number(styles.getPropertyValue(`--${name}`).trim());
            const issue = window.Neckass.currentIssue;
            const named = placesNamed([
                ...issue.notices,
                ...issue.letters.flatMap((l) => [l.body, l.signature]),
            ]).map(([key]) => key);
            return {
                named,
                drawn: Object.fromEntries(
                    [
                        'bridge',
                        'orchard',
                        'station',
                        'depot',
                        'hall',
                        'library',
                        'center',
                        'gym',
                        'school',
                        'route9',
                        'river',
                        'shelter',
                    ].map((key) => [key, read(key)]),
                ),
                caption: document.getElementById('map-caption').textContent,
                sample: placesNamed([
                    'The Mill Street bridge is reduced to one lane.',
                    'Rosa Okafor, 14 Orchard Lane',
                ]).map(([key]) => key),
            };
        });

        expect(result.sample).toEqual(['bridge', 'orchard']);
        // Every place named today is ringed, and nothing else is.
        for (const [key, value] of Object.entries(result.drawn)) {
            expect(value, key).toBe(result.named.includes(key) ? 1 : 0);
        }
        expect(result.caption).toMatch(/^CORBIN FALLS — /);
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

    test('the paper knows what day it is', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForFunction(() => Boolean(window.Neckass?.issue));

        const checked = await page.evaluate(() => {
            const { issue } = window.Neckass;
            const compose = (value) =>
                issue.composeIssue(issue.parseIssueDate(value));
            const before = compose('2026-11-25');
            const thanksgiving = compose('2026-11-26');
            const wednesday = compose('2026-10-07');
            const birthday = compose('2027-03-11');
            const anniversary = compose('2027-09-29');
            return {
                // Yesterday's lead continues at the top of today's column.
                followUp: thanksgiving.briefs[0],
                expectedFollowUp: before.lead.followUp,
                thanksgivingNotice: thanksgiving.notices[0],
                thanksgivingBrief: thanksgiving.briefs[1],
                councilReport: wednesday.briefs[1],
                birthdayBrief: birthday.briefs[1],
                birthdayLetter: birthday.letters[1]?.signature,
                anniversaryBrief: anniversary.briefs[1],
                counts: [
                    thanksgiving.briefs.length,
                    thanksgiving.notices.length,
                    birthday.letters.length,
                    birthday.classifieds.length,
                ],
            };
        });

        expect(checked.followUp).toBe(checked.expectedFollowUp);
        expect(checked.thanksgivingNotice).toMatch(/Thanksgiving/);
        expect(checked.thanksgivingBrief).toMatch(/bring a side/);
        expect(checked.councilReport).toMatch(/Town council met Tuesday/);
        expect(checked.birthdayBrief).toBe(
            'Neckass is 38 today. He has told people he is 36 since he was 36.',
        );
        expect(checked.birthdayLetter).toBe('Bernadette Neckass, Corbin Falls');
        expect(checked.anniversaryBrief).toMatch(/^The Gazette is three today/);
        // A dated item takes the place of a dealt one; sizes do not change.
        expect(checked.counts).toEqual([7, 3, 2, 5]);
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

    test('a landmark issue is written, and the chain runs through it', async ({
        page,
    }) => {
        await page.goto(`${BASE_URL}?issue=2024-09-29`);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));

        const first = await page.evaluate(() => window.Neckass.currentIssue);
        expect(first.number).toBe(1);
        expect(first.tag).toBe('First edition');
        await expect(page.locator('#editorial')).toBeVisible();
        await expect(page.locator('#editorial-head')).toHaveText('Why a paper');
        // The first edition has nothing to correct and one letter.
        await expect(page.locator('#corrections-list li')).toHaveCount(1);
        await expect(page.locator('#letters-list li')).toHaveCount(1);
        // The earliest issues are shorter.
        await expect(page.locator('#briefs-list li')).toHaveCount(3);

        // No. 2 retracts a detail of the written lead, not a dealt one.
        const second = await page.evaluate(() =>
            window.Neckass.issue.composeIssue(new Date(2024, 8, 30)),
        );
        expect(second.corrections[1]).toBe(first.lead.correction);
        expect(second.editorial).toBeNull();

        // An ordinary issue carries no editorial.
        await page.goto(BASE_URL);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));
        await expect(page.locator('#editorial')).toBeHidden();
    });

    test('an issue not yet published falls back to today and says so', async ({
        page,
    }) => {
        await page.goto(`${BASE_URL}?issue=2099-01-01`);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));

        const [rendered, today] = await page.evaluate(() => [
            window.Neckass.currentIssue.number,
            window.Neckass.issue.issueNumber(new Date()),
        ]);
        expect(rendered).toBe(today);
        const notice = page.locator('#back-issue-notice');
        await expect(notice).toBeVisible();
        await expect(notice).toContainText('goes to press');
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

    test('no lead runs twice inside one round of the pool', async ({
        page,
    }) => {
        await page.goto(BASE_URL);
        await page.waitForFunction(() => Boolean(window.Neckass?.issue));

        const result = await page.evaluate(() => {
            const { issue, data } = window.Neckass;
            const size = data.LEADS.length;
            const rounds = [];
            // Three consecutive rounds, well clear of the landmark issues.
            for (let round = 8; round < 11; round += 1) {
                const seen = new Set();
                for (let place = 0; place < size; place += 1) {
                    const number = round * size + place + 1;
                    if (data.EDITIONS[number]) continue;
                    seen.add(issue.selectLead(number, data.LEADS).headline);
                }
                rounds.push(seen.size);
            }
            return { size, rounds };
        });

        for (const distinct of result.rounds) {
            expect(distinct).toBe(result.size);
        }
        // Every lead carries everything the paper prints about it.
        const incomplete = await page.evaluate(
            () =>
                window.Neckass.data.LEADS.filter(
                    (lead) =>
                        !(
                            lead.headline &&
                            lead.deck &&
                            lead.byline &&
                            lead.correction &&
                            lead.followUp &&
                            lead.classified &&
                            lead.letter?.body &&
                            lead.letter?.signature
                        ),
                ).length,
        );
        expect(incomplete).toBe(0);
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
            '2025-07-13',
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

    test('the edge draws a card for the issue and points the share tags at it', async ({
        request,
    }) => {
        // The front page, served through the middleware, carries the lead
        // of the issue asked for and an image URL for the same issue.
        const page = await request.get(`${EDGE_URL}?issue=2025-01-06`);
        expect(page.ok()).toBe(true);
        const html = await page.text();
        expect(html).toContain('<title>Neckass has told the Gazette');
        expect(html).toContain(
            '<meta property="og:image" content="https://neckass.com/card.png?issue=2025-01-06">',
        );
        expect(html).toContain(
            '<meta name="twitter:image" content="https://neckass.com/card.png?issue=2025-01-06">',
        );

        // The card is a real PNG of a useful size, not an empty response
        // with the right content type.
        const card = await request.get(`${EDGE_URL}card.png?issue=2025-01-06`);
        expect(card.ok()).toBe(true);
        expect(card.headers()['content-type']).toBe('image/png');
        const bytes = await card.body();
        expect(bytes.length).toBeGreaterThan(20_000);
        expect(bytes.subarray(0, 8)).toEqual(
            Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        );

        // A date before the first edition is not an issue.
        const early = await request.get(`${EDGE_URL}card.png?issue=2020-01-01`);
        expect(early.status()).toBe(404);

        // The feed is served, too.
        const feed = await request.get(`${EDGE_URL}feed.xml`);
        expect(feed.ok()).toBe(true);
        expect(feed.headers()['content-type']).toContain('application/rss+xml');
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
