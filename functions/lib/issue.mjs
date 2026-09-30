/**
 * The issue arithmetic, for the Workers runtime.
 *
 * This mirrors the lead selection in modules/issue.js exactly — same epoch,
 * same mulberry32, same seed — so the feed and the social card name the same
 * lead the reader sees on the page. tests/smoke.spec.mjs asserts the two agree
 * for a spread of dates; change one and change the other.
 */

import LEADS, { EDITION_LEADS } from './leads.mjs';

export const FIRST_EDITION = Date.UTC(2024, 8, 29);
const DAY_MS = 86400000;

export function issueNumber(date) {
    const day = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
    );
    return Math.floor((day - FIRST_EDITION) / DAY_MS) + 1;
}

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

// Dealt in rounds of the pool's length, each round its own shuffle, with the
// seam between rounds kept clear of repeats; see modules/issue.js, which this
// must match.
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
    const written = EDITION_LEADS[number];
    if (written) return written;
    if (!LEADS.length) return null;
    const round = Math.floor((number - 1) / LEADS.length);
    const place = (number - 1) % LEADS.length;
    return LEADS[roundOrder(round, LEADS.length)[place]] || null;
}

export function issueParam(date) {
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${date.getUTCFullYear()}-${month}-${day}`;
}

/** Parse ?issue=YYYY-MM-DD, or null. */
export function parseIssueDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
    if (!match) return null;
    const [, year, month, day] = match;
    const date = new Date(Date.UTC(+year, +month - 1, +day));
    if (Number.isNaN(date.getTime())) return null;
    if (date.getUTCMonth() !== +month - 1) return null;
    return date;
}
