// What the file cut can be drawn among. The cut in index.html carries
// every prop below as a layer, off until its switch is 1; a lead names the
// ones its story happens among (`scene: ['phone', 'couch']`), and the
// front page and the card switch those on and no others.
//
// Three are held and move with him: the phone in the far hand, which the
// phone pose brings to his ear; the cup in the near hand; the hat on his
// head. The rest stand behind him on the ground he stands on, most of them
// to his right, where the drawing has room. Two at once is the most the
// box takes before the furniture argues; the couch and the television are
// drawn to share it.
//
// `caption` is what the cutline says about it, after the pose's own words, so
// it has to read after any of them: "Neckass, satisfied. The floor around the
// shoe is clean." With two props, the one he is among speaks, not the one he
// is holding. `alt` finishes the pose's alt text: "Line-cut of a man with one hand
// held to his ear, holding a phone, in front of a couch." Held props come
// first, in the order below.
export const SCENES = {
    phone: {
        alt: 'holding a phone',
        caption: 'He has told them he is five minutes away.',
    },
    cup: {
        alt: 'holding a coffee cup',
        caption: 'It is someone else’s coffee.',
    },
    hat: {
        alt: 'in a hat',
        caption: 'A neighbor has reported a second man.',
    },
    doorway: {
        alt: 'in a doorway',
        caption: 'He said he should go at 9:10. He is still in the doorway.',
    },
    couch: {
        alt: 'in front of a couch',
        caption: 'The chargers are behind the couch.',
    },
    fridge: {
        alt: 'beside an open fridge',
        caption: 'The fridge is full. He is just seeing.',
    },
    tv: {
        alt: 'beside a television',
        caption: 'He has seen the first ten minutes.',
    },
    desk: {
        alt: 'beside a desk with a computer on it',
        caption: 'His out-of-office says he is away.',
    },
    table: {
        alt: 'beside a table',
        caption: 'The table has heard this one.',
    },
    easel: {
        alt: 'beside a flip chart',
        caption: 'The flip chart says “Questions?”',
    },
    signpost: {
        alt: 'beside a signpost pointing both ways',
        caption: 'The sign points both ways. He has picked one.',
    },
    shelf: {
        alt: 'under a shelf coming off the wall',
        caption: 'He has four screws left over.',
    },
    clock: {
        alt: 'under a wall clock',
        caption: 'The clock is right. He has disputed it.',
    },
    alarm: {
        alt: 'beside a bedside table with an alarm clock on it',
        caption: 'The alarm has been going since 5:30.',
    },
    parcel: {
        alt: 'beside a package',
        caption: 'The package is going out this week.',
    },
    shoe: {
        alt: 'near a shoe on the floor',
        caption: 'The floor around the shoe is clean.',
    },
    rain: {
        alt: 'in the rain',
        caption: 'He says it is not really rain.',
    },
    shower: {
        alt: 'under a running shower',
        caption: 'He says he is on the train.',
    },
    smoke: {
        alt: 'under a smoke alarm',
        caption: 'He says that is a bird.',
    },
};

// A pose and a scene that earn a line of their own, keyed pose+props with the
// props in the order above. These replace the caption whole, and only the
// pairings the paper actually runs belong here: a test checks.
export const CAPTIONS = {
    'phone+phone,couch': 'Neckass, on the phone, at home. He has told them he is five minutes away.',
    'phone+phone,desk': 'Neckass, on the phone, at his desk. His out-of-office is telling them he is away.',
    'phone+phone,shower': 'Neckass, on the phone, in the shower. He says he is on the train.',
    'defense+phone': 'Neckass, in his own defense, holding up his phone. It is a screenshot.',
    'defense+phone,doorway': 'Neckass, in his own defense, in his own doorway. He has told the neighbors to stay safe.',
    'satisfied+phone': 'Neckass, satisfied, with his phone. It agreed with him.',
    'considering+phone': 'Neckass, considering his phone. It has not said anything.',
    'explaining+phone': 'Neckass, explaining, with his phone out. He is reading it to you.',
    'satisfied+desk': 'Neckass, satisfied, at his desk. He has sent three emails.',
    'defense+desk': 'Neckass, in his own defense, at his desk. He was here the whole time.',
    'explaining+desk': 'Neckass, explaining, at his desk. The desk beside him has put on headphones.',
    'pointing+desk': 'Neckass, pointing it out, at his desk. It is on page four of the manual.',
    'standingBy+desk': 'Neckass, standing by, at his desk. He has blocked this time.',
    'leaving+doorway': 'Neckass, on his way out. He has been on his way out since 9:10.',
    'standingBy+doorway': 'Neckass, standing in a doorway. He is holding it for someone forty feet away.',
    'satisfied+cup,table': 'Neckass, satisfied, at a table for six, with one coffee.',
    'leaving+cup': 'Neckass, on his way out, with a coffee. He calls the staff “chief.”',
    'resting+couch,tv': 'Neckass, resting his eyes, in front of the television. He says it is good so far.',
    'shrug+parcel': 'Neckass, asked about it, beside the package. “I know, I know.” He does know.',
};
