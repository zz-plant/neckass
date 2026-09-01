#!/usr/bin/env bun
/**
 * generate-og.ts — renders the per-page social preview cards.
 *
 * These are the images Facebook, X, LinkedIn, Slack and iMessage fetch when
 * someone shares a neckass.com link. They were previously SVG, which none of
 * those platforms render, so every preview came up blank.
 *
 * Output goes to the repo root so the URLs stay short and stable. Run with
 * `bun run og:generate`; needs rsvg-convert. Deterministic, so regenerating an
 * unchanged card produces byte-identical output.
 *
 * Only families every renderer resolves are used here — the site's self-hosted
 * Fraunces is not available to rsvg-convert.
 */

import { execSync } from 'node:child_process';
import { existsSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname ?? __dirname, '..');

/** Facebook/X/LinkedIn all treat 1200x630 as the canonical large-card size. */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
/** A card that renders correctly is comfortably above this. */
export const OG_MIN_BYTES = 25_000;

export type OgCard = {
    /** Output filename at the repo root. */
    file: string;
    /** Press-red kicker above the headline. */
    kicker: string;
    /** Headline, one array entry per rendered line. */
    headline: string[];
    /** Supporting line under the headline. */
    deck: string;
    /** Small caps footer. */
    footer: string;
};

export const OG_CARDS: OgCard[] = [
    {
        file: 'og-image.png',
        kicker: 'BREAKING',
        headline: ['Local man opens 19 tabs', 'to compare cereal prices'],
        deck: 'Shuffle fresh headlines, then copy and share in seconds.',
        footer: 'NECKASS.COM · SATIRE HEADLINE GENERATOR',
    },
    {
        file: 'og-about.png',
        kicker: 'ABOUT',
        headline: ['How Neckass writes', 'a headline'],
        deck: 'Runs in the browser, on your device, with no account.',
        footer: 'NECKASS.COM · ABOUT',
    },
    {
        file: 'og-examples.png',
        kicker: 'EXAMPLES',
        headline: ['Startup pivots to handwritten', 'push notifications'],
        deck: 'See the tone before you generate your own.',
        footer: 'NECKASS.COM · HEADLINE EXAMPLES',
    },
    {
        file: 'og-prompts.png',
        kicker: 'PROMPTS',
        headline: ['Starter ideas for world,', 'culture, tech and oddity'],
        deck: 'Pick a category, then shuffle.',
        footer: 'NECKASS.COM · PROMPT CATEGORIES',
    },
];

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = 'Helvetica, Arial, sans-serif';

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export function buildCard(card: OgCard): string {
    const kickerWidth = 26 + card.kicker.length * 13;
    const headline = card.headline
        .map(
            (line, i) =>
                `<text x="104" y="${330 + i * 66}" font-family="${SERIF}" font-size="56" font-weight="700" fill="#462c14">${escapeXml(line)}</text>`,
        )
        .join('\n  ');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}">
  <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="#18130f"/>
  <rect x="48" y="40" width="${OG_WIDTH - 96}" height="${OG_HEIGHT - 80}" rx="10" fill="#f1ede4"/>

  <text x="${OG_WIDTH / 2}" y="132" text-anchor="middle" font-family="${SERIF}" font-size="66" font-weight="700" fill="#241c14">Neckass</text>
  <text x="${OG_WIDTH / 2}" y="168" text-anchor="middle" font-family="${SANS}" font-size="17" font-weight="600" fill="#5a5044" letter-spacing="10">DIGITAL GAZETTE</text>

  <line x1="104" y1="200" x2="${OG_WIDTH - 104}" y2="200" stroke="#241c14" stroke-width="4"/>
  <line x1="104" y1="210" x2="${OG_WIDTH - 104}" y2="210" stroke="#241c14" stroke-width="1.4"/>

  <rect x="104" y="240" width="${kickerWidth}" height="34" fill="#b32b1c"/>
  <text x="${104 + kickerWidth / 2}" y="264" text-anchor="middle" font-family="${SANS}" font-size="17" font-weight="700" fill="#fbf9f5" letter-spacing="3">${escapeXml(card.kicker)}</text>

  ${headline}

  <text x="104" y="474" font-family="${SANS}" font-size="25" fill="#5a5044">${escapeXml(card.deck)}</text>

  <line x1="104" y1="520" x2="${OG_WIDTH - 104}" y2="520" stroke="#241c14" stroke-opacity="0.28" stroke-width="1.4"/>
  <text x="104" y="552" font-family="${SANS}" font-size="18" fill="#5a5044" letter-spacing="1.6">${escapeXml(card.footer)}</text>
</svg>`;
}

function main() {
    const dryRun = process.argv.includes('--dry-run');
    let ok = 0;
    const problems: string[] = [];

    for (const card of OG_CARDS) {
        const outPath = join(ROOT, card.file);
        if (dryRun) {
            console.log(`  [dry] ${card.file}: ${OG_WIDTH}×${OG_HEIGHT}`);
            continue;
        }

        const tmp = join(ROOT, `_${card.file}.svg`);
        try {
            writeFileSync(tmp, buildCard(card));
            execSync(
                `rsvg-convert -w ${OG_WIDTH} -h ${OG_HEIGHT} -o "${outPath}" "${tmp}"`,
                { stdio: 'pipe', timeout: 15000 },
            );
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
            const failure = e as { stderr?: string; message?: string };
            problems.push(`${card.file}: ${failure.stderr || failure.message}`);
        } finally {
            if (existsSync(tmp)) unlinkSync(tmp);
        }
    }

    console.log(`\n${dryRun ? 'DRY RUN ' : ''}✅ ${ok}  ❌ ${problems.length}`);
    if (problems.length > 0) {
        for (const p of problems) console.error(`  ❌ ${p}`);
        process.exit(1);
    }
}

if (import.meta.main) main();
