/**
 * The paper's arithmetic and data, tested without a browser: `bun test`.
 * The pages, the edge and anything a reader sees rendered are
 * tests/smoke.spec.mjs, under Playwright.
 */

import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
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
import { cutSrc, JOINT_ORIGINS } from '../functions/lib/cut.mjs';
import {
    composeIssue,
    DEALS,
    parseIssueDate,
    selectLead,
} from '../modules/issue.js';
import { standingPage } from '../scripts/standing.ts';

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

describe('The Gazette', () => {
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

    test('the copy is set in curly quotes', () => {
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
    });

    test('the standing issue is No. 759 as the renderer prints it', async () => {
        // index.html carries a whole issue for a static host and for the
        // reader without JavaScript, printed by `bun run standing` with the
        // edge's renderer. Run it after changing the renderer or the page.
        const page = read('../index.html');
        expect(await standingPage(page)).toBe(page);
    });
});
