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
            'Signal boost from the tiny press:'
        ],
        subjects: [
            'Neckass',
            'a sleep-deprived influencer',
            'the neighborhood Wi-Fi sleuth',
            'a snack-fueled podcaster',
            'an overcaffeinated mod',
            'a Bluetooth astrologer',
            'the late-night content gremlin',
            'a chronically online organizer'
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
            'drops a thread explaining how to'
        ],
        objects: [
            'his grocery run like it is Sundance',
            'dark mode as a lifestyle and tax write-off',
            'vibes with a Google Form',
            'apologies as NFTs',
            'mute push notifications with aura',
            'his hobby as a productivity pivot',
            'his screen time using vibes per minute',
            'a group chat as a startup incubator',
            'a ring light as a newsroom upgrade'
        ],
        connectors: [
            'after',
            'while',
            'because',
            'right as',
            'the moment'
        ],
        twists: [
            'doomscrolling through a meditation app',
            'someone in chat said "trust"',
            'the algorithm begged for mercy',
            'a notification ping demanded applause',
            'his calendar sent a push notification',
            'the group chat voted unanimously'
        ],
        impacts: [
            'sources say the backlog of screenshots is heroic.',
            'the algorithm remains unconvinced.',
            'commenters are already drafting dissertations.',
            'eyewitnesses report zero chill and maximum tabs.',
            'forecast calls for 90% chance of group chat drama.',
            'a focus group of houseplants requested a sequel.',
            'metrics include three sighs per minute and rising.',
            'witnesses cite an immediate spike in side-eye.'
        ],
        tags: [
            'Developing story.',
            'Updates expected at the top of the hour.',
            'Sources confirm the vibe check passed.',
            'Analysts call it a bold pivot.'
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
            `${subject} ${verb} ${object} ${connector} ${twist}; ${impact}`
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

    function pickRandom(list) {
        return list[Math.floor(getSecureRandom() * list.length)];
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

    function buildHeadlineCandidate() {
        const template = pickRandom(templates);
        const payload = {
            desk: pickRandom(beats.desks),
            subject: pickRandom(beats.subjects),
            verb: pickRandom(beats.verbs),
            object: pickRandom(beats.objects),
            connector: pickRandom(beats.connectors),
            twist: pickRandom(beats.twists),
            impact: pickRandom(beats.impacts),
            tag: pickRandom(beats.tags),
            breakMark: pickRandom(beats.styleBreaks)
        };

        const headline = template(payload);
        return headline.replace(/\s+/g, ' ').trim();
    }

    function generateUniqueHeadline() {
        let attempt = 0;
        let headline = '';
        const maxAttempts = RECENT_HEADLINE_HISTORY + 2;

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
