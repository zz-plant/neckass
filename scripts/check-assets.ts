#!/usr/bin/env bun
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { OG_CARDS, OG_HEIGHT, OG_MIN_BYTES, OG_WIDTH } from './generate-og.ts';

const ROOT = join(import.meta.dirname ?? __dirname, '..');

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

type Asset = {
    file: string;
    width: number;
    height: number;
    minBytes?: number;
    hint?: string;
};

const CARDS: Asset[] = OG_CARDS.map(({ file }) => ({
    file,
    width: OG_WIDTH,
    height: OG_HEIGHT,
    minBytes: OG_MIN_BYTES,
    hint: ' — run `bun run og:generate`',
}));

/** The icons the pages and the manifest name, at the sizes they claim. */
const ICONS: Asset[] = [
    { file: 'apple-touch-icon.png', width: 180, height: 180 },
    { file: 'icon-192.png', width: 192, height: 192 },
    { file: 'icon-512.png', width: 512, height: 512 },
];

function problemWith({ file, width, height, minBytes = 0, hint = '' }: Asset) {
    let buf: Buffer;
    try {
        buf = readFileSync(join(ROOT, file));
    } catch (e) {
        return `${(e as Error).message}${hint}`;
    }
    if (buf.length < 33) return `file too small for valid PNG${hint}`;
    if (!buf.subarray(0, 8).equals(PNG_SIGNATURE))
        return `not a valid PNG${hint}`;
    const [w, h] = [buf.readUInt32BE(16), buf.readUInt32BE(20)];
    if (w !== width || h !== height)
        return `expected ${width}×${height}, got ${w}×${h}`;
    if (buf.length < minBytes)
        return `${buf.length}B < ${minBytes}B min — artwork probably did not render`;
    return null;
}

// The PNGs the site serves are committed, so this can only fail when a
// file was edited by hand or a generation silently came out blank. It
// checks existence, dimensions and, for the cards, a minimum size —
// enough to catch both.
const errors = [...CARDS, ...ICONS].flatMap((asset) => {
    const problem = problemWith(asset);
    return problem ? [`${asset.file}: ${problem}`] : [];
});

if (errors.length > 0) {
    console.error('❌ FAILURES:');
    for (const err of errors) console.error(`  ❌ ${err}`);
    process.exit(1);
}
console.log(
    `✅ All assets valid  (${CARDS.length} social cards, ${ICONS.length} icons)`,
);
