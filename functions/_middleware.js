/**
 * Per-issue social cards.
 *
 * The site is static, so every crawler fetching / gets byte-identical HTML and
 * every share of neckass.com previewed with the same generic text regardless
 * of the day's lead. This rewrites the title and description tags on the front
 * page to today's issue — or to ?issue=YYYY-MM-DD when the link carries one.
 *
 * og:image points at /card.png for the same issue, which draws the lead on
 * the sheet on request (functions/card.png.js), so the preview image carries
 * the headline too.
 */

import { composeIssue } from '../modules/issue.js';
import {
    issueNumber,
    issueParam,
    parseIssueDate,
    selectLead,
} from './lib/issue.mjs';

const SITE = 'https://neckass.com';
const CARD_TITLE_TAGS = new Set(['og:title', 'twitter:title']);
const CARD_TEXT_TAGS = new Set(['og:description', 'twitter:description']);
const CARD_IMAGE_TAGS = new Set([
    'og:image',
    'og:image:secure_url',
    'twitter:image',
]);
const CARD_ALT_TAGS = new Set(['og:image:alt', 'twitter:image:alt']);

class MetaRewriter {
    constructor({ title, description, image, alt }) {
        this.title = title;
        this.description = description;
        this.image = image;
        this.alt = alt;
    }

    element(element) {
        const key =
            element.getAttribute('property') || element.getAttribute('name');
        if (CARD_TITLE_TAGS.has(key))
            element.setAttribute('content', this.title);
        else if (CARD_TEXT_TAGS.has(key))
            element.setAttribute('content', this.description);
        else if (CARD_IMAGE_TAGS.has(key))
            element.setAttribute('content', this.image);
        else if (CARD_ALT_TAGS.has(key))
            element.setAttribute('content', this.alt);
    }
}

class TitleRewriter {
    constructor(title) {
        this.title = title;
    }

    element(element) {
        element.setInnerContent(this.title);
    }
}

const escapeHtml = (text) =>
    String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

// HTMLRewriter reads a handler's `text` property as a callback, so the
// string is kept under another name.
class TextRewriter {
    constructor(content) {
        this.content = content;
    }

    element(element) {
        element.setInnerContent(this.content);
    }
}

// The folio line in the same two spans front-page.js writes, so a phone
// breaks it at the middot here too and the script's swap changes nothing.
class MastheadRewriter {
    constructor(line) {
        this.line = line;
    }

    element(element) {
        const parts = this.line.split(' · ');
        if (parts.length !== 2) {
            element.setInnerContent(this.line);
            return;
        }
        element.setInnerContent(
            `<span>${escapeHtml(parts[0])}</span><span class="masthead__sep"> · </span><span>${escapeHtml(parts[1])}</span>`,
            { html: true },
        );
    }
}

class LeadLinkRewriter {
    constructor(headline, href) {
        this.headline = headline;
        this.href = href;
    }

    element(element) {
        element.setAttribute('href', this.href);
        element.setInnerContent(this.headline);
    }
}

export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);

    const isFrontPage = url.pathname === '/' || url.pathname === '/index.html';
    const response = await next();
    if (!isFrontPage) return response;
    if (!(response.headers.get('content-type') || '').includes('text/html')) {
        return response;
    }

    const date = parseIssueDate(url.searchParams.get('issue')) || new Date();
    const number = issueNumber(date);
    if (number < 1) return response;
    const lead = selectLead(number);
    if (!lead) return response;

    const title = `${lead.headline} | The Gazette, No. ${number}`;
    // The standing issue in the markup is a different day's paper, and its
    // folio line is one line where today's is two on a phone. Writing
    // today's masthead and lead here keeps front-page.js from moving the
    // page when it swaps in the same issue. A Worker's clock is UTC, so a
    // reader whose local date differs still gets their own day's swap.
    const issue = composeIssue(date);
    return new HTMLRewriter()
        .on('title', new TitleRewriter(title))
        .on('#masthead-date', new MastheadRewriter(issue.mastheadLine))
        .on(
            '#lead-link',
            new LeadLinkRewriter(lead.headline, `/?issue=${issueParam(date)}`),
        )
        .on('#lead-deck', new TextRewriter(lead.deck))
        .on('#lead-byline', new TextRewriter(lead.byline))
        .on(
            'meta',
            new MetaRewriter({
                title,
                description: lead.deck,
                image: `${SITE}/card.png?issue=${issueParam(date)}`,
                alt: `The front page of The Gazette, No. ${number}: ${lead.headline}`,
            }),
        )
        .transform(response);
}
