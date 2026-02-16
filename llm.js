const { data: neckassData } = window.Neckass || {};
const BEATS = neckassData?.BEATS || {};
const TEMPLATES = neckassData?.TEMPLATES || [];

const TINY_LLM_TIMEOUT_MS = 2400;
const GENERATION_DELAY_RANGE_MS = { min: 420, max: 880 };
const RECENT_HEADLINE_HISTORY = 12;
const RECENT_STORAGE_KEY = 'tinyLlmRecentHeadlines';
const MAX_RECENT_STORAGE = 24;
const MIN_FUNNY_SCORE = 5;
const MAX_QUALITY_ATTEMPTS = 10;
const MAX_DISPLAY_HEADLINE_CHARS = 140;

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

    function buildSubjectPayload(rawSubject) {
        const subject = normalizeSubject(rawSubject);
        const tokens = {
            possessive: subject.pronouns.possessive,
            object: subject.pronouns.object
        };
        return { subject, tokens };
    }

    function buildPayload(rawSubject) {
        const { subject, tokens } = buildSubjectPayload(rawSubject);
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

        return { payload, rawObject, rawTwist };
    }

    function toScriptedTokens(payload) {
        return {
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
    }

    function cleanHeadline(headline) {
        const normalized = headline.replace(/\s+/g, ' ').trim();
        if (normalized.length <= MAX_DISPLAY_HEADLINE_CHARS) {
            return normalized;
        }

        const clipped = normalized.slice(0, MAX_DISPLAY_HEADLINE_CHARS + 1);
        const boundary = Math.max(
            clipped.lastIndexOf('; '),
            clipped.lastIndexOf(': '),
            clipped.lastIndexOf(', '),
            clipped.lastIndexOf(' ')
        );
        const truncated = boundary > 80 ? clipped.slice(0, boundary) : clipped.slice(0, MAX_DISPLAY_HEADLINE_CHARS);
        return `${truncated.trimEnd()}...`;
    }

    function scoreHeadlineHumor(headline) {
        if (!headline || typeof headline !== 'string') return 0;

        const normalized = headline.toLowerCase();
        const humorSignals = [
            'group chat',
            'algorithm',
            'vibe check',
            'chaos',
            'side-eye',
            'season finale',
            'breaking news',
            'push notification',
            'soft pivot',
            'chat screamed',
            'houseplants',
            'autocorrect',
            'doomscrolling',
            '99+',
            'emoji budget',
            'dramatic sighing',
            'live commentary',
            'snack',
            'hot off',
            'cursed'
        ];

        let score = 0;
        humorSignals.forEach((phrase) => {
            if (normalized.includes(phrase)) {
                score += 1;
            }
        });

        if (/[;:]/.test(headline)) score += 1;
        if ((headline.match(/\./g) || []).length >= 2) score += 1;
        if (headline.length >= 90 && headline.length <= 190) score += 1;
        if (/\b(like it is|just tried to|insists|declared)\b/i.test(headline)) score += 1;

        return score;
    }

    function buildHeadlineCandidate() {
        const template = pickWeightedTemplate();
        const rawSubject = pickRandom(
            BEATS.subjects,
            lastPayload ? [lastPayload.rawSubject] : []
        );
        const { payload, rawObject, rawTwist } = buildPayload(rawSubject);
        const useScripted = getSecureRandom() < 0.58;
        const headline = useScripted
            ? applyTokens(
                  pickWithRecent(BEATS.scripted, 'scripted', 3),
                  toScriptedTokens(payload)
              )
            : template(payload);
        const cleanedHeadline = cleanHeadline(headline);
        lastPayload = { ...payload, rawSubject, rawObject, rawTwist };
        return cleanedHeadline;
    }

    function generateUniqueHeadline() {
        let attempt = 0;
        let bestHeadline = '';
        let bestScore = -1;
        const maxAttempts = RECENT_HEADLINE_HISTORY + MAX_QUALITY_ATTEMPTS;

        while (attempt < maxAttempts) {
            const candidate = buildHeadlineCandidate();
            if (isRecentlyUsed(candidate)) {
                attempt += 1;
                continue;
            }

            const score = scoreHeadlineHumor(candidate);
            if (score > bestScore) {
                bestHeadline = candidate;
                bestScore = score;
            }

            if (score >= MIN_FUNNY_SCORE) {
                return candidate;
            }

            attempt += 1;
        }

        return bestHeadline;
    }

    function resolveAfterDelay(task) {
        const { min, max } = GENERATION_DELAY_RANGE_MS;
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
