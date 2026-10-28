/**
 * The Worker: the router Cloudflare Pages used to build from functions/.
 *
 * Pages routed each file in functions/ by its name and ran _middleware.js
 * in front of every request. A Worker routes nothing on its own, so the
 * two routes are written out here and the handlers are imported unchanged,
 * called with the parts of the Pages context they use.
 *
 * Cloudflare serves a request that names a file without running the
 * Worker, except the paths in assets.run_worker_first (wrangler.jsonc):
 * the front page, which the middleware rewrites. Everything else that
 * reaches the Worker names no file: the card, the feed, and the paths that
 * get 404.html.
 */

import { onRequest as middleware } from './functions/_middleware.js';
import {
    onRequestGet as card,
    onRequestHead as cardHead,
} from './functions/card.png.js';
import { onRequestGet as feed } from './functions/feed.xml.js';

const ROUTES = new Map([
    ['/card.png', { GET: card, HEAD: cardHead }],
    ['/feed.xml', { GET: feed }],
]);

// Any case, one trailing slash or none, supporting GET and HEAD for dynamic routes
// so social card unfurlers and RSS readers checking headers receive 200 rather than 404.
// HEAD answers the cheap handler where one exists — the card, which would
// otherwise draw a PNG just to discard it — and the GET handler elsewhere.
function routeFor(request) {
    if (request.method !== 'GET' && request.method !== 'HEAD') return undefined;
    const path = new URL(request.url).pathname.toLowerCase();
    const route = ROUTES.get(path.length > 1 ? path.replace(/\/$/, '') : path);
    return route?.[request.method] || route?.GET;
}

// Workers send each file's ETag, and the middleware writes a different
// issue into the same index.html every day, so a revalidation against that
// ETag would be answered 304 for another day's paper. The Worker asks for
// files whole and sends no validator, as Pages did not on these responses.
//
// A path with no file got the nearest 404.html from Pages, with status 404
// and no-store. The site has one 404.html, at the root. Asked for with a
// method other than GET or HEAD, the 404 page answers 405, as every file
// does, and as Pages did for every path.
async function fetchAsset(request, env) {
    const headers = new Headers(request.headers);
    headers.delete('if-none-match');
    headers.delete('if-modified-since');
    let asset = await env.ASSETS.fetch(new Request(request, { headers }));
    let status = asset.status;
    if (status === 404) {
        const page = new URL('/404', request.url);
        asset = await env.ASSETS.fetch(
            new Request(page, { method: request.method, headers }),
        );
        status = asset.ok ? 404 : asset.status;
    }
    const response = new Response(asset.body, {
        status,
        headers: asset.headers,
    });
    response.headers.delete('etag');
    if (status === 404) response.headers.set('cache-control', 'no-store');
    return response;
}

export default {
    async fetch(request, env, ctx) {
        const route = routeFor(request);
        const next = async () => {
            if (route) {
                const response = await route({
                    request,
                    env,
                    waitUntil: (promise) => ctx.waitUntil(promise),
                });
                if (request.method === 'HEAD') {
                    return new Response(null, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers,
                    });
                }
                return response;
            }
            return fetchAsset(request, env);
        };
        return middleware({ request, env, next });
    },
};
