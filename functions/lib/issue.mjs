/**
 * The issue arithmetic, for the Workers runtime.
 *
 * This mirrors the lead selection in modules/issue.js exactly — same epoch,
 * same mulberry32, same seed — so the feed and the social card name the same
 * lead the reader sees on the page. tests/smoke.spec.mjs asserts the two agree
 * for a spread of dates; change one and change the other.
 */

import LEADS from './leads.mjs';

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

export function selectLead(number) {
    if (!LEADS.length) return null;
    const rng = createRng(number * 2654435761);
    return LEADS[Math.floor(rng() * LEADS.length)] || null;
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
