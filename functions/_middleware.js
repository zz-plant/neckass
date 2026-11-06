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
import { issueMetadata, metaTags } from '../modules/issue-metadata.js';
import { issueParts } from '../modules/render.js';
import { printParts } from './lib/print.mjs';

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
    const tags = metaTags(metadata);
    const schema = JSON.stringify(metadata.jsonLd).replace(/</g, '\\u003c');
    const rewriter = new HTMLRewriter()
        .on('title', {
            element: (title) => title.setInnerContent(metadata.title),
        })
        .on('head', {
            element: (head) =>
                head.append(
                    `<script id="issue-jsonld" type="application/ld+json">${schema}</script>`,
                    { html: true },
                ),
        })
        .on('link[rel="canonical"]', {
            element: (link) => link.setAttribute('href', metadata.canonical),
        })
        .on('meta', {
            element(meta) {
                const key =
                    meta.getAttribute('property') || meta.getAttribute('name');
                if (tags[key]) meta.setAttribute('content', tags[key]);
            },
        });
    return printParts(rewriter, issueParts(issue, { today, due })).transform(
        response,
    );
}
