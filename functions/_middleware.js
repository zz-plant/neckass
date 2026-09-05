/**
 * Per-issue social cards.
 *
 * The site is static, so every crawler fetching / gets byte-identical HTML and
 * every share of neckass.com previewed with the same generic text regardless
 * of the day's lead. This rewrites the title and description tags on the front
 * page to today's issue — or to ?issue=YYYY-MM-DD when the link carries one.
 *
 * og:image is left alone. Rendering a card per issue needs an image encoder in
 * the Worker, which is a much heavier dependency than this is worth; the
 * branded still image plus a live headline is most of the value.
 */

import { issueNumber, parseIssueDate, selectLead } from './lib/issue.mjs';

const CARD_TITLE_TAGS = new Set(['og:title', 'twitter:title']);
const CARD_TEXT_TAGS = new Set(['og:description', 'twitter:description']);

class MetaRewriter {
    constructor(title, description) {
        this.title = title;
        this.description = description;
    }

    element(element) {
        const key =
            element.getAttribute('property') || element.getAttribute('name');
        if (CARD_TITLE_TAGS.has(key))
            element.setAttribute('content', this.title);
        else if (CARD_TEXT_TAGS.has(key))
            element.setAttribute('content', this.description);
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

    const title = `${lead.headline} | The Corbin Falls Gazette, No. ${number}`;
    return new HTMLRewriter()
        .on('title', new TitleRewriter(title))
        .on('meta', new MetaRewriter(title, lead.deck))
        .transform(response);
}
