#!/usr/bin/env bun
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { SCENES } from './asset-specs.ts';
import { OG_CARDS, OG_HEIGHT, OG_MIN_BYTES, OG_WIDTH } from './generate-og.ts';

const ASSETS_DIR = join(
    import.meta.dirname ?? __dirname,
    '..',
    'docs',
    'assets',
);
const PROJECT = basename(join(import.meta.dirname ?? __dirname, '..'));

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

const COLOR_TYPE_LABELS: Record<number, string> = {
    0: 'grayscale',
    2: 'RGB',
    3: 'indexed',
    4: 'grayscale+alpha',
    6: 'RGBA',
};

type PngInfo = {
    width: number;
    height: number;
    colorType: number;
    bitDepth: number;
};

function readPngInfo(filePath: string): PngInfo {
    const buf = readFileSync(filePath);
    if (buf.length < 33) throw new Error('file too small for valid PNG');
    if (!buf.subarray(0, 8).equals(PNG_SIGNATURE))
        throw new Error('not a valid PNG');
    return {
        width: buf.readUInt32BE(16),
        height: buf.readUInt32BE(20),
        bitDepth: buf.readUInt8(24),
        colorType: buf.readUInt8(25),
    };
}

function main() {
    const files = readdirSync(ASSETS_DIR).filter((f) => f.endsWith('.png'));
    if (files.length === 0) {
        console.error(`FAIL: no PNGs found in ${ASSETS_DIR}`);
        process.exit(1);
    }

    const errors: string[] = [];
    const seen = new Set<string>();

    console.log(`\n🔍 Checking «${PROJECT}» assets in ${ASSETS_DIR}\n`);

    for (const name of files.sort()) {
        const filePath = join(ASSETS_DIR, name);
        const scene = name
            .replace(/\.png$/, '')
            .replace(new RegExp(`^${PROJECT}-`), '');
        const spec = SCENES[scene];

        // The directory is meant to be exactly `bun run assets:generate`
        // output. Anything else drifted in by hand and will not survive a
        // regenerate, so treat it as a failure rather than silently skipping.
        if (!spec) {
            errors.push(
                `${name}: not a known scene — run \`bun run assets:generate\` or delete it`,
            );
            continue;
        }

        seen.add(scene);
        try {
            const info = readPngInfo(filePath);
            const size = statSync(filePath).size;

            if (info.width !== spec.width || info.height !== spec.height) {
                errors.push(
                    `${name}: expected ${spec.width}×${spec.height}, got ${info.width}×${info.height}`,
                );
                continue;
            }
            if (info.colorType === 3) {
                errors.push(`${name}: indexed colour (type 3) — posterized`);
                continue;
            }
            if (info.bitDepth < 8) {
                errors.push(`${name}: low bit depth (${info.bitDepth}-bit)`);
                continue;
            }
            if (size < spec.minBytes) {
                errors.push(
                    `${name}: ${size}B < ${spec.minBytes}B min — artwork probably did not render`,
                );
                continue;
            }

            const label =
                COLOR_TYPE_LABELS[info.colorType] ?? `type${info.colorType}`;
            console.log(
                `  ✅ ${name}  ${info.width}×${info.height}  ${size.toLocaleString()}B  ${label}`,
            );
        } catch (e: unknown) {
            errors.push(`${name}: ${(e as Error).message}`);
        }
    }

    const svgPath = join(ASSETS_DIR, 'source.svg');
    try {
        const svg = readFileSync(svgPath, 'utf8').trim();
        if (svg.startsWith('<svg') || svg.startsWith('<?xml')) {
            console.log(
                `  ✅ source.svg  (${statSync(svgPath).size.toLocaleString()}B)  design reference`,
            );
        } else {
            errors.push('source.svg: invalid SVG (missing <svg> root)');
        }
    } catch {
        errors.push('source.svg: missing — design source file required');
    }

    // Social preview cards live at the repo root because the platforms fetch
    // them by URL. They are checked here so one command covers every image the
    // project generates.
    for (const card of OG_CARDS) {
        const cardPath = join(ASSETS_DIR, '..', '..', card.file);
        try {
            const info = readPngInfo(cardPath);
            const size = statSync(cardPath).size;
            if (info.width !== OG_WIDTH || info.height !== OG_HEIGHT) {
                errors.push(
                    `${card.file}: expected ${OG_WIDTH}×${OG_HEIGHT}, got ${info.width}×${info.height}`,
                );
            } else if (size < OG_MIN_BYTES) {
                errors.push(
                    `${card.file}: ${size}B < ${OG_MIN_BYTES}B min — artwork probably did not render`,
                );
            } else {
                console.log(
                    `  ✅ ${card.file}  ${info.width}×${info.height}  ${size.toLocaleString()}B  social card`,
                );
            }
        } catch (e: unknown) {
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

    console.log(
        `\n${errors.length === 0 ? '✅ All assets valid' : '❌ FAILURES:'}  (${files.length} scene PNGs, ${OG_CARDS.length} social cards, 1 SVG checked)\n`,
    );

    if (errors.length > 0) {
        for (const err of errors) console.error(`  ❌ ${err}`);
        process.exit(1);
    }
}

main();
