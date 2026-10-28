import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { GROWTH } from '../data/growth.js';
import { POSES } from '../data/poses.js';
import { SCENES } from '../data/scenes.js';
import { buildFeed } from '../functions/feed.xml.js';
import {
    composeIssue,
    DEALS,
    issueNumber,
    parseIssueDate,
    pressDate,
    recentIssues,
    selectLead,
} from '../modules/issue.js';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:8001/';
// The Worker under workerd (wrangler dev); see playwright.config.mjs.
const EDGE_URL = process.env.PLAYWRIGHT_EDGE_URL || 'http://127.0.0.1:8800/';

// A brief ends on a period; the same item as a headline does not.
const unpunctuated = (text) => text.replace(/\.(”?)$/, '$1');

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test.describe('The Gazette', () => {
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
        await expect(page.locator('#lead-deck')).toHaveText(issue.lead.deck);
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
        // The file cut takes the lead's pose and scene, the cutline says
        // which pose, and the alt text says both.
        expect(issue.pose).toEqual(POSES[issue.lead.pose]);
        const cut = page.locator('#cut-figure');
        await expect(page.locator('#cut-caption')).toHaveText(
            issue.pose.caption,
        );
        await expect(cut).toHaveAttribute('aria-label', issue.cutAlt);
        await expect(cut).toHaveAttribute('data-pose', issue.poseName);
        expect(
            await cut.evaluate((node) =>
                node.style.getPropertyValue('--arm-far'),
            ),
        ).toBe(`${issue.pose.joints.armFar}deg`);
        const switches = await cut.evaluate(
            (node, props) =>
                Object.fromEntries(
                    props.map((prop) => [
                        prop,
                        node.style.getPropertyValue(`--${prop}`),
                    ]),
                ),
            Object.keys(SCENES),
        );
        for (const prop of Object.keys(SCENES)) {
            expect(switches[prop], prop).toBe(
                issue.scene.includes(prop) ? '1' : '0',
            );
        }

        // Every section is dealt at its documented size: the item it
        // carries from the lead and the places it deals that day. A pool
        // that empties would silently shorten one of these.
        for (const section of ['briefs', 'corrections', 'classifieds']) {
            const step = GROWTH[section]
                .filter(({ from }) => from <= issue.number)
                .at(-1);
            await expect(page.locator(`#${section}-list li`)).toHaveCount(
                1 + (step.perIssue ?? DEALS[section].perIssue),
            );
        }
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

        // The lead must not also be running as a brief, where it would be
        // the same sentence with a closing period.
        const briefs = await page.locator('#briefs-list li').allInnerTexts();
        expect(briefs.map(unpunctuated)).not.toContain(
            unpunctuated(issue.lead.headline),
        );

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

    test('a back issue loads from its URL and offers the way back', async ({
        page,
    }) => {
        await page.goto(`${BASE_URL}?issue=2025-06-11`);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));

        const issue = await page.evaluate(() => window.Neckass.currentIssue);
        expect(issue.issueParam).toBe('2025-06-11');
        // The headline is the issue's permalink.
        await expect(page.locator('#lead-headline a')).toHaveAttribute(
            'href',
            '/?issue=2025-06-11',
        );

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

    test('the front page leads back into the run', async ({ page }) => {
        await page.goto(`${BASE_URL}?issue=2025-06-11`);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));
        const issue = await page.evaluate(() => window.Neckass.currentIssue);

        // The nameplate says what the paper covers.
        await expect(page.locator('h1')).toHaveText('The Gazette');
        await expect(page.locator('.nameplate__motto')).toContainText(
            'One man',
        );

        // The three issues before this one, each a link to it, under the
        // lead that ran.
        const earlier = page.locator('#earlier-list a');
        await expect(earlier).toHaveCount(3);
        const expected = recentIssues(4, parseIssueDate(issue.issueParam))
            .slice(1)
            .map((back) => ({
                href: `/?issue=${back.issueParam}`,
                headline: back.lead.headline,
            }));
        for (const [index, back] of expected.entries()) {
            await expect(earlier.nth(index)).toHaveAttribute('href', back.href);
            await expect(earlier.nth(index)).toContainText(back.headline);
        }

        // The correction retracting yesterday's lead links to yesterday.
        await expect(
            page.locator('#corrections-list li').first().locator('a'),
        ).toHaveAttribute('href', expected[0].href);

        // The first edition has nothing earlier; the way to the archive stays.
        await page.goto(`${BASE_URL}?issue=2024-09-29`);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));
        await expect(page.locator('#earlier-list a')).toHaveAttribute(
            'href',
            '/archive',
        );
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
        const second = composeIssue(new Date(2024, 8, 30));
        expect(second.corrections[0]).toBe(first.lead.correction);
        expect(second.editorial).toBeNull();

        // An ordinary issue carries no editorial. No. 2 is one; today is
        // not always (on an anniversary the front page is a landmark).
        await page.goto(`${BASE_URL}?issue=2024-09-30`);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));
        await expect(page.locator('#editorial')).toBeHidden();
    });

    test('a link to the standing issue is printed as that back issue', async ({
        page,
    }) => {
        // The markup's standing issue is No. 759. On a static host, a link
        // to No. 759 still gets the back-issue notice and its own title,
        // which only printing the request gives it.
        await page.goto(`${BASE_URL}?issue=2026-10-27`);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));
        const issue = composeIssue(parseIssueDate('2026-10-27'));
        await expect(page.locator('#back-issue-notice')).toBeVisible();
        await expect(page.locator('#back-issue-text')).toContainText(
            'You are reading No. 759',
        );
        await expect(page).toHaveTitle(
            `${issue.lead.headline} | The Gazette, No. 759`,
        );
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
            'href',
            'https://neckass.com/?issue=2026-10-27',
        );
    });

    test('an issue not yet published falls back to today and says so', async ({
        page,
    }) => {
        await page.goto(`${BASE_URL}?issue=2099-01-01`);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));

        const rendered = await page.evaluate(
            () => window.Neckass.currentIssue.number,
        );
        expect(rendered).toBe(issueNumber(pressDate()));
        const notice = page.locator('#back-issue-notice');
        await expect(notice).toBeVisible();
        await expect(notice).toContainText('goes to press');
    });

    test('a malformed issue param falls back to today', async ({ page }) => {
        await page.goto(`${BASE_URL}?issue=not-a-date`);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));

        const rendered = await page.evaluate(
            () => window.Neckass.currentIssue.number,
        );
        expect(rendered).toBe(issueNumber(pressDate()));
        await expect(page.locator('#back-issue-notice')).toBeHidden();
    });

    test('the pages are set in curly quotes', async ({ page }) => {
        // The pools are checked in tests/paper.test.mjs; this reads the
        // pages as a reader gets them.
        for (const path of ['', 'about', 'archive', 'prompts', '404']) {
            await page.goto(`${BASE_URL}${path}`);
            const text = await page.locator('body').innerText();
            expect(text.match(/.{0,30}['"].{0,30}/g), path || '/').toBeNull();
        }
    });

    test('the archive lists issues that resolve to real papers', async ({
        page,
    }) => {
        await page.goto(`${BASE_URL}archive`);
        const links = page.locator('a[href*="?issue="]');
        await expect(links.first()).toBeVisible();
        expect(await links.count()).toBeGreaterThan(5);

        // The page is one month, this one, and lists today first.
        await expect(page.locator('.archive-month')).toHaveCount(1);
        await expect(page.locator('.archive-tag--current')).toHaveText(
            'Current issue',
        );
        // The month index reaches every month in the run, from the first
        // edition's on, and each link opens that month.
        const months = await page
            .locator('#archive-months a')
            .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
        const first = new Date(2024, 8, 29);
        const today = pressDate();
        expect(months.length).toBe(
            (today.getFullYear() - first.getFullYear()) * 12 +
                today.getMonth() -
                first.getMonth() +
                1,
        );
        expect(months.at(-1)).toBe('/archive?month=2024-09');
        await page.goto(new URL(months.at(-1), BASE_URL).toString());
        await expect(page.locator('.archive-month .section-label')).toHaveText(
            'September 2024',
        );
        await expect(page.locator('.archive-month li')).toHaveCount(2);
        await expect(
            page.locator('#archive-months a[aria-current="page"]'),
        ).toHaveText('Sept.');
        await expect(page.locator('.archive-steps a')).toHaveText([
            'Later: October 2024',
        ]);
        await page.goto(`${BASE_URL}archive`);

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

    test('the cut acts out its pose once, and not at all when asked not to', async ({
        browser,
    }) => {
        // Motion that starts by itself and runs past five seconds needs a
        // way to stop it (WCAG 2.2.2). The paper has no controls, so the
        // cut stops by itself, and does not start for a reader who has
        // asked for less motion.
        for (const reducedMotion of ['no-preference', 'reduce']) {
            const context = await browser.newContext({ reducedMotion });
            const page = await context.newPage();
            await page.goto(BASE_URL);
            await page.waitForFunction(() =>
                Boolean(window.Neckass?.currentIssue),
            );
            // Animations only: the stylesheet's reduced-motion rule gives
            // every property a 0.01ms transition, which setting the pose
            // trips, and those are not motion.
            const ends = await page.evaluate(() =>
                document
                    .getAnimations()
                    .filter(
                        (animation) =>
                            animation instanceof CSSAnimation &&
                            animation.effect?.target?.closest?.('#cut-figure'),
                    )
                    .map(
                        (animation) =>
                            animation.effect.getComputedTiming().endTime,
                    ),
            );
            if (reducedMotion === 'reduce') {
                expect(ends).toEqual([]);
            } else {
                expect(ends.length).toBeGreaterThan(0);
                expect(Math.max(...ends)).toBeLessThanOrEqual(5000);
            }
            await context.close();
        }
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

    test('the feed is well-formed and leads with the current issue', async ({
        page,
    }) => {
        // 1 a.m. UTC on Sept. 2 is still Sept. 1 by the press clock, so the
        // feed leads with No. 703, not No. 704: it goes by the press clock,
        // as the page does, not by the Worker's UTC.
        const now = new Date(Date.UTC(2026, 8, 2, 1));
        const xml = buildFeed(now);
        expect(issueNumber(pressDate(now))).toBe(703);

        expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(
            true,
        );
        expect(xml).toContain('<atom:link href="https://neckass.com/feed.xml"');

        const items = xml.match(/<item>/g) ?? [];
        expect(items.length).toBe(30);

        const firstTitle = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>/.exec(
            xml,
        )?.[1];
        const headline =
            selectLead(issueNumber(pressDate(now)))?.headline ?? '';
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

    test('the edge prints the whole issue into the page', async ({
        browser,
        page,
    }) => {
        // The edge prints the asked-for issue into the markup with the
        // renderer the browser uses, so a reader without JavaScript, and a
        // crawler, gets that issue whole: every section, the file cut's
        // pose and the earlier issues, not the standing one.
        const issue = composeIssue(parseIssueDate('2025-06-11'));
        const context = await browser.newContext({ javaScriptEnabled: false });
        const bare = await context.newPage();
        await bare.goto(`${EDGE_URL}?issue=2025-06-11`);
        await expect(bare.locator('.front-page')).toHaveAttribute(
            'data-issue',
            String(issue.number),
        );
        await expect(bare.locator('#masthead-date')).toHaveText(
            issue.mastheadLine,
        );
        await expect(bare.locator('#lead-link')).toHaveText(
            issue.lead.headline,
        );
        await expect(bare.locator('#lead-link')).toHaveAttribute(
            'href',
            '/?issue=2025-06-11',
        );
        await expect(bare.locator('#briefs-list li')).toHaveText(issue.briefs);
        await expect(bare.locator('#classifieds-list li')).toHaveCount(
            issue.classifieds.length,
        );
        await expect(bare.locator('#letters-list .letter-body')).toHaveText(
            issue.letters.map((letter) => letter.body),
        );
        await expect(bare.locator('#weather-line')).toHaveText(issue.weather);
        await expect(bare.locator('#cut-figure')).toHaveAttribute(
            'data-pose',
            issue.poseName,
        );
        await expect(bare.locator('#back-issue-notice')).toBeVisible();
        await expect(bare).toHaveTitle(
            `${issue.lead.headline} | The Gazette, No. ${issue.number}`,
        );
        await context.close();

        // With the script, the page is already the issue it would print,
        // and it leaves it as the edge printed it.
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(`${EDGE_URL}?issue=2025-06-11`);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));
        await expect(page.locator('#masthead-date')).toHaveText(
            issue.mastheadLine,
        );
        await expect(page.locator('#lead-link')).toHaveText(
            issue.lead.headline,
        );
        await expect(page).toHaveTitle(
            `${issue.lead.headline} | The Gazette, No. ${issue.number}`,
        );
    });

    test('the edge draws a card for the issue and points the share tags at it', async ({
        request,
    }) => {
        // The front page, served through the middleware, carries the lead
        // of the issue asked for and an image URL for the same issue.
        const page = await request.get(`${EDGE_URL}?issue=2025-01-06`);
        expect(page.ok()).toBe(true);
        const html = await page.text();
        expect(html).toContain('<title>Neckass told the Gazette');
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

    test('the edge serves every file the pages name, and none of the source', async ({
        request,
    }) => {
        // The Worker's assets are the repository root, and .assetsignore
        // lets the site back in. A file a page names that the list leaves
        // out is a broken page; a file it lets out that is not the site is
        // the repository on the open web.
        const named = new Set();
        for (const page of ['index', 'about', 'archive', 'prompts', '404']) {
            const html = read(`../${page}.html`);
            const refs = [
                ...html.matchAll(/(?:src|href)="([^"]+)"/g),
                ...html.matchAll(/content="(https:\/\/neckass\.com\/[^"]*)"/g),
            ];
            for (const [, ref] of refs) {
                const url = new URL(ref, 'https://neckass.com/');
                if (url.hostname === 'neckass.com') named.add(url.pathname);
            }
        }
        for (const icon of JSON.parse(read('../site.webmanifest')).icons) {
            named.add(icon.src);
        }
        for (const path of named) {
            const response = await request.get(`${EDGE_URL}${path.slice(1)}`);
            expect(response.status(), path).toBe(200);
        }

        for (const path of [
            'package.json',
            'bun.lock',
            'README.md',
            'AGENTS.md',
            'wrangler.jsonc',
            'worker.js',
            '.assetsignore',
            '_headers',
            'functions/_middleware.js',
            'scripts/serve.ts',
            'tests/smoke.spec.mjs',
            '.github/workflows/ci.yml',
            'scripts/draw-cut.ts',
            'fonts/README.md',
        ]) {
            const response = await request.get(`${EDGE_URL}${path}`);
            expect(response.status(), path).toBe(404);
        }
    });

    test('the pages run under their content security policy', async ({
        browser,
    }) => {
        // Each page is served with a policy that lets it load only the
        // site's own scripts, styles, fonts and images (_headers). Every
        // page, as the edge serves it, renders without the browser blocking
        // anything it asked for.
        const context = await browser.newContext();
        for (const path of [
            '',
            '?issue=2025-06-11',
            'about',
            'archive',
            'prompts',
            'missing',
        ]) {
            const page = await context.newPage();
            const blocked = [];
            page.on('console', (message) => {
                if (/Content Security Policy/i.test(message.text())) {
                    blocked.push(message.text());
                }
            });
            const response = await page.goto(`${EDGE_URL}${path}`);
            expect(
                response.headers()['content-security-policy'],
                path,
            ).toContain("script-src 'self'");
            await page.waitForLoadState('networkidle');
            expect(blocked, path || '/').toEqual([]);
            await page.close();
        }
        await context.close();
    });

    test('the edge answers the way Pages did', async ({ request }) => {
        // The middleware writes a different issue into the same index.html
        // every day, so the front page carries no ETag a browser could
        // revalidate yesterday's paper against.
        const front = await request.get(`${EDGE_URL}?issue=2025-01-06`);
        expect(front.status()).toBe(200);
        expect(front.headers().etag).toBeUndefined();

        // A path with no file is the 404 page, not cached.
        const missing = await request.get(`${EDGE_URL}no-such-page`);
        expect(missing.status()).toBe(404);
        expect(missing.headers()['content-type']).toContain('text/html');
        expect(missing.headers()['cache-control']).toBe('no-store');

        // The .html address of a page moved permanently, query and all.
        const moved = await request.get(`${EDGE_URL}about.html?x=1`, {
            maxRedirects: 0,
        });
        expect(moved.status()).toBe(308);
        expect(moved.headers().location).toBe('/about?x=1');

        // Pages matched a function's route in any case, with or without a
        // trailing slash.
        const feed = await request.get(`${EDGE_URL}Feed.xml/`);
        expect(feed.status()).toBe(200);
        expect(feed.headers()['content-type']).toContain('application/rss+xml');
    });
});
