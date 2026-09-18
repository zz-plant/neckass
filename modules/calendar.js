(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;

    // The paper knows what day it is. data/calendar.js lists what runs on
    // which days — the council's Tuesday, the clocks going back, his
    // birthday — and this works out which of those a given date is. Every
    // rule is a pure function of the date, like the rest of the issue, so
    // a back issue carries the holiday it was printed on.

    const DAY_MS = 86400000;

    // He was born on 11 March 1989. The paper has never printed the year,
    // but it knows it, and the birthday brief does the arithmetic.
    const BIRTHDAY = { month: 3, day: 11, year: 1989 };
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
            d.getMonth() === 2 &&
            d.getDay() === 0 &&
            nthWeekdayOfMonth(d) === 2,
        dstEnd: (d) =>
            d.getMonth() === 10 &&
            d.getDay() === 0 &&
            nthWeekdayOfMonth(d) === 1,
        thanksgiving: (d) =>
            d.getMonth() === 10 &&
            d.getDay() === 4 &&
            nthWeekdayOfMonth(d) === 4,
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

    function matches(spec, date) {
        if (!spec) return false;
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

    // What the placeholders in an item resolve to on this date.
    function fills(date) {
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
        };
    }

    function fill(text, values) {
        return String(text).replace(/\{(\w+)\}/g, (match, key) =>
            key in values ? String(values[key]) : match,
        );
    }

    // Every item on the calendar for this date, grouped by the section it
    // runs in. Letters are objects; everything else is a string. A rule
    // marked `unlessWritten` stands down on a landmark issue, whose written
    // lead already covers the day.
    function itemsFor(date, { written = false } = {}) {
        const rules = Neckass.data?.CALENDAR || [];
        const values = fills(date);
        const out = {};
        for (const rule of rules) {
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

    Neckass.calendar = { itemsFor, matches, fills, BIRTHDAY };
})();
