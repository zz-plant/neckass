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

    function toIssueParam(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    }

    function composeIssue(date = new Date()) {
        const data = Neckass.data || {};
        const number = issueNumber(date);
        const rng = createRng(number * 2654435761);

        const leads = data.LEADS || [];
        const lead = leads.length
            ? leads[Math.floor(rng() * leads.length)]
            : null;

        // Briefs come from the headline catalogue, minus anything already
        // running as the lead in longer form.
        const briefPool = (data.HEADLINES || []).filter(
            (item) => !lead || item !== lead.headline,
        );

        return {
            number,
            date,
            dateLabel: dateFormatter.format(date),
            issueParam: toIssueParam(date),
            lead,
            briefs: deal(briefPool, 7, rng),
            corrections: deal(data.CORRECTIONS || [], 3, rng),
            weather: deal(data.WEATHER || [], 1, rng)[0] || '',
            classifieds: deal(data.CLASSIFIEDS || [], 5, rng),
            letters: deal(data.LETTERS || [], 2, rng),
            colophon: data.COLOPHON || null,
        };
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
        recentIssues,
        parseIssueDate,
        toIssueParam,
    };
})();
