#!/usr/bin/env bun
/**
 * generate-og.ts — renders the still social preview cards.
 *
 * These are the images Facebook, X, LinkedIn, Slack and iMessage fetch when
 * someone shares the entry, the back issues or the standards — and the
 * front page, wherever the edge is not there to draw the day's card. They
 * are drawn by the same layout as the per-issue card (functions/lib/card.mjs)
 * with the same renderer, Satori and resvg, in the site's own Fraunces, so a
 * shared link to any page previews as the same paper.
 *
 * Output goes to the repo root so the URLs stay short and stable. Run with
 * `bun run og:generate`. Deterministic, so regenerating an unchanged card
 * produces byte-identical output.
 */

import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { initWasm, Resvg } from '@resvg/resvg-wasm';
import satori from 'satori';
import { cardElement, HEIGHT, WIDTH } from '../functions/lib/card.mjs';

const ROOT = join(import.meta.dirname ?? __dirname, '..');

/** Facebook/X/LinkedIn all treat 1200x630 as the canonical large-card size. */
export const OG_WIDTH = WIDTH;
export const OG_HEIGHT = HEIGHT;
/** A card that renders correctly is comfortably above this. */
export const OG_MIN_BYTES = 25_000;

export type OgCard = {
    /** Output filename at the repo root. */
    file: string;
    /** Right of the nameplate: the page's name, where an issue has its date. */
    folio: string;
    /** The reason to click. */
    headline: string;
    /** The headline's second beat. */
    deck: string;
};

export const OG_CARDS: OgCard[] = [
    {
        // The standing issue in index.html, for wherever the edge is not
        // drawing today's card.
        file: 'og-image.png',
        folio: 'PUBLISHED DAILY',
        headline:
            'Neckass has been "five minutes away" since 2019. He is at home.',
        deck: 'He has said "five minutes" to eleven people this year. He has not left the house for any of them.',
    },
    {
        file: 'og-about.png',
        folio: 'REFERENCE',
        headline:
            "Neckass (slang): defined by a dictionary in 2032, accurately, to nobody's satisfaction",
        deck: 'A person may be foolish without being a neckass, and a neckass need not be especially foolish.',
    },
    {
        file: 'og-archive.png',
        folio: 'BACK ISSUES',
        headline:
            'Every issue since No. 1. None withdrawn. One corrected twice.',
        deck: 'The founding editorial gave the paper about a month. Each day is listed under the lead it ran.',
    },
    {
        file: 'og-prompts.png',
        folio: 'STANDARDS',
        headline:
            'The Gazette does not file stories where he turned out to be right. It has happened twice.',
        deck: 'The desk recognizes four kinds of neckassery. "Unprecedented" is used rarely. It has been used twice by mistake.',
    },
];

function fonts() {
    const font = (file: string) => readFileSync(join(ROOT, 'fonts', file));
    return [
        {
            name: 'Fraunces',
            data: font('fraunces-72pt-bold.ttf'),
            weight: 700 as const,
            style: 'normal' as const,
        },
        {
            name: 'Fraunces Text',
            data: font('fraunces-9pt-regular.ttf'),
            weight: 400 as const,
            style: 'normal' as const,
        },
    ];
}

export async function renderCard(card: OgCard): Promise<Uint8Array> {
    const svg = await satori(cardElement(card) as never, {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        fonts: fonts(),
    });
    return new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } })
        .render()
        .asPng();
}

async function main() {
    const dryRun = process.argv.includes('--dry-run');
    let ok = 0;
    const problems: string[] = [];

    const require = createRequire(import.meta.url);
    await initWasm(
        readFileSync(require.resolve('@resvg/resvg-wasm/index_bg.wasm')),
    );

    for (const card of OG_CARDS) {
        const outPath = join(ROOT, card.file);
        if (dryRun) {
            console.log(`  [dry] ${card.file}: ${OG_WIDTH}×${OG_HEIGHT}`);
            continue;
        }

        try {
            writeFileSync(outPath, await renderCard(card));
            const size = statSync(outPath).size;
            if (size < OG_MIN_BYTES) {
                problems.push(
                    `${card.file}: ${size}B < ${OG_MIN_BYTES}B — artwork probably did not render`,
                );
            } else {
                console.log(
                    `  ✅ ${card.file}  ${OG_WIDTH}×${OG_HEIGHT}  ${size.toLocaleString()}B`,
                );
                ok++;
            }
        } catch (e) {
            problems.push(`${card.file}: ${(e as Error).message}`);
        }
    }

    console.log(`\n${dryRun ? 'DRY RUN ' : ''}✅ ${ok}  ❌ ${problems.length}`);
    if (problems.length > 0) {
        for (const p of problems) console.error(`  ❌ ${p}`);
        process.exit(1);
    }
}

if (import.meta.main) await main();
