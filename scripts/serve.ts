#!/usr/bin/env bun
import { extname, join, normalize, resolve } from 'node:path';

/**
 * Static file server for local preview and the Playwright smoke suite.
 *
 * Bun takes each file's content type from its extension.
 */

const ROOT = resolve(import.meta.dirname ?? __dirname, '..');
const PORT = Number(process.env.PORT ?? 8001);

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

        // The edge serves /archive from archive.html; match it so the
        // extensionless links the pages use resolve locally too.
        let file = Bun.file(path);
        if (!(await file.exists()) && !extname(path)) {
            file = Bun.file(`${path}.html`);
        }
        if (!(await file.exists())) {
            return new Response('Not Found', { status: 404 });
        }
        return new Response(file, { headers: { 'cache-control': 'no-store' } });
    },
});

console.log(`serving ${ROOT} at http://127.0.0.1:${server.port}/`);
