/**
 * Canonical scene list for docs/assets.
 *
 * generate-scenes.ts and check-assets.ts previously each carried their own
 * copy of these numbers and disagreed: the generator was happy with a 8,000B
 * `card` while the checker demanded 25,000B, so `bun run assets:check` failed
 * on output the generator considered correct. Both now read this file.
 *
 * `minBytes` is a crude proxy for "the artwork actually rendered" — a scene
 * that collapses to flat colour compresses far smaller than one carrying the
 * masthead and headline. Values are set from real output with margin, so
 * regenerate and re-measure if source.svg changes substantially.
 */

export type SceneSpec = {
    width: number;
    height: number;
    /** Canvas colour behind the newsprint sheet. */
    bg: string;
    /** Fraction of the canvas the artwork should occupy. */
    scale: number;
    /** Centre the artwork rather than left-aligning it. */
    center?: boolean;
    minBytes: number;
};

/** source.svg's viewBox. Scene scaling is computed relative to this. */
export const SOURCE_WIDTH = 400;
export const SOURCE_HEIGHT = 200;

export const SCENES: Record<string, SceneSpec> = {
    badge: {
        width: 240,
        height: 96,
        bg: '#141a18',
        scale: 0.88,
        center: true,
        minBytes: 3_000,
    },
    blur: {
        width: 50,
        height: 28,
        bg: '#141a18',
        scale: 0.9,
        center: true,
        minBytes: 300,
    },
    card: {
        width: 400,
        height: 300,
        bg: '#1e2523',
        scale: 0.84,
        center: true,
        minBytes: 8_000,
    },
    circle: {
        width: 540,
        height: 540,
        bg: '#141a18',
        scale: 0.84,
        center: true,
        minBytes: 10_000,
    },
    dark: {
        width: 960,
        height: 540,
        bg: '#141a18',
        scale: 0.84,
        center: true,
        minBytes: 18_000,
    },
    demo: {
        width: 720,
        height: 405,
        bg: '#1e2523',
        scale: 0.86,
        center: true,
        minBytes: 14_000,
    },
    email: {
        width: 600,
        height: 200,
        bg: '#1e2523',
        scale: 0.88,
        center: true,
        minBytes: 9_000,
    },
    favicon: {
        width: 64,
        height: 64,
        bg: '#175049',
        scale: 0.95,
        center: true,
        minBytes: 600,
    },
    github: {
        width: 1280,
        height: 640,
        bg: '#141a18',
        scale: 0.82,
        center: true,
        minBytes: 22_000,
    },
    header: {
        width: 1920,
        height: 400,
        bg: '#141a18',
        scale: 0.8,
        center: true,
        minBytes: 18_000,
    },
    mastodon: {
        width: 1200,
        height: 600,
        bg: '#1e2523',
        scale: 0.84,
        center: true,
        minBytes: 22_000,
    },
    og: {
        width: 1200,
        height: 675,
        bg: '#141a18',
        scale: 0.84,
        center: true,
        minBytes: 22_000,
    },
    square: {
        width: 1080,
        height: 1080,
        bg: '#141a18',
        scale: 0.88,
        center: true,
        minBytes: 22_000,
    },
    touch: {
        width: 360,
        height: 360,
        bg: '#1e2523',
        scale: 0.92,
        center: true,
        minBytes: 7_000,
    },
    unfurl: {
        width: 1200,
        height: 628,
        bg: '#141a18',
        scale: 0.84,
        center: true,
        minBytes: 22_000,
    },
};
