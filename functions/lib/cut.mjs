/**
 * The file cut, flattened for the social card, in any pose.
 *
 * assets/cuts/neckass.svg is a rig: its joints turn on CSS custom
 * properties, and its ink follows the colour scheme. Satori and resvg read
 * neither, so this is the same drawing with each joint's rotation written
 * as an attribute, from a pose in data/poses.js, and the ink and paper
 * written in. The parts and the pivots are the rig's; a smoke test holds
 * the three copies of the drawing (the file, the front page's, this one)
 * to the same parts.
 *
 * As an image the cut is clipped to its box, so the box is the rig's with
 * room on each side a pose throws a limb into (PAD): the shrug's hand to
 * the left, the pointing arm to the right, the wave over the top.
 */

const INK = '#1c1a19';
const PAPER = '#efeae0';
const PART = `fill="${PAPER}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
const SOLID = `fill="${INK}"`;
const DETAIL = `fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"`;
const HATCH = `fill="none" stroke="${INK}" stroke-width="1.4" stroke-linecap="round" opacity="0.7"`;

/** Each joint's pivot, in the rig's coordinates. */
export const JOINT_ORIGINS = {
    tilt: [100, 66],
    armNear: [70, 80],
    forearmNear: [70, 124],
    armFar: [130, 80],
    forearmFar: [130, 124],
    legNear: [88, 156],
    legFar: [112, 156],
};

/** The rig's own box. */
export const CUT_WIDTH = 182;
export const CUT_HEIGHT = 278;
/** The room around it that the widest poses reach into. */
export const PAD = { top: 30, right: 32, bottom: 0, left: 36 };

