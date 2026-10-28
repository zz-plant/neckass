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
    // The standing issue is printed without the mark the edge leaves
    // (`data-issue`), which tells front-page.js the page already carries
    // the issue its request asked for. The standing issue was printed for
    // no request, so a static host's page is always printed over, even
    // when the link asks for No. 759 itself: that reader needs the
    // back-issue notice and the issue's own title and tags.
    const parts = issueParts(issue, { today: issue }).map((part) =>
        part.selector === '.front-page'
            ? { selector: part.selector, attrs: { 'data-issue': null } }
            : part,
    );
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
