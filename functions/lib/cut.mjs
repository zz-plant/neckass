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

/**
 * The cut in a pose, as an SVG data URI whose box is the rig's plus PAD.
 * @param {Record<string, number>} joints  degrees, keyed as in data/poses.js
 */
export function cutSrc(joints) {
    const turn = (joint, ...parts) => {
        const [x, y] = JOINT_ORIGINS[joint];
        return `<g transform="rotate(${joints[joint] ?? 0} ${x} ${y})">${parts.join('')}</g>`;
    };
    const width = CUT_WIDTH + PAD.left + PAD.right;
    const height = CUT_HEIGHT + PAD.top + PAD.bottom;
    const svg = [
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-PAD.left} ${-PAD.top} ${width} ${height}" width="${width}" height="${height}">`,
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
        ),
        '</g>',
        '</svg>',
    ].join('');
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}
