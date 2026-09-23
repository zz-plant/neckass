/**
 * The file cut, flattened for the social card.
 *
 * assets/cuts/neckass.svg is a rig: its joints read CSS custom properties,
 * and its ink follows the colour scheme. Satori and resvg read neither, so
 * this is the same drawing in the house pose with each joint's rotation
 * written as an attribute and the ink and paper written in. Re-pose the
 * rig and this goes stale; the angles below are the rig's fallbacks.
 */

const PARTS = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 182 278" width="182" height="278">',
    '<g transform="translate(-24 -6)">',
    '<g transform="rotate(-3 112 156)">',
    '<path fill="#efeae0" stroke="#1c1a19" stroke-width="3" stroke-linejoin="round" d="M102 150 h24 l-5 116 h-17 z" />',
    '<path fill="#efeae0" stroke="#1c1a19" stroke-width="3" stroke-linejoin="round" d="M104 262 h17 l12 10 q-3 5 -12 5 h-18 z" />',
    '<path fill="none" stroke="#1c1a19" stroke-width="1.4" stroke-linecap="round" opacity="0.7" d="M110 184 v66" />',
    '</g>',
    '<g transform="rotate(2 88 156)">',
    '<path fill="#efeae0" stroke="#1c1a19" stroke-width="3" stroke-linejoin="round" d="M74 150 h24 l-3 116 h-17 z" />',
    '<path fill="#efeae0" stroke="#1c1a19" stroke-width="3" stroke-linejoin="round" d="M75 262 h17 l-11 10 q-4 5 -13 5 h-5 z" />',
    '<path fill="none" stroke="#1c1a19" stroke-width="1.4" stroke-linecap="round" opacity="0.7" d="M82 184 v66" />',
    '</g>',
    '<path fill="#efeae0" stroke="#1c1a19" stroke-width="3" stroke-linejoin="round" d="M70 138 h60 l2 26 q-32 7 -64 0 z" />',
    '<g transform="rotate(-22 130 80)">',
    '<g transform="rotate(-122 130 124)">',
    '<path fill="#efeae0" stroke="#1c1a19" stroke-width="3" stroke-linejoin="round" d="M121 118 h17 l-3 48 h-12 z" />',
    '<path fill="#efeae0" stroke="#1c1a19" stroke-width="3" stroke-linejoin="round" d="M121 162 q-5 8 -3 16 q3 9 12 7 q7 -2 6 -12 l-1 -11 z" />',
    '<path fill="none" stroke="#1c1a19" stroke-width="2" stroke-linecap="round" d="M126 170 v9 M132 169 v9" />',
    '</g>',
    '<path fill="#efeae0" stroke="#1c1a19" stroke-width="3" stroke-linejoin="round" d="M121 74 h18 l-2 52 h-15 z" />',
    '</g>',
    '<g transform="rotate(7 70 80)">',
    '<g transform="rotate(9 70 124)">',
    '<path fill="#efeae0" stroke="#1c1a19" stroke-width="3" stroke-linejoin="round" d="M62 118 h17 l-3 48 h-12 z" />',
    '<path fill="#efeae0" stroke="#1c1a19" stroke-width="3" stroke-linejoin="round" d="M62 162 q-5 8 -3 16 q3 9 12 7 q7 -2 6 -12 l-1 -11 z" />',
    '<path fill="none" stroke="#1c1a19" stroke-width="2" stroke-linecap="round" d="M67 170 v9 M73 169 v9" />',
    '</g>',
    '<path fill="#efeae0" stroke="#1c1a19" stroke-width="3" stroke-linejoin="round" d="M61 74 h18 l-2 52 h-15 z" />',
    '</g>',
    '<path fill="#efeae0" stroke="#1c1a19" stroke-width="3" stroke-linejoin="round" d="M68 78 q32 -13 64 0 l2 68 q-34 9 -68 0 z" />',
    '<path fill="none" stroke="#1c1a19" stroke-width="2" stroke-linecap="round" d="M100 82 v62" />',
    '<path fill="none" stroke="#1c1a19" stroke-width="2" stroke-linecap="round" d="M86 76 l14 11 l14 -11" />',
    '<circle fill="#1c1a19" cx="100" cy="104" r="2" />',
    '<circle fill="#1c1a19" cx="100" cy="126" r="2" />',
    '<path fill="none" stroke="#1c1a19" stroke-width="1.4" stroke-linecap="round" opacity="0.7" d="M113 100 l16 3 M112 114 l17 3 M112 128 l17 3" />',
    '<path fill="none" stroke="#1c1a19" stroke-width="2" stroke-linecap="round" d="M71 155 h58" />',
    '<path fill="#1c1a19" d="M94 150 h12 v10 h-12 z" />',
    '<g transform="rotate(-4 100 66)">',
    '<path fill="#efeae0" stroke="#1c1a19" stroke-width="3" stroke-linejoin="round" d="M93 54 h14 v18 h-14 z" />',
    '<ellipse fill="#efeae0" stroke="#1c1a19" stroke-width="3" stroke-linejoin="round" cx="100" cy="40" rx="18" ry="21" />',
    '<path fill="#1c1a19" d="M82 38 q1 -25 18 -25 q17 0 18 25 q-5 -13 -18 -13 q-13 0 -18 13 z" />',
    '<path fill="none" stroke="#1c1a19" stroke-width="2" stroke-linecap="round" d="M118 41 q5 3 0 8" />',
    '<circle fill="#1c1a19" cx="93" cy="41" r="1.9" />',
    '<circle fill="#1c1a19" cx="107" cy="41" r="1.9" />',
    '<path fill="none" stroke="#1c1a19" stroke-width="2" stroke-linecap="round" d="M100 41 v9 l-4 2" />',
    '<path fill="none" stroke="#1c1a19" stroke-width="2" stroke-linecap="round" d="M94 56 q6 3 12 0" />',
    '<path fill="none" stroke="#1c1a19" stroke-width="1.4" stroke-linecap="round" opacity="0.7" d="M87 47 l-3 5 M113 47 l3 5" />',
    '</g>',
    '</g>',
    '</svg>',
];

export const CUT_WIDTH = 182;
export const CUT_HEIGHT = 278;

export const CUT_SRC = `data:image/svg+xml;base64,${btoa(PARTS.join(''))}`;
