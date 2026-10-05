/**
 * The paper knows what day it is. data/calendar.js lists what runs on
 * which days — the council's Tuesday, the clocks going back, his
 * birthday — and this works out which of those a given date is. Every
 * rule is a pure function of the date, like the rest of the issue, so
 * a back issue carries the holiday it was printed on.
 */

import { CALENDAR, FEUDS } from '../data/calendar.js';

const DAY_MS = 86400000;

// He was born on 11 March 1989. The paper has never printed the year,
// but it knows it, and the birthday brief does the arithmetic.
export const BIRTHDAY = { month: 3, day: 11, year: 1989 };
const FIRST_EDITION = { month: 9, day: 29, year: 2024 };

function nthWeekdayOfMonth(date) {
    return Math.floor((date.getDate() - 1) / 7) + 1;
}

function isLastWeekdayOfMonth(date) {
    const next = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 7,
    );
    return next.getMonth() !== date.getMonth();
}

function isLastDayOfMonth(date) {
    const next = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1,
    );
    return next.getMonth() !== date.getMonth();
}

// US rules: clocks go forward on the second Sunday in March and back on
// the first Sunday in November. Thanksgiving is the fourth Thursday in
// November; election day the Tuesday after the first Monday.
const SPECIALS = {
    dstStart: (d) =>
        d.getMonth() === 2 && d.getDay() === 0 && nthWeekdayOfMonth(d) === 2,
    dstEnd: (d) =>
        d.getMonth() === 10 && d.getDay() === 0 && nthWeekdayOfMonth(d) === 1,
    thanksgiving: (d) =>
        d.getMonth() === 10 && d.getDay() === 4 && nthWeekdayOfMonth(d) === 4,
    electionDay: (d) =>
        d.getMonth() === 10 &&
        d.getDay() === 2 &&
        d.getDate() >= 2 &&
        d.getDate() <= 8,
    lastDayOfMonth: isLastDayOfMonth,
    friday13: (d) => d.getDay() === 5 && d.getDate() === 13,
    leapDay: (d) => d.getMonth() === 1 && d.getDate() === 29,
    birthday: (d) =>
        d.getMonth() === BIRTHDAY.month - 1 && d.getDate() === BIRTHDAY.day,
    anniversary: (d) =>
        d.getMonth() === FIRST_EDITION.month - 1 &&
        d.getDate() === FIRST_EDITION.day &&
        d.getFullYear() > FIRST_EDITION.year,
};

export function matches(spec, date) {
    if (!spec) return false;
    // A serial does not run in issues that predate it.
    if (spec.from !== undefined) {
        const [year, month, day] = String(spec.from).split('-').map(Number);
        const begins = new Date(year, month - 1, day);
        const stamp = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
        );
        if (stamp.getTime() < begins.getTime()) return false;
    }
    if (spec.dayAfter) {
        return matches(spec.dayAfter, new Date(date.getTime() - DAY_MS));
    }
    if (spec.special) return Boolean(SPECIALS[spec.special]?.(date));
    if (spec.month !== undefined && date.getMonth() !== spec.month - 1) {
        return false;
    }
    if (spec.day !== undefined && date.getDate() !== spec.day) {
        return false;
    }
    if (spec.weekday !== undefined) {
        if (date.getDay() !== spec.weekday) return false;
        if (spec.nth && !spec.nth.includes(nthWeekdayOfMonth(date))) {
            return false;
        }
        if (spec.last && !isLastWeekdayOfMonth(date)) return false;
    }
    return true;
}

const WORDS = [
    'no',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
];

// The standing matters (FEUDS): each is a grudge with a start date, and
// its counters are computed from the issue's date, so a back issue
// carries the number as of that issue. `{id}.days` is always the days
// since; a `months` feud also fills `{id}.months`, and its `{id}.count`
// is the monthly filings to date, which holds because a monthly serial
// begins one month after its grudge; a `days` feud fills `{id}.count` as
// the days plus one, which for the paper's first edition is the issue
// number itself.
function feudFills(date) {
    const out = {};
    for (const [id, feud] of Object.entries(FEUDS)) {
        const [year, month, day] = String(feud.since).split('-').map(Number);
        const days = Math.floor(
            (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
                Date.UTC(year, month - 1, day)) /
                DAY_MS,
        );
        out[`${id}.days`] = days;
        if (feud.unit === 'months') {
            let months =
                (date.getFullYear() - year) * 12 +
                (date.getMonth() - (month - 1));
            if (date.getDate() < day) months -= 1;
            out[`${id}.months`] = months;
            out[`${id}.count`] = months;
        } else if (feud.unit === 'days') {
            out[`${id}.count`] = days + 1;
        }
    }
    return out;
}

// What the placeholders in an item resolve to on this date.
export function fills(date) {
    const year = date.getFullYear();
    const hadBirthday =
        date.getMonth() + 1 > BIRTHDAY.month ||
        (date.getMonth() + 1 === BIRTHDAY.month &&
            date.getDate() >= BIRTHDAY.day);
    const age = year - BIRTHDAY.year - (hadBirthday ? 0 : 1);
    return {
        age,
        ageLess2: age - 2,
        years: year - FIRST_EDITION.year,
        yearsWord:
            WORDS[year - FIRST_EDITION.year] ||
            String(year - FIRST_EDITION.year),
        year,
        lastYear: year - 1,
        ...feudFills(date),
    };
}

function fill(text, values) {
    return String(text).replace(/\{([\w.]+)\}/g, (match, key) =>
        key in values ? String(values[key]) : match,
    );
}

// Every item on the calendar for this date, grouped by the section it
// runs in. Letters are objects; everything else is a string. A rule
// marked `unlessWritten` stands down on a landmark issue, whose written
// lead already covers the day.
export function itemsFor(date, { written = false } = {}) {
    const values = fills(date);
    const out = {};
    for (const rule of CALENDAR) {
        if (written && rule.unlessWritten) continue;
        if (!matches(rule.on, date)) continue;
        const section = rule.section;
        const item =
            typeof rule.item === 'string'
                ? fill(rule.item, values)
                : {
                      body: fill(rule.item.body, values),
                      signature: fill(rule.item.signature, values),
                  };
        out[section] = out[section] || [];
        out[section].push(item);
    }
    return out;
}
