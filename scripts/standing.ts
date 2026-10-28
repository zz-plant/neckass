#!/usr/bin/env bun
/**
 * standing.ts — prints the standing issue into index.html.
 *
 * The front page's markup carries a whole issue, so the page reads on a
 * static host and without JavaScript. It is printed here with the same
 * renderer and printer the edge uses (modules/render.js,
 * functions/lib/print.mjs), from a real issue, so it cannot drift from
 * the paper. Run `bun run standing` after changing the renderer, the page
 * or that issue's copy; `--check` exits 1 if index.html is out of date.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { printParts } from '../functions/lib/print.mjs';
import { composeIssue, parseIssueDate } from '../modules/issue.js';
import { issueParts } from '../modules/render.js';

/** No. 759, which led on “five minutes away”, as og-image.png does. */
export const STANDING_ISSUE = '2026-10-27';

const PAGE = join(import.meta.dirname ?? __dirname, '..', 'index.html');

export async function standingPage(html: string): Promise<string> {
    const issue = composeIssue(parseIssueDate(STANDING_ISSUE));
    const parts = issueParts(issue, { today: issue });
    return printParts(new HTMLRewriter(), parts)
        .transform(new Response(html))
        .text();
}

if (import.meta.main) {
    const current = readFileSync(PAGE, 'utf8');
    const printed = await standingPage(current);
    if (process.argv.includes('--check')) {
        if (printed !== current) {
            console.error(
                '❌ index.html’s standing issue is out of date — run `bun run standing`',
            );
            process.exit(1);
        }
        console.log('✅ standing issue is current');
    } else {
        writeFileSync(PAGE, printed);
        console.log(
            `✅ printed No. ${composeIssue(parseIssueDate(STANDING_ISSUE)).number} into index.html`,
        );
    }
}
