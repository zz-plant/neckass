/**
 * The issue arithmetic, shared by the browser and the edge.
 *
 * The Gazette first published on 2024-09-29. Every issue since is derived
 * from its own date and nothing else: no backend, no storage, no per-visit
 * randomness. Two people opening the site on the same day read the same
 * paper, which is the whole point of a paper.
 *
 * This file is a plain ES module imported by modules/front-page.js and
 * modules/archive-list.js in the browser and by functions/lib/issue.mjs on
 * the edge, so both runtimes name the same lead the same way.
 */

import { EDITIONS } from '../data/editions.js';
import {
    CLASSIFIEDS,
    CORRECTIONS,
    LEADS,
    LETTERS,
    WEATHER,
} from '../data/formats.js';
import { HEADLINES } from '../data/headlines.js';
import { POSES } from '../data/poses.js';
import { itemsFor as calendarItemsFor } from './calendar.js';

export const FIRST_EDITION = Date.UTC(2024, 8, 29);
const DAY_MS = 86400000;

function toUtcDay(date) {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Zero-based days since the first edition, from a UTC-midnight timestamp. */
export function dayIndex(utcDay) {
    return Math.floor((utcDay - FIRST_EDITION) / DAY_MS);
}

export function issueNumber(date) {
    return dayIndex(toUtcDay(date)) + 1;
}

// mulberry32. Small, fast, and good enough that consecutive issue numbers
// do not produce visibly related papers.
function createRng(seed) {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

// Parse an ?issue=YYYY-MM-DD param into a local date, or null. Local, not
// UTC, so the archive lines up with the masthead a reader sees at home.
export function parseIssueDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
    if (!match) return null;
    const [, year, month, day] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (Number.isNaN(date.getTime())) return null;
    if (date.getMonth() !== Number(month) - 1) return null;
    return date;
}

// Volumes turn over on the anniversary of the first edition.
function volumeLabel(number) {
    const volume = Math.floor((number - 1) / 365) + 1;
    const numerals = [
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
        'X',
    ];
    return numerals[volume - 1] || String(volume);
}

// AP abbreviates the long months and spells out March through July.
export const AP_MONTHS = [
    'Jan.',
    'Feb.',
    'March',
    'April',
    'May',
    'June',
    'July',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.',
];
// A plausible forecast for a northern temperate climate, seeded like the
// rest of the issue. Temperatures follow a seasonal curve with a little
// day-to-day noise, so consecutive days are similar and July is warm.
function weatherFor(date, rng) {
    const start = Date.UTC(date.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((toUtcDay(date) - start) / DAY_MS);
    const season = Math.sin(((dayOfYear - 105) / 365) * Math.PI * 2);
    const high = Math.round(58 + 26 * season + (rng() - 0.5) * 12);
    const low = Math.round(high - 13 - rng() * 7);
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const wind = dirs[Math.floor(rng() * dirs.length)];
    const speed = 3 + Math.floor(rng() * 12);
    // Clock time including daylight saving, so June sets at 8:30 and
    // December at 4:30, which is what a northern latitude actually sees.
    const sunsetHour =
        18.5 + 2 * Math.sin(((dayOfYear - 80) / 365) * Math.PI * 2);
    const h = Math.floor(sunsetHour);
    const m = String(Math.floor((sunsetHour - h) * 60)).padStart(2, '0');
    const sunset = `${h > 12 ? h - 12 : h}:${m} p.m.`;
    return `High ${high}°, low ${low}°. Winds ${wind} ${speed} mph. Sunset ${sunset}`;
}

export function toIssueParam(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

// The lead is a pure function of the issue number, so any issue can work
// out any other issue's lead without composing it. That is what lets today
// correct yesterday. A landmark issue (data/editions.js) has its lead
// written rather than dealt, and the chain runs through it the same way.
//
// Leads are dealt in rounds: the pool is shuffled once per round of
// its own length, seeded by the round, and issue n takes its place in
// the round. A lead therefore runs once per round and never twice
// inside one, which a draw from the whole pool every day could not
// promise — with forty-odd leads the same one came round within a
// fortnight often enough for the archive to show it.
//
// Each round is its own shuffle, so a round could open on the lead the
// last one closed on: No. 52 and No. 53 ran the same story. A lead from
// the last `seam` places of the round before is moved out of the first
// `seam` places of this one, so the same lead is always more than
// `seam` days apart. The tail of a round is never moved, which is what
// lets the previous round be read without fixing it first.
function shuffle(list, rng) {
    for (let i = list.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
}

function places(size) {
    return Array.from({ length: size }, (_, index) => index);
}

function shuffledRound(round, size) {
    return shuffle(places(size), createRng(round * 2654435761 + 1));
}

function roundOrder(round, size) {
    const order = shuffledRound(round, size);
    const seam = Math.min(14, Math.floor(size / 4));
    if (round === 0 || seam === 0) return order;
    const closing = new Set(shuffledRound(round - 1, size).slice(-seam));
    let spare = seam;
    for (let i = 0; i < seam; i += 1) {
        if (!closing.has(order[i])) continue;
        while (closing.has(order[spare])) spare += 1;
        [order[i], order[spare]] = [order[spare], order[i]];
        spare += 1;
    }
    return order;
}

export function selectLead(number) {
    const written = EDITIONS[number]?.lead;
    if (written) return written;
    if (!LEADS.length) return null;
    const round = Math.floor((number - 1) / LEADS.length);
    const place = (number - 1) % LEADS.length;
    return LEADS[roundOrder(round, LEADS.length)[place]] || null;
}

// The other sections are dealt in rounds too, so a classified a reader
// saw on Monday does not run again until most of its pool has. Each
// section is one stream through the rounds of its pool, `perIssue`
// places a day: issue n reads from place (n - 1) × perIssue on and takes
// as many as the day leaves room for. A place a short day does not take
// is skipped, and its item waits for the next round.
//
// A seam would keep an item out of the next round's first fortnight of
// places, which at four classifieds a day is three days. So a section's
// round is not a fresh shuffle of the pool. The pool is split once, by a
// shuffle of its own, into four quarters, and every round runs the
// quarters in the same order, each shuffled afresh. An item comes round
// in the same quarter every time, so it never runs again until three
// quarters of its pool have run. That also means a day straddling two
// rounds takes the last quarter of one and the first of the next, which
// share nothing, so no issue deals an item twice.
export const DEALS = {
    briefs: { pool: HEADLINES, perIssue: 6, salt: 1 },
    corrections: { pool: CORRECTIONS, perIssue: 3, salt: 2 },
    classifieds: { pool: CLASSIFIEDS, perIssue: 4, salt: 3 },
    letters: { pool: LETTERS, perIssue: 1, salt: 4 },
    weather: { pool: WEATHER, perIssue: 1, salt: 5 },
};

const QUARTERS = 4;

function quarteredRound(round, size, salt) {
    const split = shuffle(places(size), createRng(salt * 0x85ebca6b + 7));
    const rng = createRng(round * 2654435761 + 1 + salt * 0x85ebca6b);
    const order = [];
    for (let quarter = 0; quarter < QUARTERS; quarter += 1) {
        const from = Math.floor((quarter * size) / QUARTERS);
        const to = Math.floor(((quarter + 1) * size) / QUARTERS);
        order.push(...shuffle(split.slice(from, to), rng));
    }
    return order;
}

function dealFor(section, number, count = DEALS[section].perIssue) {
    const { pool, perIssue, salt } = DEALS[section];
    const items = [];
    let round = -1;
    let order = [];
    for (let offset = 0; offset < Math.min(count, perIssue); offset += 1) {
        const place = (number - 1) * perIssue + offset;
        if (Math.floor(place / pool.length) !== round) {
            round = Math.floor(place / pool.length);
            order = quarteredRound(round, pool.length, salt);
        }
        items.push(pool[order[place % pool.length]]);
    }
    return items;
}

// How the file cut stands for a lead: the pose it names, or the house
// pose if it names none the cut has.
export function poseOf(lead) {
    return POSES[lead?.pose] || POSES.explaining;
}

// The earliest issues are shorter. He had done less. The briefs column
// grows one item every six weeks or so until it reaches its full seven,
// and for the first two months the letters page carries one letter.
function briefsCount(number) {
    return Math.min(7, 3 + Math.floor((number - 1) / 45));
}
function lettersCount(number) {
    return number <= 60 ? 1 : 2;
}

export function composeIssue(date = new Date()) {
    const number = issueNumber(date);
    // The forecast's numbers are the one thing drawn fresh each day: they
    // follow the season, not a pool.
    const rng = createRng(number * 2654435761 + 1);

    const lead = selectLead(number);

    // The Gazette's first correction each day retracts a detail of
    // yesterday's lead — the real one, by name. It always concedes
    // something trivial and leaves the damning part standing. Issue 1 has
    // nothing to correct.
    const previousLead = number > 1 ? selectLead(number - 1) : null;
    const chainedCorrection = previousLead?.correction || null;

    const dateLabel = dateFormatter.format(date);

    // Yesterday's lead continues at the top of today's column: he has
    // done the next thing. With the correction beneath it, a reader
    // who comes back gets a story, not a reshuffle.
    const followUp = previousLead?.followUp || null;

    // What the calendar has for this date — the council's Tuesday, the
    // clocks, his birthday. Each runs first in its section and takes
    // the place of a dealt item, so every section keeps its size.
    const onCalendar = calendarItemsFor(date, {
        written: Boolean(EDITIONS[number]?.lead),
    });
    const dated = (section) => onCalendar[section] || [];
    // Deal the section's size, less the items already set for it, and
    // never fewer than zero.
    const dealAfter = (section, count, fixed) =>
        dealFor(section, number, Math.max(0, count - fixed.length));

    const letters = lettersCount(number);
    const fixedBriefs = [followUp, ...dated('briefs')].filter(Boolean);
    const fixedCorrections = [
        chainedCorrection,
        ...dated('corrections'),
    ].filter(Boolean);
    const fixedClassifieds = [lead?.classified, ...dated('classifieds')].filter(
        Boolean,
    );
    const fixedLetters = [lead?.letter, ...dated('letters')].filter(Boolean);
    const issue = {
        number,
        date,
        dateLabel,
        volume: volumeLabel(number),
        mastheadLine: `${dateLabel} · Vol. ${volumeLabel(number)}, No. ${number}`,
        issueParam: toIssueParam(date),
        lead,
        pose: poseOf(lead),
        editorial: null,
        tag: null,
        briefs: [
            ...fixedBriefs,
            ...dealAfter('briefs', briefsCount(number), fixedBriefs),
        ],
        // Yesterday's retraction first, then the rest.
        corrections: [
            ...fixedCorrections,
            ...dealAfter('corrections', 4, fixedCorrections),
        ],
        weatherNumbers: weatherFor(date, rng),
        weather: dealFor('weather', number)[0] || '',
        // The lead's own classified and letter run alongside it, so the
        // page compounds: the item, then the ad, then the person he did
        // it to. The rest are dealt from the general pools.
        classifieds: [
            ...fixedClassifieds,
            ...dealAfter('classifieds', 5, fixedClassifieds),
        ],
        letters: [
            ...fixedLetters,
            ...dealAfter('letters', letters, fixedLetters),
        ],
    };

    // A landmark's written sections replace the dealt ones. The lead was
    // already taken from it by selectLead.
    const { lead: _, ...written } = EDITIONS[number] || {};
    return Object.assign(issue, written);
}

// Most recent first, today included, with each issue's lead and its
// landmark tag if it has one. The lead is a pure function of the number,
// so listing the whole run costs nothing worth measuring. Used by the
// archive; `count` defaults to every issue there is.
export function recentIssues(
    count = Number.POSITIVE_INFINITY,
    from = new Date(),
) {
    const issues = [];
    for (let offset = 0; offset < count; offset += 1) {
        const date = new Date(
            from.getFullYear(),
            from.getMonth(),
            from.getDate() - offset,
        );
        const number = issueNumber(date);
        if (number < 1) break;
        issues.push({
            number,
            date,
            dateLabel: dateFormatter.format(date),
            issueParam: toIssueParam(date),
            lead: selectLead(number),
            tag: EDITIONS[number]?.tag || null,
        });
    }
    return issues;
}
