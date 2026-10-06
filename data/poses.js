// The file cut's poses. assets/cuts/neckass.svg is a rig: each joint turns
// on a custom property, and these are the angles, in degrees, that the
// paper sets on it. A lead names its pose; the front page sets the joints
// on its inlined copy of the cut and the caption under it, and the
// social card draws the cut in the same pose (functions/lib/cut.mjs).
//
// Zero on every joint stands him to attention. Positive turns a joint
// clockwise as drawn: the near arm (his left, the viewer's left) swings
// out, the far arm swings in. The arms are drawn behind the torso and the
// head, so a hand brought in front of either is hidden; a pose keeps its
// hands out at the sides, or up by the ear.
//
// The caption follows "FILE —" in the cutline. The alt text says what the
// drawing shows, for a reader who cannot see it.
export const POSES = {
    explaining: {
        caption: 'Neckass, explaining.',
        alt: 'Line-cut of a man standing with one hand raised, explaining.',
        joints: {
            tilt: -4,
            armNear: 7,
            forearmNear: 9,
            armFar: -22,
            forearmFar: -122,
            legNear: 2,
            legFar: -3,
        },
    },
    defense: {
        caption: 'Neckass, in his own defense.',
        alt: 'Line-cut of a man with both hands raised.',
        joints: {
            tilt: -4,
            armNear: 22,
            forearmNear: 122,
            armFar: -22,
            forearmFar: -122,
            legNear: 2,
            legFar: -3,
        },
    },
    pointing: {
        caption: 'Neckass, pointing it out.',
        alt: 'Line-cut of a man pointing to one side, arm straight out.',
        joints: {
            tilt: -8,
            armNear: 7,
            forearmNear: 9,
            armFar: -96,
            forearmFar: 8,
            legNear: 2,
            legFar: -3,
        },
    },
    shrug: {
        caption: 'Neckass, asked about it.',
        alt: 'Line-cut of a man shrugging, palms up.',
        joints: {
            tilt: 10,
            armNear: 48,
            forearmNear: 92,
            armFar: -48,
            forearmFar: -92,
            legNear: 2,
            legFar: -3,
        },
    },
    satisfied: {
        caption: 'Neckass, satisfied.',
        alt: 'Line-cut of a man standing with his hands on his hips.',
        joints: {
            tilt: -6,
            armNear: 34,
            forearmNear: -70,
            armFar: -34,
            forearmFar: 70,
            legNear: 6,
            legFar: -6,
        },
    },
    leaving: {
        caption: 'Neckass, on his way out.',
        alt: 'Line-cut of a man waving, one arm high.',
        joints: {
            tilt: -6,
            armNear: 6,
            forearmNear: 6,
            armFar: -150,
            forearmFar: -20,
            legNear: 2,
            legFar: -3,
        },
    },
    phone: {
        caption: 'Neckass, on the phone.',
        alt: 'Line-cut of a man with one hand held to his ear.',
        joints: {
            tilt: 8,
            armNear: 4,
            forearmNear: 4,
            armFar: -80,
            forearmFar: -151,
            legNear: 2,
            legFar: -3,
        },
    },
    considering: {
        caption: 'Neckass, considering it.',
        alt: 'Line-cut of a man with one hand raised to his head.',
        joints: {
            tilt: -8,
            armNear: 58,
            forearmNear: 163,
            armFar: -3,
            forearmFar: -2,
            legNear: 2,
            legFar: -3,
        },
    },
    standingBy: {
        caption: 'Neckass, standing by.',
        alt: 'Line-cut of a man standing to attention, arms at his sides.',
        joints: {
            tilt: 0,
            armNear: 0,
            forearmNear: 0,
            armFar: 0,
            forearmFar: 0,
            legNear: 0,
            legFar: 0,
        },
    },
    // His eyes are open in the drawing. The caption is his.
    resting: {
        caption: 'Neckass, resting his eyes.',
        alt: 'Line-cut of a man standing with his head to one side, eyes open.',
        joints: {
            tilt: 14,
            armNear: 2,
            forearmNear: 0,
            armFar: -2,
            forearmFar: 0,
            legNear: 0,
            legFar: 0,
        },
    },
};
