/**
 * The front page, printed at the edge.
 *
 * The site is static, so every request for / would get the same standing
 * issue in the markup. This prints the day's issue into the page as it is
 * served (by the press clock, or ?issue=YYYY-MM-DD when the link carries
 * one): every section, from the renderer the browser uses
 * (modules/render.js), and the title, description and share tags.
 *
 * og:image points at /card.png for the same issue, which draws the lead on
 * the sheet on request (functions/card.png.js), so the preview image carries
 * the headline too.
 */

import { issueForRequest } from '../modules/issue.js';
import { issueMetadata } from '../modules/issue-metadata.js';
import { issueParts } from '../modules/render.js';
import { printParts } from './lib/print.mjs';

const CARD_TITLE_TAGS = new Set(['og:title', 'twitter:title']);
const CARD_TEXT_TAGS = new Set([
    'description',
    'og:description',
    'twitter:description',
]);
const CARD_IMAGE_TAGS = new Set([
    'og:image',
    'og:image:secure_url',
    'twitter:image',
]);
const CARD_ALT_TAGS = new Set(['og:image:alt', 'twitter:image:alt']);
const CARD_URL_TAGS = new Set(['og:url', 'twitter:url']);

class MetaRewriter {
    constructor({ title, description, image, alt, canonical }) {
        this.title = title;
        this.description = description;
        this.image = image;
        this.alt = alt;
        this.canonical = canonical;
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
        else if (CARD_URL_TAGS.has(key))
            element.setAttribute('content', this.canonical);
    }
}

class CanonicalRewriter {
    constructor(url) {
        this.url = url;
    }
    element(element) {
        element.setAttribute('href', this.url);
    }
}

class ArticleWriter {
    constructor(schema) {
        this.schema = JSON.stringify(schema).replace(/</g, '\\u003c');
    }
    element(element) {
        element.append(
            `<script id="issue-jsonld" type="application/ld+json">${this.schema}</script>`,
            { html: true },
        );
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

    const { issue, today, due, dated } = issueForRequest(
        url.searchParams.get('issue'),
    );
    if (issue.number < 1 || !issue.lead) return response;

    // The whole issue is printed into the page here, from the renderer the
    // browser uses, so the reader, the crawler and the reader without
    // JavaScript all get the day's paper, and front-page.js, finding the
    // issue already printed, leaves it alone.
    const metadata = issueMetadata(issue, dated);
    const rewriter = new HTMLRewriter()
        .on('title', new TitleRewriter(metadata.title))
        .on('head', new ArticleWriter(metadata.jsonLd))
        .on('link[rel="canonical"]', new CanonicalRewriter(metadata.canonical))
        .on('meta', new MetaRewriter(metadata));
    return printParts(rewriter, issueParts(issue, { today, due })).transform(
        response,
    );
}
