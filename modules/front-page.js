/**
 * The front page, in the browser.
 *
 * The edge prints the day's issue into the page as it serves it
 * (functions/_middleware.js), so in production this finds the issue
 * already printed and leaves it alone. Served from a static host, the
 * page carries the standing issue in its markup instead, and this prints
 * the issue the reader asked for over it, with the same renderer
 * (modules/render.js).
 */

import { issueForRequest } from './issue.js';
import { issueMetadata } from './issue-metadata.js';
import { issueParts } from './render.js';

function print(parts) {
    for (const { selector, html, text, attrs = {} } of parts) {
        for (const node of document.querySelectorAll(selector)) {
            if (html !== undefined) node.innerHTML = html;
            if (text !== undefined) node.textContent = text;
            for (const [name, value] of Object.entries(attrs)) {
                if (value === null) node.removeAttribute(name);
                else node.setAttribute(name, value);
            }
        }
    }
}

function writeMetadata(issue, dated) {
    const metadata = issueMetadata(issue, dated);
    document.title = metadata.title;
    const values = {
        description: metadata.description,
        'og:title': metadata.title,
        'twitter:title': metadata.title,
        'og:description': metadata.description,
        'twitter:description': metadata.description,
        'og:image': metadata.image,
        'og:image:secure_url': metadata.image,
        'twitter:image': metadata.image,
        'og:image:alt': metadata.alt,
        'twitter:image:alt': metadata.alt,
        'og:url': metadata.canonical,
        'twitter:url': metadata.canonical,
    };
    for (const meta of document.head.querySelectorAll('meta')) {
        const value = values[meta.getAttribute('property') || meta.name];
        if (value) meta.content = value;
    }
    document
        .querySelector('link[rel="canonical"]')
        ?.setAttribute('href', metadata.canonical);
    let schema = document.getElementById('issue-jsonld');
    if (!schema) {
        schema = document.createElement('script');
        schema.id = 'issue-jsonld';
        schema.type = 'application/ld+json';
        document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify(metadata.jsonLd);
}

function init() {
    const front = document.querySelector('.front-page');
    if (!front) return;

    const { issue, today, due, dated } = issueForRequest(
        new URLSearchParams(window.location.search).get('issue'),
    );
    // Only the edge marks the page with the issue it printed, and it
    // prints it for this request; the standing issue carries no mark.
    if (front.dataset.issue !== String(issue.number) && issue.lead) {
        print(issueParts(issue, { today, due }));
        writeMetadata(issue, dated);
    }
    window.Neckass = window.Neckass || {};
    window.Neckass.currentIssue = issue;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
    init();
}