// The scene's props (data/scenes.js), the rig's layers drawn only when the
// lead names them. Scenery is in the box's own coordinates and goes behind
// him, in the rig's order; the held props go in the joint that holds them,
// where the rig has them: the phone and the cup before the hand that
// grips them, the hat after the hair.
const SCENERY = {
    doorway: [
        `<path ${PART} d="M146 -2 l48 14 v248 l-48 11 z" />`,
        `<circle ${PART} cx="154" cy="140" r="3.5" />`,
        `<path ${HATCH} d="M156 20 v226 M170 24 v220 M184 28 v214" />`,
        `<path ${PART} d="M4 0 h12 v271 h-12 z" />`,
        `<path ${PART} d="M134 0 h12 v271 h-12 z" />`,
        `<path ${PART} d="M-2 -12 h154 v12 h-154 z" />`,
    ],
    couch: [
        `<path ${PART} d="M-26 182 q0 -10 10 -10 h108 q10 0 10 10 v34 h-128 z" />`,
        `<path ${DETAIL} d="M14 176 v38 M54 176 v38" />`,
        `<path ${PART} d="M-28 214 h132 v26 h-132 z" />`,
        `<path ${PART} d="M-36 200 q0 -10 10 -10 h6 q10 0 10 10 v46 h-26 z" />`,
        `<path ${PART} d="M96 200 q0 -10 10 -10 h6 q10 0 10 10 v46 h-26 z" />`,
        `<path ${DETAIL} d="M-30 246 v8 M116 246 v8" />`,
        `<path ${HATCH} d="M-20 236 h112" />`,
    ],
    fridge: [
        `<path ${PART} d="M124 92 h70 v179 h-70 z" />`,
        `<path ${DETAIL} d="M124 140 h70" />`,
        `<path ${DETAIL} d="M130 176 h58 M130 212 h58 M130 246 h58" />`,
        `<path ${PART} d="M136 160 h12 v16 h-12 z" />`,
        `<path ${PART} d="M168 196 h10 v16 h-10 z" />`,
        `<path ${HATCH} d="M160 146 l-14 18 M168 146 v20 M176 146 l14 18" />`,
        `<path ${PART} d="M194 140 l20 -6 v138 l-20 -1 z" />`,
        `<path ${PART} d="M194 92 l20 6 v34 l-20 6 z" />`,
    ],
    tv: [
        `<path ${PART} d="M128 238 h84 v33 h-84 z" />`,
        `<path ${DETAIL} d="M170 242 v25" />`,
        `<path ${SOLID} d="M164 252 h3 v4 h-3 z M173 252 h3 v4 h-3 z" />`,
        `<path ${PART} d="M166 228 h8 v10 h-8 z" />`,
        `<path ${PART} d="M132 176 h76 v54 h-76 z" />`,
        `<path ${DETAIL} d="M138 182 h64 v42 h-64 z" />`,
        `<path ${HATCH} d="M146 190 l12 -6 M146 200 l26 -14 M150 212 l40 -22" />`,
    ],
    desk: [
        `<path ${PART} d="M124 204 h8 v67 h-8 z" />`,
        `<path ${PART} d="M204 204 h8 v67 h-8 z" />`,
        `<path ${PART} d="M118 196 h96 v8 h-96 z" />`,
        `<path ${PART} d="M160 188 h30 v8 h-30 z" />`,
        `<path ${PART} d="M171 180 h8 v10 h-8 z" />`,
        `<path ${PART} d="M146 138 h58 v44 h-58 z" />`,
        `<path ${DETAIL} d="M152 144 h46 v32 h-46 z" />`,
        `<path ${HATCH} d="M158 152 h20 M158 160 h30 M158 168 h14" />`,
    ],
    table: [
        `<path ${PART} d="M148 262 h40 v9 h-40 z" />`,
        `<path ${PART} d="M164 214 h8 v50 h-8 z" />`,
        `<path ${PART} d="M118 206 h96 v8 h-96 z" />`,
        `<path ${PART} d="M134 206 q14 -7 28 0 z" />`,
        `<path ${PART} d="M188 178 h14 l-2 28 h-10 z" />`,
        `<path ${HATCH} d="M191 190 h8" />`,
    ],
    easel: [
        `<path ${PART} d="M140 170 h7 l-10 101 h-7 z" />`,
        `<path ${PART} d="M186 170 h7 l10 101 h-7 z" />`,
        `<path ${DETAIL} d="M166 176 v86" />`,
        `<path ${PART} d="M128 70 h76 v104 h-76 z" />`,
        `<path ${PART} d="M124 62 h84 v9 h-84 z" />`,
        `<path ${DETAIL} d="M140 96 h26 M140 112 h18 M140 128 h34" />`,
    ],
    signpost: [
        `<path ${PART} d="M166 96 h8 v175 h-8 z" />`,
        `<path ${PART} d="M206 108 h-62 l-12 12 l12 12 h62 z" />`,
        `<path ${PART} d="M134 144 h62 l12 12 l-12 12 h-62 z" />`,
        `<path ${HATCH} d="M152 120 h40 M144 156 h40" />`,
    ],
    shelf: [
        `<path ${PART} d="M130 58 l6 -2 v14 l-6 2 z" />`,
        `<path ${PART} d="M124 72 l86 -10 v7 l-86 10 z" />`,
        `<path ${PART} d="M150 42 l10 -1 l3 26 l-10 1 z" />`,
        `<path ${PART} d="M163 44 l9 -1 l2 22 l-9 1 z" />`,
        `<path ${PART} d="M178 46 l18 6 l-2 8 l-18 -6 z" />`,
        `<path ${DETAIL} d="M150 268 l6 2 M168 262 l5 4 M188 268 l7 -1 M200 260 l4 5" />`,
    ],
    clock: [
        `<circle ${PART} cx="168" cy="44" r="24" />`,
        `<path ${DETAIL} d="M168 24 v4 M168 60 v4 M148 44 h4 M184 44 h4" />`,
        `<path ${DETAIL} d="M168 44 v16 M168 44 l11 4" />`,
        `<circle ${SOLID} cx="168" cy="44" r="2.5" />`,
    ],
    alarm: [
        `<path ${PART} d="M132 226 h72 v45 h-72 z" />`,
        `<path ${DETAIL} d="M138 244 h60" />`,
        `<circle ${SOLID} cx="168" cy="236" r="2.2" />`,
        `<path ${DETAIL} d="M154 224 l-4 -8 M182 224 l4 -8" />`,
        `<circle ${PART} cx="156" cy="194" r="6" />`,
        `<circle ${PART} cx="180" cy="194" r="6" />`,
        `<circle ${PART} cx="168" cy="208" r="15" />`,
        `<path ${DETAIL} d="M168 208 v-9 M168 208 l7 3" />`,
        `<path ${DETAIL} d="M144 186 q-6 6 -2 14 M192 186 q6 6 2 14" />`,
    ],
    parcel: [
        `<path ${PART} d="M140 228 h56 v43 h-56 z" />`,
        `<path ${PART} d="M140 228 l10 -12 h56 l-10 12 z" />`,
        `<path ${PART} d="M196 228 l10 -12 v43 l-10 12 z" />`,
        `<path ${DETAIL} d="M168 228 v43 M158 216 l-10 12" />`,
    ],
    shoe: [
        `<path ${PART} d="M150 271 v-12 q0 -6 6 -6 h14 l10 7 q14 3 16 9 v2 z" />`,
        `<path ${DETAIL} d="M162 258 l6 4 M168 256 l5 4" />`,
        `<path ${HATCH} d="M138 271 h-8 M206 271 h8 M144 262 l-6 -4 M202 262 l6 -4" />`,
    ],
    rain: [
        `<path ${HATCH} d="M-24 26 l-6 14 M2 52 l-6 14 M-18 92 l-6 14 M8 132 l-6 14 M-26 172 l-6 14 M4 212 l-6 14 M-14 246 l-6 14 M130 30 l-6 14 M156 64 l-6 14 M186 40 l-6 14 M138 104 l-6 14 M172 128 l-6 14 M200 98 l-6 14 M150 168 l-6 14 M190 190 l-6 14 M132 224 l-6 14 M170 240 l-6 14 M204 248 l-6 14 M26 20 l-6 14 M120 70 l-6 14 M24 160 l-6 14 M126 150 l-6 14 M20 238 l-6 14 M118 196 l-6 14" />`,
        `<path ${PART} d="M122 18 q-12 0 -12 -10 q0 -9 10 -10 q1 -12 14 -12 q12 0 15 10 q3 -3 9 -3 q12 0 12 12 q9 1 9 7 q0 6 -9 6 z" />`,
    ],
    shower: [
        `<path ${DETAIL} d="M126 -30 v13 q0 8 -8 8 h-30" />`,
        `<path ${PART} d="M62 -14 h28 l8 10 h-44 z" />`,
        `<path ${HATCH} d="M56 2 l-8 18 M50 26 l-8 18 M42 50 l-8 18 M36 76 l-8 18 M30 102 l-8 18 M14 60 l-8 18 M8 92 l-8 18 M2 124 l-8 18 M96 2 l8 18 M102 26 l8 18 M110 50 l8 18 M118 76 l8 18 M124 102 l8 18 M130 128 l8 18 M136 154 l8 18 M146 70 l8 18 M152 104 l8 18" />`,
    ],
    smoke: [
        `<path ${DETAIL} d="M-36 -26 h250" />`,
        `<path ${PART} d="M144 -26 h32 v6 q-16 8 -32 0 z" />`,
        `<path ${SOLID} d="M158 -20 h4 v3 h-4 z" />`,
        `<path ${DETAIL} d="M184 -16 q6 4 4 10 M192 -20 q10 7 6 18" />`,
    ],
};

