/**
 * /feed.xml — the daily paper as RSS.
 *
 * Issues are derived from the date, so the feed is derived too: no store, no
 * cron, no build. Each item is one issue, titled with its lead. Dates are UTC,
 * which is the only clock a Worker has; a reader whose local date has not
 * turned over yet sees tomorrow's item appear a few hours early.
 */

import { issueNumber, issueParam, selectLead } from './lib/issue.mjs';

const SITE = 'https://neckass.com';
const ISSUES_IN_FEED = 30;

function escapeXml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export function buildFeed(now = new Date()) {
    const items = [];
    for (let offset = 0; offset < ISSUES_IN_FEED; offset += 1) {
        const date = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() - offset,
            ),
        );
        const number = issueNumber(date);
        if (number < 1) break;
        const lead = selectLead(number);
        if (!lead) continue;
        const link = `${SITE}/?issue=${issueParam(date)}`;
        items.push(
            [
                '        <item>',
                `            <title>${escapeXml(lead.headline)}</title>`,
                `            <link>${escapeXml(link)}</link>`,
                `            <guid isPermaLink="false">neckass-issue-${number}</guid>`,
                `            <pubDate>${date.toUTCString()}</pubDate>`,
                `            <description>${escapeXml(lead.deck)}</description>`,
                `            <category>No. ${number}</category>`,
                '        </item>',
            ].join('\n'),
        );
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>The Gazette</title>
        <link>${SITE}/</link>
        <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
        <description>The Gazette, published daily.</description>
        <language>en-us</language>
        <lastBuildDate>${now.toUTCString()}</lastBuildDate>
${items.join('\n')}
    </channel>
</rss>
`;
}

export const onRequestGet = () =>
    new Response(buildFeed(), {
        headers: {
            'content-type': 'application/rss+xml; charset=utf-8',
            // One hour: long enough to absorb a reader refreshing, short
            // enough that the day turns over promptly.
            'cache-control': 'public, max-age=3600',
        },
    });
