(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;

    // The Gazette first published on 2024-09-29. Every issue since is derived
    // from its own date and nothing else: no backend, no storage, no per-visit
    // randomness. Two people opening the site on the same day read the same
    // paper, which is the whole point of a paper.
    const FIRST_EDITION = Date.UTC(2024, 8, 29);
    const DAY_MS = 86400000;

    function toUtcDay(date) {
        return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function issueNumber(date) {
        return Math.floor((toUtcDay(date) - FIRST_EDITION) / DAY_MS) + 1;
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
    function parseIssueDate(value) {
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
    const AP_MONTHS = [
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

    function toIssueParam(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    }

    // The lead is a pure function of the issue number, so any issue can work
    // out any other issue's lead without composing it. That is what lets today
    // correct yesterday. A landmark issue (data/editions.js) has its lead
    // written rather than dealt, and the chain runs through it the same way.
    function selectLead(number, leads, editions = Neckass.data?.EDITIONS) {
        const written = editions?.[number]?.lead;
        if (written) return written;
        if (!Array.isArray(leads) || !leads.length) return null;
        const rng = createRng(number * 2654435761);
        return leads[Math.floor(rng() * leads.length)] || null;
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

    function composeIssue(date = new Date()) {
        const data = Neckass.data || {};
        const number = issueNumber(date);
        // A stream of its own, so selectLead above stays reproducible in
        // isolation.
        const rng = createRng(number * 2654435761 + 1);

        const leads = data.LEADS || [];
        const lead = selectLead(number, leads);

        // The Gazette's first correction each day retracts a detail of
        // yesterday's lead — the real one, by name. It always concedes
        // something trivial and leaves the damning part standing. Issue 1 has
        // nothing to correct.
        const previousLead = number > 1 ? selectLead(number - 1, leads) : null;
        const chainedCorrection = previousLead?.correction || null;

        // Briefs come from the headline catalogue, minus anything already
        // running as the lead in longer form.
        const briefPool = (data.HEADLINES || []).filter(
            (item) => !lead || item !== lead.headline,
        );

        const dateLabel = dateFormatter.format(date);
        const routineCorrection = deal(
            data.ROUTINE_CORRECTIONS || [],
            1,
            rng,
        )[0];

        // Yesterday's lead continues at the top of today's column: he has
        // done the next thing. With the correction beneath it, a reader
        // who comes back gets a story, not a reshuffle.
        const followUp = previousLead?.followUp || null;

        // What the calendar has for this date — the council's Tuesday, the
        // clocks, his birthday. Each runs first in its section and takes
        // the place of a dealt item, so every section keeps its size.
        const onCalendar =
            Neckass.calendar?.itemsFor(date, {
                written: Boolean(data.EDITIONS?.[number]?.lead),
            }) || {};
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
        const fixedClassifieds = [
            lead?.classified,
            ...dated('classifieds'),
        ].filter(Boolean);
        const fixedLetters = [lead?.letter, ...dated('letters')].filter(
            Boolean,
        );
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
                ...dealAfter(data.CORRECTIONS || [], 4, fixedCorrections),
            ],
            notices: [
                ...fixedNotices,
                ...dealAfter(data.NOTICES || [], 3, fixedNotices),
            ],
            weatherNumbers: weatherFor(date, rng),
            weather: deal(data.WEATHER || [], 1, rng)[0] || '',
            // The lead's own classified and letter run alongside it, so the
            // page compounds: the item, then the ad, then the person he did
            // it to. The rest are dealt from the general pools.
            classifieds: [
                ...fixedClassifieds,
                ...dealAfter(data.CLASSIFIEDS || [], 5, fixedClassifieds),
            ],
            letters: [
                ...fixedLetters,
                ...dealAfter(data.LETTERS || [], letters, fixedLetters),
            ],
            colophon: data.COLOPHON || null,
        };

        // A landmark's written sections replace the dealt ones. The lead was
        // already taken from it by selectLead.
        const { lead: _, ...written } = data.EDITIONS?.[number] || {};
        return Object.assign(issue, written);
    }

    // Most recent first, today included. Used by the archive.
    function recentIssues(count, from = new Date()) {
        const issues = [];
        for (let offset = 0; offset < count; offset += 1) {
            const date = new Date(
                from.getFullYear(),
                from.getMonth(),
                from.getDate() - offset,
            );
            if (issueNumber(date) < 1) break;
            issues.push({
                number: issueNumber(date),
                date,
                dateLabel: dateFormatter.format(date),
                issueParam: toIssueParam(date),
            });
        }
        return issues;
    }

    Neckass.issue = {
        FIRST_EDITION,
        composeIssue,
        issueNumber,
        selectLead,
        recentIssues,
        parseIssueDate,
        toIssueParam,
    };
})();
