#!/usr/bin/env bun
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { OG_CARDS, OG_HEIGHT, OG_MIN_BYTES, OG_WIDTH } from './generate-og.ts';

const ROOT = join(import.meta.dirname ?? __dirname, '..');

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

type PngInfo = { width: number; height: number };

function readPngSize(filePath: string): PngInfo {
    const buf = readFileSync(filePath);
    if (buf.length < 33) throw new Error('file too small for valid PNG');
    if (!buf.subarray(0, 8).equals(PNG_SIGNATURE))
        throw new Error('not a valid PNG');
    return {
        width: buf.readUInt32BE(16),
        height: buf.readUInt32BE(20),
    };
}

/** The icons the pages and the manifest name, at the sizes they claim. */
const ICONS = [
    { file: 'apple-touch-icon.png', size: 180 },
    { file: 'icon-192.png', size: 192 },
    { file: 'icon-512.png', size: 512 },
];

// The PNGs the site serves are committed, so this can only fail when a
// file was edited by hand or a generation silently came out blank. It
// checks existence, dimensions and, for the cards, a minimum size —
// enough to catch both.
function main() {
    const errors: string[] = [];

    // Social preview cards live at the repo root because the platforms
    // fetch them by URL.
    for (const card of OG_CARDS) {
        const cardPath = join(ROOT, card.file);
        try {
            const { width, height } = readPngSize(cardPath);
            const size = statSync(cardPath).size;
            if (width !== OG_WIDTH || height !== OG_HEIGHT) {
                errors.push(
                    `${card.file}: expected ${OG_WIDTH}×${OG_HEIGHT}, got ${width}×${height}`,
                );
            } else if (size < OG_MIN_BYTES) {
                errors.push(
                    `${card.file}: ${size}B < ${OG_MIN_BYTES}B min — artwork probably did not render`,
                );
            }
        } catch (e) {
            errors.push(
                `${card.file}: ${(e as Error).message} — run \`bun run og:generate\``,
            );
        }
    }

    for (const icon of ICONS) {
        try {
            const { width, height } = readPngSize(join(ROOT, icon.file));
            if (width !== icon.size || height !== icon.size) {
                errors.push(
                    `${icon.file}: expected ${icon.size}×${icon.size}, got ${width}×${height}`,
                );
            }
        } catch (e) {
            errors.push(`${icon.file}: ${(e as Error).message}`);
        }
    }

    if (errors.length > 0) {
        console.error('❌ FAILURES:');
        for (const err of errors) console.error(`  ❌ ${err}`);
        process.exit(1);
    }
    console.log(
        `✅ All assets valid  (${OG_CARDS.length} social cards, ${ICONS.length} icons)`,
    );
}

main();
