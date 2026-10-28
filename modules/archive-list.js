/**
 * The archive is not stored, it is derived: every past date composes its
 * own issue from the calendar, so the back catalogue is as long as the
 * paper is old and costs nothing to keep. It is read a month at a time
 * (/archive?month=YYYY-MM, this month by default), each issue with its
 * lead, under an index of every month in the run, so a reader can find
 * the fridge one without the page growing by an issue a day forever.
 */

import { AP_MONTHS, recentIssues, toIssueParam } from './issue.js';

const monthFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
});
const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
});

function issueLink(issue, isCurrent) {
    const link = document.createElement('a');
    link.href = isCurrent ? '/' : `/?issue=${issue.issueParam}`;
    return link;
}

function issueRow(issue, isCurrent) {
    const li = document.createElement('li');
    const link = issueLink(issue, isCurrent);
    const folio = document.createElement('span');
    folio.className = 'archive-folio';
    folio.textContent = `No. ${issue.number} · ${weekdayFormatter.format(issue.date)} ${issue.date.getDate()}`;
    const lead = document.createElement('span');
    lead.className = 'archive-lead';
    lead.textContent = issue.lead?.headline || '';
    link.append(folio, lead);
    li.append(link);
    const tag = isCurrent ? 'Current issue' : issue.tag;
    if (tag) {
        const note = document.createElement('span');
        note.className = isCurrent
            ? 'archive-tag archive-tag--current'
            : 'archive-tag';
        note.textContent = tag;
        li.append(note);
    }
    return li;
}

// The landmark editions first, on their own, then the run.
function landmarks(issues) {
    const list = document.querySelector('#archive-landmarks');
    if (!list) return;
    const written = issues.filter((issue) => issue.tag).reverse();
    if (!written.length) return;
    list.replaceChildren(
        ...written.map((issue) => {
            const li = document.createElement('li');
            const link = issueLink(issue, false);
            link.textContent = `No. ${issue.number}, ${issue.tag.toLowerCase()}`;
            li.append(link, ` — ${issue.dateLabel}.`);
            return li;
        }),
    );
    list.closest('section')?.removeAttribute('hidden');
}

const monthKey = (date) => toIssueParam(date).slice(0, 7);
const monthHref = (key) => `/archive?month=${key}`;

// The run is two years long and growing, so the months are indexed at
// the top: a line per year, newest first, each month a link to its page.
function monthIndex(months, shown) {
    const list = document.querySelector('#archive-months');
    if (!list) return;
    const years = new Map();
    for (const [, { issues }] of months) {
        const { date } = issues[0];
        const year = date.getFullYear();
        if (!years.has(year)) years.set(year, []);
        years.get(year).push(date);
    }
    list.replaceChildren(
        ...[...years].map(([year, dates]) => {
            const li = document.createElement('li');
            const label = document.createElement('span');
            label.className = 'archive-year';
            label.textContent = String(year);
            const links = document.createElement('span');
            links.className = 'archive-year__months';
            links.append(
                ...dates.map((date) => {
                    const link = document.createElement('a');
                    link.href = monthHref(monthKey(date));
                    link.textContent = AP_MONTHS[date.getMonth()];
                    if (monthKey(date) === shown) {
                        link.setAttribute('aria-current', 'page');
                    }
                    return link;
                }),
            );
            li.append(label, links);
            return li;
        }),
    );
    list.closest('nav')?.removeAttribute('hidden');
}

// The month before and after the one shown, so a reader can go on
// reading the run in either direction.
function monthSteps(months, shown) {
    const keys = [...months.keys()];
    const at = keys.indexOf(shown);
    const nav = document.createElement('nav');
    nav.className = 'archive-steps';
    nav.setAttribute('aria-label', 'Other months');
    for (const [key, label] of [
        [keys[at + 1], 'Earlier'],
        [keys[at - 1], 'Later'],
    ]) {
        if (!key) continue;
        const link = document.createElement('a');
        link.href = monthHref(key);
        link.rel = label === 'Earlier' ? 'prev' : 'next';
        link.textContent = `${label}: ${months.get(key).label}`;
        nav.append(link);
    }
    return nav;
}

function init() {
    const host = document.querySelector('#archive-run');
    if (!host) return;

    const issues = recentIssues();
    if (!issues.length) return;
    landmarks(issues);

    // Group by month, most recent first.
    const months = new Map();
    for (const issue of issues) {
        const key = monthKey(issue.date);
        if (!months.has(key)) {
            months.set(key, {
                label: monthFormatter.format(issue.date),
                issues: [],
            });
        }
        months.get(key).issues.push(issue);
    }

    // The month asked for, if the run has it; this month otherwise.
    const asked = new URLSearchParams(window.location.search).get('month');
    const shown = months.has(asked) ? asked : [...months.keys()][0];
    const { label, issues: list } = months.get(shown);

    monthIndex(months, shown);

    const section = document.createElement('section');
    section.className = 'archive-month';
    section.id = `month-${shown}`;
    const head = document.createElement('h2');
    head.className = 'section-label';
    head.textContent = label;
    const ul = document.createElement('ul');
    ul.className = 'archive-list';
    ul.append(...list.map((issue) => issueRow(issue, issue === issues[0])));
    section.append(head, ul, monthSteps(months, shown));
    host.replaceChildren(section);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
    init();
}
