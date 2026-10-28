import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { CALENDAR } from '../data/calendar.js';
import { EDITIONS } from '../data/editions.js';
import {
    CLASSIFIEDS,
    CORRECTIONS,
    LEADS,
    LETTERS,
    WEATHER,
} from '../data/formats.js';
import { GROWTH } from '../data/growth.js';
import { HEADLINES } from '../data/headlines.js';
import { POSES } from '../data/poses.js';
import { SCENES } from '../data/scenes.js';
import { buildFeed } from '../functions/feed.xml.js';
import { cutSrc, JOINT_ORIGINS } from '../functions/lib/cut.mjs';
import { issueNumber } from '../functions/lib/issue.mjs';
import {
    composeIssue,
    DEALS,
    issueNumber as localIssueNumber,
    parseIssueDate,
    recentIssues,
    selectLead,
} from '../modules/issue.js';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:8001/';
// The Worker under workerd (wrangler dev); see playwright.config.mjs.
const EDGE_URL = process.env.PLAYWRIGHT_EDGE_URL || 'http://127.0.0.1:8800/';

// A brief ends on a period; the same item as a headline does not.
const unpunctuated = (text) => text.replace(/\.(”?)$/, '$1');

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

// The rig's joints by the name the CSS gives them and the name a pose does.
const RIG_JOINTS = {
    head: ['--tilt', 'tilt'],
    lean: ['--lean', 'lean'],
    'arm-near': ['--arm-near', 'armNear'],
    'forearm-near': ['--forearm-near', 'forearmNear'],
    'hand-near': ['--hand-near', 'handNear'],
    'arm-far': ['--arm-far', 'armFar'],
    'forearm-far': ['--forearm-far', 'forearmFar'],
    'hand-far': ['--hand-far', 'handFar'],
    'leg-near': ['--leg-near', 'legNear'],
    'leg-far': ['--leg-far', 'legFar'],
};

// A drawing's shapes in order, reduced to their geometry.
function shapesOf(svg) {
    return [...svg.matchAll(/<(path|circle|ellipse)\b([^>]*)>/g)].map(
        ([, tag, attrs]) =>
            [
                tag,
                ...['d', 'cx', 'cy', 'r', 'rx', 'ry'].map(
                    (name) =>
                        attrs.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1],
                ),
            ]
                .filter(Boolean)
                .join(' '),
    );
}

