const { data: neckassData } = window.Neckass || {};
const BEATS = neckassData?.BEATS || {};
const TEMPLATES = neckassData?.TEMPLATES || [];

const TINY_LLM_TIMEOUT_MS = 2400;
const GENERATION_DELAY_RANGE_MS = { min: 420, max: 880 };
const RECENT_HEADLINE_HISTORY = 12;
const RECENT_STORAGE_KEY = 'tinyLlmRecentHeadlines';
const MAX_RECENT_STORAGE = 24;

const tinyLlmClient = (() => {

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
        const candidate = pickRandom(TEMPLATES, recentTemplates.slice(0, 2));
        rememberPick('template', candidate, 2);
        return candidate;
    }

    function buildHeadlineCandidate() {
        const template = pickWeightedTemplate();
        const rawSubject = pickRandom(
            BEATS.subjects,
            lastPayload ? [lastPayload.rawSubject] : []
        );
        const subject = normalizeSubject(rawSubject);
        const tokens = {
            possessive: subject.pronouns.possessive,
            object: subject.pronouns.object
        };

        const rawObject = pickWithRecent(BEATS.objects, 'object', 4);
        const rawTwist = pickWithRecent(BEATS.twists, 'twist', 3);
        const payload = {
            desk: pickWithRecent(BEATS.desks, 'desk', 2),
            subject: subject.text,
            verb: pickWithRecent(BEATS.verbs, 'verb', 3),
            object: applyTokens(rawObject, tokens),
            connector: pickWithRecent(BEATS.connectors, 'connector', 3),
            twist: applyTokens(rawTwist, tokens),
            impact: pickWithRecent(BEATS.impacts, 'impact', 3),
            tag: pickWithRecent(BEATS.tags, 'tag', 2),
            breakMark: pickWithRecent(BEATS.styleBreaks, 'breakMark', 2)
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
                  pickWithRecent(BEATS.scripted, 'scripted', 3),
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
