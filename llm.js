const TINY_LLM_TIMEOUT_MS = 2400;
const GENERATION_DELAY_RANGE_MS = { min: 420, max: 880 };
const RECENT_HEADLINE_HISTORY = 12;
const RECENT_STORAGE_KEY = 'tinyLlmRecentHeadlines';
const MAX_RECENT_STORAGE = 24;

const tinyLlmClient = (() => {
    const beats = {
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
            { text: 'the neighborhood Wi-Fi sleuth', pronouns: { possessive: 'their', object: 'them' } },
            { text: 'a snack-fueled podcaster', pronouns: { possessive: 'their', object: 'them' } },
            { text: 'an overcaffeinated mod', pronouns: { possessive: 'their', object: 'them' } },
            { text: 'a Bluetooth astrologer', pronouns: { possessive: 'their', object: 'them' } },
            { text: 'the late-night content gremlin', pronouns: { possessive: 'their', object: 'them' } },
            { text: 'a chronically online organizer', pronouns: { possessive: 'their', object: 'them' } },
            { text: 'a live-chat philosopher', pronouns: { possessive: 'their', object: 'them' } },
            { text: 'the group chat historian', pronouns: { possessive: 'their', object: 'them' } }
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
            'files a report on how to'
        ],
        objects: [
            '{possessive} grocery run like it is Sundance',
            'dark mode as a lifestyle and tax write-off',
            'vibes with a Google Form',
            'apologies as NFTs',
            'mute push notifications with aura',
            '{possessive} hobby as a productivity pivot',
            '{possessive} screen time using vibes per minute',
            'a group chat as a startup incubator',
            'a ring light as a newsroom upgrade',
            '{possessive} to-do list as a cinematic universe',
            '{possessive} calendar as an escape room'
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
            '{possessive} inbox hit 99+ again'
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
            'analysts are calling it a soft pivot with loud vibes.'
        ],
        tags: [
            'Developing story.',
            'Updates expected at the top of the hour.',
            'Sources confirm the vibe check passed.',
            'Analysts call it a bold pivot.',
            'Inbox watchers remain on standby.'
        ],
        styleBreaks: [
            '—',
            '·',
            '•'
        ]
    };

    const templates = [
        ({ desk, subject, verb, object, connector, twist, impact }) =>
            `${desk} ${subject} ${verb} ${object} ${connector} ${twist}, ${impact}`,
        ({ subject, verb, object, impact }) =>
            `${subject} ${verb} ${object}. ${impact}`,
        ({ desk, subject, verb, object, connector, twist, impact, breakMark, tag }) =>
            `${desk} ${subject} ${verb} ${object} ${connector} ${twist} ${breakMark} ${impact} ${tag}`,
        ({ subject, verb, object, connector, twist, impact }) =>
            `${subject} ${verb} ${object} ${connector} ${twist}; ${impact}`,
        ({ desk, subject, verb, object, impact, tag }) =>
            `${desk} ${subject} ${verb} ${object}. ${impact} ${tag}`
    ];

    const recentHeadlines = loadRecentHeadlines();

    function getSecureRandom() {
        if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
            const buffer = new Uint32Array(1);
            crypto.getRandomValues(buffer);
            return buffer[0] / (0xffffffff + 1);
        }
        return Math.random();
    }

    function pickRandom(list, avoid = []) {
        if (!Array.isArray(list) || list.length === 0) return null;
        if (list.length === 1) return list[0];
        let candidate = list[Math.floor(getSecureRandom() * list.length)];
        let attempts = 0;
        while (attempts < list.length && avoid.includes(candidate)) {
            candidate = list[Math.floor(getSecureRandom() * list.length)];
            attempts += 1;
        }
        return candidate;
    }

    function normalizeSubject(subject) {
        if (!subject || typeof subject === 'string') {
            return {
                text: subject || 'someone online',
                pronouns: { possessive: 'their', object: 'them' }
            };
        }
        const pronouns = subject.pronouns || {};
        return {
            text: subject.text || 'someone online',
            pronouns: {
                possessive: pronouns.possessive || 'their',
                object: pronouns.object || 'them'
            }
        };
    }

    function applyTokens(text, tokens) {
        if (!text) return '';
        return text.replace(/\{(\w+)\}/g, (match, key) => (tokens[key] ? tokens[key] : match));
    }

    function loadRecentHeadlines() {
        if (typeof localStorage === 'undefined') {
            return [];
        }
        try {
            const stored = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY));
            return Array.isArray(stored) ? stored.filter(Boolean) : [];
        } catch (error) {
            return [];
        }
    }

    function persistRecentHeadlines(headlines) {
        if (typeof localStorage === 'undefined') {
            return;
        }
        try {
            localStorage.setItem(
                RECENT_STORAGE_KEY,
                JSON.stringify(headlines.slice(0, MAX_RECENT_STORAGE))
            );
        } catch (error) {
            return;
        }
    }

    function rememberHeadline(headline) {
        recentHeadlines.unshift(headline);
        if (recentHeadlines.length > RECENT_HEADLINE_HISTORY) {
            recentHeadlines.pop();
        }
        persistRecentHeadlines(recentHeadlines);
    }

    function isRecentlyUsed(headline) {
        return recentHeadlines.includes(headline);
    }

    let lastPayload = null;

    function buildHeadlineCandidate() {
        const template = pickRandom(templates);
        const rawSubject = pickRandom(
            beats.subjects,
            lastPayload ? [lastPayload.rawSubject] : []
        );
        const subject = normalizeSubject(rawSubject);
        const tokens = {
            possessive: subject.pronouns.possessive,
            object: subject.pronouns.object
        };

        const rawObject = pickRandom(beats.objects, lastPayload ? [lastPayload.rawObject] : []);
        const rawTwist = pickRandom(beats.twists, lastPayload ? [lastPayload.rawTwist] : []);
        const payload = {
            desk: pickRandom(beats.desks, lastPayload ? [lastPayload.desk] : []),
            subject: subject.text,
            verb: pickRandom(beats.verbs, lastPayload ? [lastPayload.verb] : []),
            object: applyTokens(rawObject, tokens),
            connector: pickRandom(beats.connectors, lastPayload ? [lastPayload.connector] : []),
            twist: applyTokens(rawTwist, tokens),
            impact: pickRandom(beats.impacts, lastPayload ? [lastPayload.impact] : []),
            tag: pickRandom(beats.tags, lastPayload ? [lastPayload.tag] : []),
            breakMark: pickRandom(beats.styleBreaks)
        };

        const headline = template(payload).replace(/\s+/g, ' ').trim();
        lastPayload = { ...payload, rawSubject, rawObject, rawTwist };
        return headline;
    }

    function generateUniqueHeadline() {
        let attempt = 0;
        let headline = '';
        const maxAttempts = RECENT_HEADLINE_HISTORY + 6;

        while (attempt < maxAttempts) {
            headline = buildHeadlineCandidate();
            if (!isRecentlyUsed(headline)) {
                break;
            }
            attempt += 1;
        }

        return headline;
    }

    function resolveAfterDelay(task) {
        const min = GENERATION_DELAY_RANGE_MS.min;
        const max = GENERATION_DELAY_RANGE_MS.max;
        const delay = min + Math.floor(getSecureRandom() * (max - min));

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    resolve(task());
                } catch (error) {
                    reject(error);
                }
            }, delay);
        });
    }

    async function generateHeadline() {
        const generation = resolveAfterDelay(() => {
            const headline = generateUniqueHeadline();
            if (!headline || headline.trim().length === 0) {
                throw new Error('Empty generation result');
            }
            rememberHeadline(headline);
            return headline;
        });

        const timeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Generation timed out')), TINY_LLM_TIMEOUT_MS);
        });

        return Promise.race([generation, timeout]);
    }

    return { generateHeadline };
})();

if (typeof window !== 'undefined') {
    window.tinyLlmClient = tinyLlmClient;
}