// Each joint's pivot and house angle from a stylesheet's rules, keyed by
// the pose's name for the joint.
function rigOf(css) {
    const rig = {};
    for (const [joint, [property, key]] of Object.entries(RIG_JOINTS)) {
        const rule = css.match(
            new RegExp(`\\.joint-${joint}\\s*\\{([^}]*)\\}`),
        )?.[1];
        const origin = rule?.match(/transform-origin:\s*(\d+)px (\d+)px/);
        const fallback = rule?.match(
            new RegExp(`var\\(${property},\\s*(-?\\d+)deg\\)`),
        );
        rig[key] = {
            origin: origin && [Number(origin[1]), Number(origin[2])],
            house: fallback && Number(fallback[1]),
        };
    }
    return rig;
}

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

    test("today's corrections retract yesterday's actual lead", () => {
        // Walk a spread of issues rather than only today, so the chain is
        // checked across many lead pairings.
        for (const value of [
            '2025-03-04',
            '2026-09-02',
            '2026-09-03',
            '2027-01-19',
            '2027-11-30',
        ]) {
            const date = parseIssueDate(value);
            const today = composeIssue(date);
            const previous = composeIssue(
                new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate() - 1,
                ),
            );
            expect(today.number, value).toBe(previous.number + 1);
            // The retraction printed today is the one attached to the lead
            // that actually ran yesterday, first in the box.
            expect(today.corrections[0], value).toBe(previous.lead.correction);
        }
    });

    test('the paper knows what day it is', () => {
        const compose = (value) => composeIssue(parseIssueDate(value));
        const before = compose('2026-11-25');
        const thanksgiving = compose('2026-11-26');
        const wednesday = compose('2026-10-07');
        const birthday = compose('2027-03-11');
        const anniversary = compose('2027-09-29');

        // Yesterday's lead continues at the top of today's column.
        expect(thanksgiving.briefs[0]).toBe(before.lead.followUp);
        expect(thanksgiving.briefs[1]).toMatch(/bring a side/);
        expect(wednesday.briefs[1]).toMatch(/Book club met Tuesday/);
        expect(birthday.briefs[1]).toBe(
            'Neckass is 38 today. He has told people he is 36 since he was 36.',
        );
        expect(birthday.letters[1]?.signature).toBe('His mother');
        expect(anniversary.briefs[1]).toMatch(/^The Gazette is three today/);
        // A dated item takes the place of a dealt one; sizes do not change.
        // Both days are after No. 770, when the page went to five briefs
        // and three ads.
        expect([
            thanksgiving.briefs.length,
            birthday.letters.length,
            birthday.classifieds.length,
        ]).toEqual([5, 2, 3]);
    });

    test('standing matters compound with the run', () => {
        // The recurring witnesses keep files, and the counts in them are
        // functions of the issue's date: a back issue carries the number
        // as of that issue, so the archive is the ledger.
        const compose = (value) => composeIssue(parseIssueDate(value));
        const october = compose('2026-10-14');

        // Next door files on the 14th of each month and keeps count.
        expect(compose('2025-10-14').letters[1]?.body).toBe(
            'I am at No. 14. This is letter number 1 about the bin, which is in my yard again and which he says the wind moved. I have kept every letter.',
        );
        expect(october.letters[1]?.body).toMatch(/letter number 13/);
        expect(compose('2026-11-14').letters[1]?.body).toMatch(
            /letter number 14/,
        );
        // The count only ever goes up, and the serial does not run in
        // issues that predate the grudge.
        for (const body of compose('2025-09-14').letters.map((l) => l.body)) {
            expect(body).not.toMatch(/This is letter number/);
        }
        // The day after the letter, the paper walks it back, monthly.
        expect(compose('2026-10-15').corrections[1]).toMatch(
            /The wind remains unverified/,
        );
        expect(compose('2026-05-02').briefs.join('\n')).toMatch(
            /going out this week” for \d+ days/,
        );
        expect(compose('2026-05-08').classifieds.join('\n')).toMatch(
            /now \d+ days out/,
        );
        const debt = compose('2026-08-04').letters[1];
        expect(debt?.body).toMatch(/outstanding for \d+ days/);
        expect(debt?.signature).toBe('The friend from the Fourth, $35 down');
        // His mother counts her reading in issues: 2025-05-11 is No. 225.
        expect(compose('2025-05-11').letters[1]?.body).toMatch(
            /225 issues of it/,
        );

        // A standing matter takes the place of a dealt item; sizes hold.
        expect([
            october.letters.length,
            compose('2026-10-15').corrections.length,
            compose('2026-05-02').briefs.length,
            compose('2026-05-08').classifieds.length,
        ]).toEqual([2, 4, 7, 5]);
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

    test('an issue not yet published falls back to today and says so', async ({
        page,
    }) => {
        await page.goto(`${BASE_URL}?issue=2099-01-01`);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));

        const rendered = await page.evaluate(
            () => window.Neckass.currentIssue.number,
        );
        expect(rendered).toBe(localIssueNumber(new Date()));
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
        expect(rendered).toBe(localIssueNumber(new Date()));
        await expect(page.locator('#back-issue-notice')).toBeHidden();
    });

    test('no lead is also a brief', () => {
        // The lead tells the story at length; the same sentence in the
        // briefs column on another morning would be the paper repeating
        // itself.
        const leads = new Set(
            [
                ...Object.values(LEADS),
                ...Object.values(EDITIONS).map((edition) => edition.lead),
            ]
                .filter(Boolean)
                .map((lead) => unpunctuated(lead.headline)),
        );
        expect(
            Object.values(HEADLINES).filter((item) =>
                leads.has(unpunctuated(item)),
            ),
        ).toEqual([]);
    });

    test('the copy is set in curly quotes', async ({ page }) => {
        // Quotation marks and apostrophes are curly wherever a reader
        // sees them: the pools, the landmark issues, the calendar, the
        // file cut's captions and the pages. A straight one is a
        // typewriter's, and at the size of the headline it shows.
        const straight = [];
        const walk = (value) => {
            if (typeof value === 'string') {
                if (/['"]/.test(value)) straight.push(value);
            } else if (value && typeof value === 'object') {
                for (const item of Object.values(value)) walk(item);
            }
        };
        walk([
            LEADS,
            HEADLINES,
            CORRECTIONS,
            CLASSIFIEDS,
            LETTERS,
            WEATHER,
            CALENDAR,
            EDITIONS,
            POSES,
            SCENES,
        ]);
        expect(straight).toEqual([]);

        for (const path of ['', 'about', 'archive', 'prompts', '404']) {
            await page.goto(`${BASE_URL}${path}`);
            const text = await page.locator('body').innerText();
            expect(text.match(/.{0,30}['"].{0,30}/g), path || '/').toBeNull();
        }
    });

    test('a dealt item does not come back inside ten days', () => {
        // Two years of issues. Only pooled items are tracked: the
        // calendar's weekly items come back every seven days on purpose.
        const start = parseIssueDate('2025-01-01');
        const issues = Array.from({ length: 730 }, (_, offset) =>
            composeIssue(
                new Date(
                    start.getFullYear(),
                    start.getMonth(),
                    start.getDate() + offset,
                ),
            ),
        );
        for (const [section, { pool, perIssue }] of Object.entries(DEALS)) {
            // A day takes no more than a quarter of its pool, or the
            // quarters could not keep a day's items apart.
            const items = Object.values(pool);
            expect(items.length, section).toBeGreaterThanOrEqual(4 * perIssue);
            const pooled = new Set(items.map((item) => JSON.stringify(item)));
            const last = new Map();
            let closest = Number.POSITIVE_INFINITY;
            issues.forEach((issue, day) => {
                for (const item of [issue[section]].flat()) {
                    const key = JSON.stringify(item);
                    if (!pooled.has(key)) continue;
                    if (last.has(key)) {
                        closest = Math.min(closest, day - last.get(key));
                    }
                    last.set(key, day);
                }
            });
            expect(closest, section).toBeGreaterThan(10);
        }
    });

    test('no lead runs twice inside one round of the pool', () => {
        // Each step of the pool's growth deals its own rounds. Three
        // consecutive rounds of each, clear of the landmark issues.
        for (const { from, size } of GROWTH.leads) {
            const first = from === 1 ? 8 : 0;
            for (let round = first; round < first + 3; round += 1) {
                const seen = new Set();
                for (let place = 0; place < size; place += 1) {
                    const number = from + round * size + place;
                    if (EDITIONS[number]) continue;
                    seen.add(selectLead(number).headline);
                }
                expect(seen.size, `from No. ${from}`).toBe(size);
            }
        }

        // Each round is its own shuffle, so the seam between two rounds,
        // or two steps, is where a lead could run twice in a row. It must
        // not come back inside a quarter of the pool (a fortnight at most).
        const last = new Map();
        let closest = Number.POSITIVE_INFINITY;
        const { from, size } = GROWTH.leads.at(-1);
        for (let number = 1; number <= from + size * 6; number += 1) {
            if (EDITIONS[number]) continue;
            const { headline } = selectLead(number);
            if (last.has(headline)) {
                closest = Math.min(closest, number - last.get(headline));
            }
            last.set(headline, number);
        }
        const smallest = Math.min(...GROWTH.leads.map((step) => step.size));
        expect(closest).toBeGreaterThan(Math.min(14, Math.floor(smallest / 4)));

        // Every lead carries everything the paper prints about it, a pose
        // the file cut has, and only scenes it has a layer for.
        const incomplete = [
            ...Object.values(LEADS),
            ...Object.values(EDITIONS).map((edition) => edition.lead),
        ].filter(
            (lead) =>
                !(
                    POSES[lead.pose] &&
                    (lead.scene || []).every((prop) => SCENES[prop]) &&
                    lead.headline &&
                    lead.deck &&
                    lead.byline &&
                    lead.correction &&
                    lead.followUp &&
                    lead.classified &&
                    lead.letter?.body &&
                    lead.letter?.signature
                ),
        ).length;
        expect(incomplete).toBe(0);
    });

    test('a pool that grows keeps the back issues as they ran', () => {
        // Every item has a number, from 1 with none skipped, and is dealt
        // by it, so where it sits in the file does not matter. A pool
        // grows by steps at issues that have not run yet (data/growth.js):
        // each pool's last step is its highest number, and the steps only
        // go forward.
        const pools = { leads: LEADS };
        for (const [section, { pool }] of Object.entries(DEALS)) {
            pools[section] = pool;
        }
        for (const [name, pool] of Object.entries(pools)) {
            const ids = Object.keys(pool).map(Number);
            expect(ids, name).toEqual(ids.map((_, index) => index + 1));
            const steps = GROWTH[name];
            expect(steps[0], name).toEqual({ from: 1, size: steps[0].size });
            expect(steps.at(-1).size, name).toBe(ids.length);
            steps.slice(1).forEach((step, index) => {
                expect(step.from, name).toBeGreaterThan(steps[index].from);
                expect(step.size, name).toBeGreaterThanOrEqual(
                    steps[index].size,
                );
            });
        }

        // The item each issue was dealt in each pool, by its number less
        // one (its place in the pool before the pools had numbers), through
        // No. 769, the last issue before the pools first grew. A change to
        // the dealing changes this; editing an item in place does not.
        const placeOf = (pool, item) => {
            const id = Object.keys(pool).find((key) => pool[key] === item);
            return id === undefined ? -1 : Number(id) - 1;
        };
        let hash = 0x811c9dc5;
        for (let number = 1; number <= 769; number += 1) {
            const issue = composeIssue(new Date(2024, 8, 28 + number));
            const row = [placeOf(LEADS, issue.lead)];
            for (const [section, { pool }] of Object.entries(DEALS)) {
                row.push(
                    [issue[section]].flat().map((item) => placeOf(pool, item)),
                );
            }
            for (const char of JSON.stringify(row)) {
                hash = Math.imul(hash ^ char.charCodeAt(0), 0x01000193) >>> 0;
            }
        }
        expect(hash.toString(16)).toBe('27b53208');

        // From No. 770 the page prints fewer items a day: five briefs,
        // three corrections, three ads, two letters.
        const later = composeIssue(new Date(2024, 8, 28 + 800));
        expect(
            ['briefs', 'corrections', 'classifieds', 'letters'].map(
                (section) => later[section].filter(Boolean).length,
            ),
        ).toEqual([5, 3, 3, 2]);

        // An item a step retires does not run from that step on.
        for (const [name, steps] of Object.entries(GROWTH)) {
            for (const { from, retired = [] } of steps) {
                const pool = pools[name];
                const gone = new Set(retired.map((id) => pool[id]));
                for (let number = from; number < from + 120; number += 1) {
                    const issue = composeIssue(new Date(2024, 8, 28 + number));
                    const printed =
                        name === 'leads' ? [issue.lead] : [issue[name]].flat();
                    for (const item of printed) {
                        expect(gone.has(item), `${name} No. ${number}`).toBe(
                            false,
                        );
                    }
                }
            }
        }
    });

    test('the archive lists issues that resolve to real papers', async ({
        page,
    }) => {
        await page.goto(`${BASE_URL}archive`);
        const links = page.locator('a[href*="?issue="]');
        await expect(links.first()).toBeVisible();
        expect(await links.count()).toBeGreaterThan(5);

        // The month index reaches every month in the run.
        const months = await page.evaluate(() => ({
            links: [...document.querySelectorAll('#archive-months a')].map(
                (a) => a.getAttribute('href'),
            ),
            sections: document.querySelectorAll('.archive-month').length,
        }));
        expect(months.links.length).toBe(months.sections);
        for (const href of months.links) {
            await expect(page.locator(href)).toHaveCount(1);
        }

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

    test('the file cut is one drawing wherever it is drawn', () => {
        // The rig, the front page's inlined copy and the card's flattened
        // copy are three copies of the same parts. A part changed in one
        // and not the others would stand differently in each.
        const rig = read('../assets/cuts/neckass.svg');
        const inline = read('../index.html').match(
            /<svg class="cut-figure"[\s\S]*?<\/svg>/,
        )[0];
        // The card draws only the scene it is given; with every prop on,
        // it is the whole rig.
        const card = atob(
            cutSrc(POSES.explaining.joints, Object.keys(SCENES)).split(',')[1],
        );
        const shapes = shapesOf(rig);
        expect(shapes.length).toBeGreaterThan(20);
        expect(shapesOf(inline)).toEqual(shapes);
        expect(shapesOf(card)).toEqual(shapes);
        const bare = atob(cutSrc(POSES.explaining.joints).split(',')[1]);
        expect(shapesOf(bare).length).toBeLessThan(shapes.length);

        // Every prop is a layer with a switch, off unless it is thrown, in
        // the rig and on the page, so the standing issue and the rig on its
        // own show him on the bare sheet.
        const sheet = read('../styles.css');
        for (const prop of Object.keys(SCENES)) {
            for (const [where, source] of [
                ['rig', rig],
                ['page', sheet],
            ]) {
                expect(source, `${where}: ${prop}`).toMatch(
                    new RegExp(
                        `\\.scene-${prop}\\s*\\{\\s*opacity:\\s*var\\(--${prop},\\s*0\\);`,
                    ),
                );
            }
            expect(rig, prop).toContain(`<g class="scene-${prop}">`);
            expect(inline, prop).toContain(`<g class="scene-${prop}">`);
        }

        // The joints turn on the same pivots, and unposed they stand in
        // the house pose, which is the pose a lead naming none is given.
        const fromRig = rigOf(rig);
        const fromPage = rigOf(read('../styles.css'));
        for (const [joint, origin] of Object.entries(JOINT_ORIGINS)) {
            const house = POSES.explaining.joints[joint];
            expect(fromRig[joint], joint).toEqual({ origin, house });
            expect(fromPage[joint], joint).toEqual({ origin, house });
        }
        // Every pose sets every joint, so none falls back mid-pose.
        for (const [name, pose] of Object.entries(POSES)) {
            expect(Object.keys(pose.joints).sort(), name).toEqual(
                Object.keys(JOINT_ORIGINS).sort(),
            );
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

    test('the sitemap and each page name the URL the host serves', () => {
        // The edge answers /archive.html with a 308 to /archive. A
        // sitemap entry or canonical that names the .html file points search
        // engines at a redirect, so both use the extensionless path.
        const sitemap = read('../sitemap.xml');
        const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
            (match) => match[1],
        );
        expect(locs).toContain('https://neckass.com/');
        for (const loc of locs) {
            expect(loc).not.toMatch(/\.html$/);
        }
        for (const page of ['archive', 'about', 'prompts']) {
            const html = read(`../${page}.html`);
            expect(locs).toContain(`https://neckass.com/${page}`);
            expect(html).toContain(
                `<link rel="canonical" href="https://neckass.com/${page}">`,
            );
            expect(html).not.toMatch(/href="\/(archive|about|prompts)\.html"/);
        }
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

    test('the edge writes the masthead and lead of the issue into the page', async ({
        request,
        page,
    }) => {
        // The markup carries a standing issue whose folio line is one line;
        // today's is two on a phone. The edge writes the asked-for issue's
        // masthead and lead so the script's swap does not move the page.
        const issue = composeIssue(parseIssueDate('2025-06-11'));
        const [day, volume] = issue.mastheadLine.split(' · ');
        const response = await request.get(`${EDGE_URL}?issue=2025-06-11`);
        expect(response.ok()).toBe(true);
        const html = await response.text();
        expect(html).toContain(
            `<p class="masthead__line" id="masthead-date"><span>${day}</span><span class="masthead__sep"> · </span><span>${volume}</span></p>`,
        );
        expect(html).toContain(
            `<a href="/?issue=2025-06-11" id="lead-link">${issue.lead.headline
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')}</a>`,
        );

        // After the script runs, the folio line and the lead read the same.
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(`${EDGE_URL}?issue=2025-06-11`);
        await page.waitForFunction(() => Boolean(window.Neckass?.currentIssue));
        await expect(page.locator('#masthead-date')).toHaveText(
            issue.mastheadLine,
        );
        await expect(page.locator('#lead-link')).toHaveText(
            issue.lead.headline,
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
