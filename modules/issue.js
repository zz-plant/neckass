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
    NOTICES,
    ROUTINE_CORRECTIONS,
    WEATHER,
} from '../data/formats.js';
import { HEADLINES } from '../data/headlines.js';
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

// Deal `count` items off a list without repeats inside one issue. Rotating
// the start by the seed as well as shuffling stops the same few entries
// from monopolising the short sections on consecutive days.
function deal(list, count, rng) {
    if (!Array.isArray(list) || !list.length) return [];
    const pool = list.slice();
    for (let i = pool.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, Math.min(count, pool.length));
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

// Wire-service dateline: "CORBIN FALLS, Sept. 5". AP abbreviates the
// long months and spells out March through July.
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
function datelineFor(date) {
    return `CORBIN FALLS, ${AP_MONTHS[date.getMonth()]} ${date.getDate()}`;
}

// A plausible forecast for a northern temperate town, seeded like the
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
    // December at 4:30, which is what a northern town actually sees.
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
function shuffledRound(round, size) {
    const rng = createRng(round * 2654435761 + 1);
    const order = Array.from({ length: size }, (_, index) => index);
    for (let i = order.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
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

// A brief is set as a sentence and a headline is not, so a brief ends
// on a period its headline lacks. They are compared without it.
function unpunctuated(text) {
    return String(text).replace(/\.("?)$/, '$1');
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
    // A stream of its own, so selectLead above stays reproducible in
    // isolation.
    const rng = createRng(number * 2654435761 + 1);

    const lead = selectLead(number);

    // The Gazette's first correction each day retracts a detail of
    // yesterday's lead — the real one, by name. It always concedes
    // something trivial and leaves the damning part standing. Issue 1 has
    // nothing to correct.
    const previousLead = number > 1 ? selectLead(number - 1) : null;
    const chainedCorrection = previousLead?.correction || null;

    // Briefs come from the headline catalogue, minus anything already
    // running as the lead in longer form.
    const briefPool = HEADLINES.filter(
        (item) => !lead || unpunctuated(item) !== unpunctuated(lead.headline),
    );

    const dateLabel = dateFormatter.format(date);
    const routineCorrection = deal(ROUTINE_CORRECTIONS, 1, rng)[0];

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
    // Deal `count` from `pool`, less the items already set for the
    // section, and never fewer than zero.
    const dealAfter = (pool, count, fixed, exclude = []) =>
        deal(
            pool.filter((item) => !exclude.includes(item)),
            Math.max(0, count - fixed.length),
            rng,
        );

    const letters = lettersCount(number);
    const fixedBriefs = [followUp, ...dated('briefs')].filter(Boolean);
    const fixedCorrections = [
        routineCorrection,
        chainedCorrection,
        ...dated('corrections'),
    ].filter(Boolean);
    const fixedNotices = dated('notices');
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
        dateline: datelineFor(date),
        issueParam: toIssueParam(date),
        lead,
        editorial: null,
        tag: null,
        briefs: [
            ...fixedBriefs,
            ...dealAfter(briefPool, briefsCount(number), fixedBriefs),
        ],
        // The dull one first, then yesterday's retraction, then the rest.
        corrections: [
            ...fixedCorrections,
            ...dealAfter(CORRECTIONS, 4, fixedCorrections),
        ],
        notices: [...fixedNotices, ...dealAfter(NOTICES, 3, fixedNotices)],
        weatherNumbers: weatherFor(date, rng),
        weather: deal(WEATHER, 1, rng)[0] || '',
        // The lead's own classified and letter run alongside it, so the
        // page compounds: the item, then the ad, then the person he did
        // it to. The rest are dealt from the general pools.
        classifieds: [
            ...fixedClassifieds,
            ...dealAfter(CLASSIFIEDS, 5, fixedClassifieds),
        ],
        letters: [
            ...fixedLetters,
            ...dealAfter(LETTERS, letters, fixedLetters),
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