const HELD = {
    phone: [
        `<path ${PART} d="M131 156 h12 q3 0 3 3 v32 q0 3 -3 3 h-12 q-3 0 -3 -3 v-32 q0 -3 3 -3 z" />`,
        `<path ${DETAIL} d="M134 188 h6" />`,
    ],
    cup: [
        `<path ${PART} d="M44 158 h22 v5 h-22 z" />`,
        `<path ${PART} d="M46 163 h18 l-2 24 h-14 z" />`,
        `<path ${HATCH} d="M49 172 h12" />`,
    ],
    hat: [
        `<path ${PART} d="M86 22 q-2 -20 14 -20 q16 0 14 20 z" />`,
        `<path ${SOLID} d="M86 15 h28 v5 h-28 z" />`,
        `<path ${PART} d="M70 24 q30 -8 60 0 q-30 6 -60 0 z" />`,
    ],
};

/** The rig's layer order, back to front. */
const SCENERY_ORDER = Object.keys(SCENERY);

/**
 * The cut in a pose, among a scene, as an SVG data URI whose box is the
 * rig's plus PAD.
 * @param {Record<string, number>} joints  degrees, keyed as in data/poses.js
 * @param {string[]} [scene]  keys of data/scenes.js; the rest stay off
 */
export function cutSrc(joints, scene = []) {
    const on = new Set(scene);
    const held = (prop) => (on.has(prop) ? HELD[prop].join('') : '');
    const turn = (joint, ...parts) => {
        const [x, y] = JOINT_ORIGINS[joint];
        return `<g transform="rotate(${joints[joint] ?? 0} ${x} ${y})">${parts.join('')}</g>`;
    };
    const width = CUT_WIDTH + PAD.left + PAD.right;
    const height = CUT_HEIGHT + PAD.top + PAD.bottom;
    const svg = [
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-PAD.left} ${-PAD.top} ${width} ${height}" width="${width}" height="${height}">`,
        ...SCENERY_ORDER.filter((prop) => on.has(prop)).map(
            (prop) => `<g>${SCENERY[prop].join('')}</g>`,
        ),
        '<g transform="translate(-24 -6)">',
        turn(
            'legFar',
            `<path ${PART} d="M102 150 h24 l-5 116 h-17 z" />`,
            `<path ${PART} d="M104 262 h17 l12 10 q-3 5 -12 5 h-18 z" />`,
            `<path ${HATCH} d="M110 184 v66" />`,
        ),
        turn(
            'legNear',
            `<path ${PART} d="M74 150 h24 l-3 116 h-17 z" />`,
            `<path ${PART} d="M75 262 h17 l-11 10 q-4 5 -13 5 h-5 z" />`,
            `<path ${HATCH} d="M82 184 v66" />`,
        ),
        `<path ${PART} d="M70 138 h60 l2 26 q-32 7 -64 0 z" />`,
        turn(
            'armFar',
            turn(
                'forearmFar',
                `<path ${PART} d="M121 118 h17 l-3 48 h-12 z" />`,
                held('phone'),
                `<path ${PART} d="M121 162 q-5 8 -3 16 q3 9 12 7 q7 -2 6 -12 l-1 -11 z" />`,
                `<path ${DETAIL} d="M126 170 v9 M132 169 v9" />`,
            ),
            `<path ${PART} d="M121 74 h18 l-2 52 h-15 z" />`,
        ),
        turn(
            'armNear',
            turn(
                'forearmNear',
                `<path ${PART} d="M62 118 h17 l-3 48 h-12 z" />`,
                held('cup'),
                `<path ${PART} d="M62 162 q-5 8 -3 16 q3 9 12 7 q7 -2 6 -12 l-1 -11 z" />`,
                `<path ${DETAIL} d="M67 170 v9 M73 169 v9" />`,
            ),
            `<path ${PART} d="M61 74 h18 l-2 52 h-15 z" />`,
        ),
        `<path ${PART} d="M68 78 q32 -13 64 0 l2 68 q-34 9 -68 0 z" />`,
        `<path ${DETAIL} d="M100 82 v62" />`,
        `<path ${DETAIL} d="M86 76 l14 11 l14 -11" />`,
        `<circle ${SOLID} cx="100" cy="104" r="2" />`,
        `<circle ${SOLID} cx="100" cy="126" r="2" />`,
        `<path ${HATCH} d="M113 100 l16 3 M112 114 l17 3 M112 128 l17 3" />`,
        `<path ${DETAIL} d="M71 155 h58" />`,
        `<path ${SOLID} d="M94 150 h12 v10 h-12 z" />`,
        turn(
            'tilt',
            `<path ${PART} d="M93 54 h14 v18 h-14 z" />`,
            `<ellipse ${PART} cx="100" cy="40" rx="18" ry="21" />`,
            `<path ${SOLID} d="M82 38 q1 -25 18 -25 q17 0 18 25 q-5 -13 -18 -13 q-13 0 -18 13 z" />`,
            `<path ${DETAIL} d="M118 41 q5 3 0 8" />`,
            `<circle ${SOLID} cx="93" cy="41" r="1.9" />`,
            `<circle ${SOLID} cx="107" cy="41" r="1.9" />`,
            `<path ${DETAIL} d="M100 41 v9 l-4 2" />`,
            `<path ${DETAIL} d="M94 56 q6 3 12 0" />`,
            `<path ${HATCH} d="M87 47 l-3 5 M113 47 l3 5" />`,
            held('hat'),
        ),
        '</g>',
        '</svg>',
    ].join('');
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}
