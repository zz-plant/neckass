(() => {
    const Neckass = window.Neckass = window.Neckass || {};
    const data = Neckass.data = Neckass.data || {};

    const BEATS = {
    desks: [
        'Hot off the tiny desk:',
        'Breaking from the micro newsroom:',
        'Edge model dispatch:',
        'Pocket report:',
        'On-device bulletin:',
        'Couch bureau update:',
        'Signal boost from the tiny press:',
        'Push notification from the pocket bureau:'
    ],
    subjects: [
        { text: 'Neckass', pronouns: { possessive: 'his', object: 'him' } },
        { text: 'a sleep-deprived influencer', pronouns: { possessive: 'their', object: 'them' } },
        { text: 'the neighborhood network sleuth', pronouns: { possessive: 'their', object: 'them' } },
        { text: 'a snack-fueled podcaster', pronouns: { possessive: 'their', object: 'them' } },
        { text: 'an overcaffeinated mod', pronouns: { possessive: 'their', object: 'them' } },
        { text: 'an AI horoscope editor', pronouns: { possessive: 'their', object: 'them' } },
        { text: 'the late-night content gremlin', pronouns: { possessive: 'their', object: 'them' } },
        { text: 'a chronically online organizer', pronouns: { possessive: 'their', object: 'them' } },
        { text: 'a live-chat philosopher', pronouns: { possessive: 'their', object: 'them' } },
        { text: 'the group chat historian', pronouns: { possessive: 'their', object: 'them' } },
        { text: 'the office snack oracle', pronouns: { possessive: 'their', object: 'them' } },
        { text: 'a meme-savvy meteorologist', pronouns: { possessive: 'their', object: 'them' } },
        { text: 'the unpaid social media intern', pronouns: { possessive: 'their', object: 'them' } }
    ],
    verbs: [
        'liveblogs',
        'declares',
        'soft-launches',
        'tries to crowdsource',
        'launches',
        'hosts a webinar on how to',
        'rebrands',
        'attempts to benchmark',
        'drops a thread explaining how to',
        'publishes a manifesto about how to',
        'files a report on how to',
        'accidentally schedules a meeting to',
        'renames the cloud workspace to',
        'runs a focus group on how to',
        'goes live to explain how to',
        'panic-pitches a plan to',
        'announces a bold initiative to',
        'posts a 27-part story about how to',
        'circulates an emergency memo to',
        'claims to have cracked the code to'
    ],
    objects: [
        '{possessive} grocery run like it is an award show',
        'dark mode as a lifestyle choice',
        'vibes with a poll in the group chat',
        'apologies as limited-edition stickers',
        'mute push notifications with a spreadsheet',
        '{possessive} hobby as a productivity pivot',
        '{possessive} screen time with a color-coded report',
        'a group chat as a startup incubator',
        'a creator studio as a newsroom upgrade',
        '{possessive} to-do list as a cinematic universe',
        '{possessive} calendar as an escape room',
        'a fridge note as a breaking news ticker',
        '{possessive} laundry pile as a mood board',
        'air-frying leftovers like it is a cooking show finale',
        '{possessive} inbox as a competitive sport',
        'a typo into a full rebrand campaign',
        '{possessive} voicemail greeting as an apology tour',
        'a three-tab panic into a five-year strategy',
        'office leftovers as a Michelin audition',
        '{possessive} unread emails into a cinematic multiverse',
        'a calendar invite as a legally binding vibe check'
    ],
    connectors: [
        'after',
        'while',
        'because',
        'right as',
        'the moment',
        'right when'
    ],
    twists: [
        'doomscrolling through a meditation app',
        'someone in chat said "trust"',
        'the algorithm begged for mercy',
        'a notification ping demanded applause',
        '{possessive} calendar sent a push notification',
        'the group chat voted unanimously',
        '{possessive} inbox hit 99+ again',
        'a smart assistant applauded unprompted',
        'autocorrect insisted on being the co-host',
        'a delivery bot rolled up with live commentary',
        'three coworkers replied "following" and vanished',
        'a voice note arrived with legally risky confidence',
        'the office Slack used seventeen clown emojis',
        'the family group chat asked for a pilot episode',
        'an intern whispered "this is cursed"'
    ],
    impacts: [
        'sources say the backlog of screenshots is heroic.',
        'the algorithm remains unconvinced.',
        'commenters are already drafting dissertations.',
        'eyewitnesses report zero chill and maximum tabs.',
        'forecast calls for 90% chance of group chat drama.',
        'a focus group of houseplants requested a sequel.',
        'metrics include three sighs per minute and rising.',
        'witnesses cite an immediate spike in side-eye.',
        'analysts are calling it a soft pivot with loud vibes.',
        'local experts predict a surge in dramatic sighing.',
        'eyewitnesses confirm the chaos was lightly curated.',
        'the emoji budget has been completely exhausted.',
        'breaking: someone yelled "this meeting could have been a meme."',
        'sources confirm two ring lights and one ego were injured.',
        'a panel of tired moderators rated the chaos "award-eligible."',
        'finance called it a rounding error; culture called it performance art.',
        'witnesses say the vibe check passed and then filed an appeal.'
    ],
    tags: [
        'Developing story.',
        'Updates expected at the top of the hour.',
        'Sources confirm the vibe check passed.',
        'Analysts call it a bold pivot.',
        'Inbox watchers remain on standby.',
        'Legal asked us to call this "experimental."',
        'No one is prepared, yet everyone has opinions.',
        'Producers confirm the sequel is already unnecessary.'
    ],
    styleBreaks: [
        '—',
        '·',
        '•'
    ],
    scripted: [
        '{desk} {subject} is back with a plan to {object}. {impact}',
        '{subject} says {object} is the only way forward. {tag}',
        'Live update: {subject} just tried to {object} and the chat screamed. {impact}',
        '{subject} insists the real news is {object}. {impact}',
        '{desk} {subject} went on record about {object} and caused a ripple. {tag}',
        '{subject} is treating {object} like a season finale. {impact}',
        '{desk} {subject} declared {object} the new normal. {tag}',
        '{subject} returned with a fresh take on {object}. {impact}',
        'Breaking: {subject} called a press conference to explain {object}. {impact}',
        '{desk} producers caught {subject} trying to {object} on purpose. {tag}',
        '{subject} promised this was "low-key," then tried to {object}. {impact}',
        'Alert: {subject} turned {object} into content and nobody could look away. {tag}'
    ]
};

    const TEMPLATES = [
    ({ desk, subject, verb, object, connector, twist, impact }) =>
        `${desk} ${subject} ${verb} ${object} ${connector} ${twist}, ${impact}`,
    ({ subject, verb, object, impact }) =>
        `${subject} ${verb} ${object}. ${impact}`,
    ({ desk, subject, verb, object, connector, twist, impact, breakMark, tag }) =>
        `${desk} ${subject} ${verb} ${object} ${connector} ${twist} ${breakMark} ${impact} ${tag}`,
    ({ subject, verb, object, connector, twist, impact }) =>
        `${subject} ${verb} ${object} ${connector} ${twist}; ${impact}`,
    ({ desk, subject, verb, object, impact, tag }) =>
        `${desk} ${subject} ${verb} ${object}. ${impact} ${tag}`,
    ({ subject, verb, object, connector, twist, impact, tag }) =>
        `${subject} ${verb} ${object} ${connector} ${twist}. ${impact} ${tag}`,
    ({ desk, subject, verb, object, impact }) =>
        `${desk} ${subject} ${verb} ${object} ${impact}`,
    ({ subject, verb, object, connector, twist }) =>
        `${subject} ${verb} ${object} ${connector} ${twist}.`,
    ({ desk, subject, verb, object, connector, twist, breakMark, impact }) =>
        `${desk} ${subject} ${verb} ${object} ${connector} ${twist} ${breakMark} ${impact}`,
    ({ subject, verb, object, impact, tag }) =>
        `${subject} ${verb} ${object}. ${impact} ${tag}`
    ];

    data.BEATS = BEATS;
    data.TEMPLATES = TEMPLATES;
})();
