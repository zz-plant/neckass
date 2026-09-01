#!/usr/bin/env bun
import { join, normalize, resolve } from 'node:path';

/**
 * Static file server for local preview and the Playwright smoke suite.
 *
 * Replaces `python -m http.server`, which was the repo's only dependency on
 * Python and left content types to guesswork. Serving from Bun keeps the
 * toolchain to one runtime and sets explicit types for the ~25 deferred
 * scripts index.html loads.
 */

const ROOT = resolve(import.meta.dirname ?? __dirname, '..');
const PORT = Number(process.env.PORT ?? 8001);

const CONTENT_TYPES: Record<string, string> = {
    '.css': 'text/css; charset=utf-8',
    '.gif': 'image/gif',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.webp': 'image/webp',
    '.xml': 'application/xml; charset=utf-8',
};

function contentTypeFor(path: string): string | undefined {
    const dot = path.lastIndexOf('.');
    return dot === -1 ? undefined : CONTENT_TYPES[path.slice(dot)];
}

function resolveWithinRoot(pathname: string): string | null {
    let relative = decodeURIComponent(pathname);
    if (relative.endsWith('/')) relative += 'index.html';
    const candidate = resolve(join(ROOT, normalize(relative)));
    // normalize() collapses `..`, so anything landing outside ROOT is a traversal attempt
    return candidate === ROOT || candidate.startsWith(`${ROOT}/`)
        ? candidate
        : null;
}

const server = Bun.serve({
    port: PORT,
    idleTimeout: 30,
    async fetch(request) {
        const { pathname } = new URL(request.url);
        const path = resolveWithinRoot(pathname);
        if (!path) return new Response('Forbidden', { status: 403 });

        const file = Bun.file(path);
        if (!(await file.exists())) {
            return new Response('Not Found', { status: 404 });
        }

        const type = contentTypeFor(path);
        return new Response(file, {
            headers: {
                'cache-control': 'no-store',
                ...(type ? { 'content-type': type } : {}),
            },
        });
    },
});

console.log(`serving ${ROOT} at http://127.0.0.1:${server.port}/`);
