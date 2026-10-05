#!/usr/bin/env bun
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { SCENES } from './asset-specs.ts';
import { OG_CARDS, OG_HEIGHT, OG_MIN_BYTES, OG_WIDTH } from './generate-og.ts';

const ASSETS_DIR = join(
    import.meta.dirname ?? __dirname,
    '..',
    'docs',
    'assets',
);
/** The generated PNGs in docs/assets are prefixed with the project name. */
const PREFIX = 'neckass-';

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

// The generated images are deterministic and committed, so this can only
// fail when a file was edited by hand or a generation silently came out
// blank. It checks existence, dimensions and a minimum size — enough to
// catch both.
function main() {
    const files = readdirSync(ASSETS_DIR).filter((f) => f.endsWith('.png'));
    if (files.length === 0) {
        console.error(`FAIL: no PNGs found in ${ASSETS_DIR}`);
        process.exit(1);
    }

    const errors: string[] = [];
    const seen = new Set<string>();

    for (const name of files.sort()) {
        const scene = name
            .replace(/\.png$/, '')
            .replace(new RegExp(`^${PREFIX}`), '');
        const spec = SCENES[scene];

        if (!spec) {
            errors.push(
                `${name}: not a known scene — run \`bun run assets:generate\` or delete it`,
            );
            continue;
        }
        seen.add(scene);

        try {
            const { width, height } = readPngSize(join(ASSETS_DIR, name));
            const size = statSync(join(ASSETS_DIR, name)).size;
            if (width !== spec.width || height !== spec.height) {
                errors.push(
                    `${name}: expected ${spec.width}×${spec.height}, got ${width}×${height}`,
                );
            } else if (size < spec.minBytes) {
                errors.push(
                    `${name}: ${size}B < ${spec.minBytes}B min — artwork probably did not render`,
                );
            }
        } catch (e) {
            errors.push(`${name}: ${(e as Error).message}`);
        }
    }

    // Social preview cards live at the repo root because the platforms
    // fetch them by URL.
    for (const card of OG_CARDS) {
        const cardPath = join(ASSETS_DIR, '..', '..', card.file);
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

    const missing = Object.keys(SCENES).filter((s) => !seen.has(s));
    if (missing.length > 0) {
        errors.push(
            `missing scenes: ${missing.join(', ')} — run \`bun run assets:generate\``,
        );
    }

    if (errors.length > 0) {
        console.error('❌ FAILURES:');
        for (const err of errors) console.error(`  ❌ ${err}`);
        process.exit(1);
    }
    console.log(
        `✅ All assets valid  (${files.length} scene PNGs, ${OG_CARDS.length} social cards)`,
    );
}

main();
