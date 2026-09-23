/**
 * /card.png?issue=YYYY-MM-DD — the day's front page as a social card.
 *
 * Every share of neckass.com used to preview with the same still image
 * whatever the day's lead was. This draws the card on request: the lead of
 * the issue asked for (today's, if none is) beside the file cut of him, set
 * in Fraunces on the same newsprint the page is printed on. The layout is
 * functions/lib/card.mjs, which the still cards share.
 * The middleware points og:image here, so a shared link previews with the
 * headline that is actually running.
 *
 * Rendering is Satori and resvg (via workers-og); no browser. The two static
 * cuts of Fraunces it needs are served from /fonts/ like the rest of the
 * site and fetched through the ASSETS binding once per isolate.
 */

import { ImageResponse } from 'workers-og';
import { cardElement, HEIGHT, issueFolio, WIDTH } from './lib/card.mjs';
import { issueNumber, parseIssueDate, selectLead } from './lib/issue.mjs';

let fontsPromise = null;
function loadFonts(env, request) {
    if (fontsPromise) return fontsPromise;
    const fetchFont = async (path) => {
        const url = new URL(path, request.url);
        const response = await env.ASSETS.fetch(url);
        if (!response.ok) throw new Error(`font not served: ${path}`);
        return response.arrayBuffer();
    };
    fontsPromise = Promise.all([
        fetchFont('/fonts/fraunces-72pt-bold.ttf'),
        fetchFont('/fonts/fraunces-9pt-regular.ttf'),
    ])
        .then(([display, text]) => [
            { name: 'Fraunces', data: display, weight: 700, style: 'normal' },
            { name: 'Fraunces Text', data: text, weight: 400, style: 'normal' },
        ])
        .catch((error) => {
            fontsPromise = null;
            throw error;
        });
    return fontsPromise;
}

export async function onRequestGet({ request, env }) {
    const url = new URL(request.url);
    const date = parseIssueDate(url.searchParams.get('issue')) || new Date();
    const number = issueNumber(date);
    const lead = number >= 1 ? selectLead(number) : null;
    if (!lead) return new Response('No such issue', { status: 404 });

    const fonts = await loadFonts(env, request);
    const card = {
        folio: issueFolio(date, number),
        headline: lead.headline,
        deck: lead.deck,
    };
    const image = new ImageResponse(cardElement(card), {
        width: WIDTH,
        height: HEIGHT,
        fonts,
    });
    // The card for a given issue only changes when the copy does. A day is
    // long enough to absorb the crawlers and short enough to pick up an
    // edit.
    image.headers.set('cache-control', 'public, max-age=86400');
    return image;
}
