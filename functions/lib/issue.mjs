/**
 * The edge's side of the issue arithmetic: UTC dates, which are the only
 * clock a Worker has. The arithmetic itself — the epoch, the RNG, the
 * round dealing and the landmark lookup — is modules/issue.js, the same
 * file the browser runs, imported directly.
 */

import { dayIndex, poseOf, selectLead } from '../../modules/issue.js';

export function issueNumber(date) {
    return (
        dayIndex(
            Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
            ),
        ) + 1
    );
}

export function issueParam(date) {
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${date.getUTCFullYear()}-${month}-${day}`;
}

/** Parse ?issue=YYYY-MM-DD as a UTC date, or null. */
export function parseIssueDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
    if (!match) return null;
    const [, year, month, day] = match;
    const date = new Date(Date.UTC(+year, +month - 1, +day));
    if (Number.isNaN(date.getTime())) return null;
    if (date.getUTCMonth() !== +month - 1) return null;
    return date;
}

export { poseOf, selectLead };
