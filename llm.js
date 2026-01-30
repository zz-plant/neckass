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
            'runs a focus group on how to'
        ],
        objects: [
            '{possessive} grocery run like it is Sundance',
            'dark mode as a lifestyle and tax write-off',
            'vibes with a poll in the group chat',
            'apologies as limited-edition stickers',
            'mute push notifications with aura',
            '{possessive} hobby as a productivity pivot',
            '{possessive} screen time using vibes per minute',
            'a group chat as a startup incubator',
            'a creator studio as a newsroom upgrade',
            '{possessive} to-do list as a cinematic universe',
            '{possessive} calendar as an escape room',
            'a fridge note as a breaking news ticker',
            '{possessive} laundry pile as a mood board',
            'air-frying leftovers like it is a cooking show finale',
            '{possessive} inbox as a competitive sport'
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
            'a delivery bot rolled up with live commentary'
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
            'the emoji budget has been completely exhausted.'
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
        ],
        scripted: [
            '{desk} {subject} is back with a plan to {object}. {impact}',
            '{subject} says {object} is the only way forward. {tag}',
            'Live update: {subject} just tried to {object} and the chat screamed. {impact}',
            '{subject} insists the real news is {object}. {impact}',
            '{desk} {subject} went on record about {object} and caused a ripple. {tag}',
            '{subject} is treating {object} like a season finale. {impact}',
            '{desk} {subject} declared {object} the new normal. {tag}',
            '{subject} returned with a fresh take on {object}. {impact}'
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
    const recentPicks = new Map();

    function getRecentList(key) {
        if (!recentPicks.has(key)) {
            recentPicks.set(key, []);
        }
        return recentPicks.get(key);
    }

    function rememberPick(key, value, limit = 3) {
        if (!value) return;
        const list = getRecentList(key);
        list.unshift(value);
        const trimmed = list.slice(0, limit);
        recentPicks.set(key, trimmed);
    }

    function pickWithRecent(list, key, limit = 3) {
        const recentList = getRecentList(key);
        const avoid = recentList.slice(0, limit);
        let candidate = pickRandom(list, avoid);
        if (!candidate) {
            candidate = pickRandom(list);
        }
        rememberPick(key, candidate, limit);
        return candidate;
    }

    function pickWeightedTemplate() {
        const recentTemplates = getRecentList('template');
        const candidate = pickRandom(templates, recentTemplates.slice(0, 2));
        rememberPick('template', candidate, 2);
        return candidate;
    }

    function buildHeadlineCandidate() {
        const template = pickWeightedTemplate();
        const rawSubject = pickRandom(
            beats.subjects,
            lastPayload ? [lastPayload.rawSubject] : []
        );
        const subject = normalizeSubject(rawSubject);
        const tokens = {
            possessive: subject.pronouns.possessive,
            object: subject.pronouns.object
        };

        const rawObject = pickWithRecent(beats.objects, 'object', 4);
        const rawTwist = pickWithRecent(beats.twists, 'twist', 3);
        const payload = {
            desk: pickWithRecent(beats.desks, 'desk', 2),
            subject: subject.text,
            verb: pickWithRecent(beats.verbs, 'verb', 3),
            object: applyTokens(rawObject, tokens),
            connector: pickWithRecent(beats.connectors, 'connector', 3),
            twist: applyTokens(rawTwist, tokens),
            impact: pickWithRecent(beats.impacts, 'impact', 3),
            tag: pickWithRecent(beats.tags, 'tag', 2),
            breakMark: pickWithRecent(beats.styleBreaks, 'breakMark', 2)
        };

        const useScripted = getSecureRandom() < 0.35;
        const scriptedTokens = {
            desk: payload.desk,
            subject: payload.subject,
            verb: payload.verb,
            object: payload.object,
            connector: payload.connector,
            twist: payload.twist,
            impact: payload.impact,
            tag: payload.tag,
            breakMark: payload.breakMark
        };
        const headline = useScripted
            ? applyTokens(
                  pickWithRecent(beats.scripted, 'scripted', 3),
                  scriptedTokens
              )
            : template(payload);
        const cleanedHeadline = headline.replace(/\s+/g, ' ').trim();
        lastPayload = { ...payload, rawSubject, rawObject, rawTwist };
        return cleanedHeadline;
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
