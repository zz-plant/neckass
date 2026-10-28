/**
 * /card.png?issue=YYYY-MM-DD — the day's front page as a social card.
 *
 * Every share of neckass.com used to preview with the same still image
 * whatever the day's lead was. This draws the card on request: the lead of
 * the issue asked for (today's, if none is) beside the file cut of him,
 * posed as the front page poses it that day, set in Fraunces and the
 * wire's monospace on the same newsprint the page is printed on. The layout and the renderer are
 * functions/lib/card.mjs, which the still cards share.
 * The middleware points og:image here, so a shared link previews with the
 * headline that is actually running.
 *
 * Rendering is Satori and resvg; no browser. Both engines are WebAssembly,
 * imported here as compiled modules (wrangler compiles .wasm imports) and
 * initialized once per isolate by initCardRenderer. The two static cuts of
 * Fraunces and the monospace it needs are served from /fonts/ like the rest
 * of the site and fetched through the ASSETS binding once per isolate.
 */

import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm';
import yogaWasm from 'yoga-wasm-web/dist/yoga.wasm';
import {
    issueNumber,
    parseIssueDate,
    poseOf,
    pressDate,
    sceneOf,
    selectLead,
    toIssueParam,
} from '../modules/issue.js';
import {
    cardElement,
    HEIGHT,
    initCardRenderer,
    issueFolio,
    renderCardPng,
    WIDTH,
} from './lib/card.mjs';

const rendererReady = initCardRenderer({ yogaWasm, resvgWasm });

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
        fetchFont('/fonts/vera-sans-mono.ttf'),
    ])
        .then(([display, text, wire]) => [
            { name: 'Fraunces', data: display, weight: 700, style: 'normal' },
            { name: 'Fraunces Text', data: text, weight: 400, style: 'normal' },
            { name: 'Wire', data: wire, weight: 400, style: 'normal' },
        ])
        .catch((error) => {
            fontsPromise = null;
            throw error;
        });
    return fontsPromise;
}

export async function onRequestGet({ request, env, waitUntil }) {
    const url = new URL(request.url);
    const date = parseIssueDate(url.searchParams.get('issue')) || pressDate();
    const number = issueNumber(date);
    const lead = number >= 1 ? selectLead(number) : null;
    if (!lead) return new Response('No such issue', { status: 404 });

    // An issue's card is drawn once per data center and deploy. The first
    // fetch draws it and leaves it in the cache under the issue it resolved
    // to; the crawlers after it get the stored PNG. Drawing took about a
    // second, and every unfurler that fetched a shared link paid it again.
    // The deploy is in the key so an edit to the copy is drawn at once.
    const cache = globalThis.caches?.default;
    const version = env.CF_VERSION_METADATA?.id ?? '';
    const key = new Request(
        new URL(
            `/card.png?issue=${toIssueParam(date)}&v=${version}`,
            request.url,
        ),
    );
    const stored = await cache?.match(key);
    if (stored) return stored;

    await rendererReady;
    const fonts = await loadFonts(env, request);
    const card = {
        folio: issueFolio(date, number),
        headline: lead.headline,
        deck: lead.deck,
        pose: poseOf(lead),
        scene: sceneOf(lead),
    };
    const png = await renderCardPng(cardElement(card), {
        width: WIDTH,
        height: HEIGHT,
        fonts,
    });
    // The card for a given issue only changes when the copy does. A day is
    // long enough to absorb the crawlers and short enough to pick up an
    // edit.
    const response = new Response(png, {
        headers: {
            'content-type': 'image/png',
            'cache-control': 'public, max-age=86400',
        },
    });
    if (cache) waitUntil?.(cache.put(key, response.clone()));
    return response;
}

// A HEAD check answers the same status and headers a GET would, without
// rendering. The unfurlers that probe before fetching do not need the PNG,
// and drawing it only to discard it would pay a cold-start WASM init and a
// font fetch for nothing.
export function onRequestHead({ request }) {
    const url = new URL(request.url);
    const date = parseIssueDate(url.searchParams.get('issue')) || pressDate();
    const number = issueNumber(date);
    const lead = number >= 1 ? selectLead(number) : null;
    if (!lead) return new Response(null, { status: 404 });
    return new Response(null, {
        headers: {
            'content-type': 'image/png',
            'cache-control': 'public, max-age=86400',
        },
    });
}
