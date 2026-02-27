const { data: neckassData } = window.Neckass || {};
const BEATS = neckassData?.BEATS || {};

const TINY_LLM_TIMEOUT_MS = 1800;
const GENERATION_DELAY_RANGE_MS = { min: 280, max: 720 };
const LEGACY_RECENT_STORAGE_KEY = 'tinyLlmRecentHeadlines';
const RECENT_STORAGE_KEY = 'tinyLlmV2Recent';
const MAX_RECENT_STORAGE = 60;
const DUPLICATE_WINDOW = 30;
const NEAR_DUPLICATE_WINDOW = 10;
const MIN_LENGTH = 45;
const TARGET_MAX_LENGTH = 110;
const HARD_MAX_LENGTH = 140;
const CANDIDATE_MIN = 12;
const CANDIDATE_MAX = 24;

const SECTION_HINTS = {
    latest: ['breaking', 'local', 'headline', 'update', 'report'],
    world: ['global', 'federal', 'ambassador', 'treaty', 'space', 'climate'],
    culture: ['podcast', 'club', 'newsletter', 'fashion', 'book', 'spotify', 'instagram'],
    tech: ['ai', 'app', 'algorithm', 'wifi', 'discord', 'stream', 'cloud', 'bot'],
    oddities: ['cursed', 'weird', 'ghost', 'zodiac', 'manifest', 'meme', 'chaos']
};

const HARASSMENT_TERMS = ['idiot', 'moron', 'stupid', 'hate', 'loser'];

const tinyLlmClient = (() => {
    let lastDiagnostics = {
        backend: 'v2-heuristic',
        timeoutMs: TINY_LLM_TIMEOUT_MS,
        fallback: null,
        warm: true,
        reasonCodes: []
    };

    function canUseLocalStorage() {
        return typeof localStorage !== 'undefined';
    }

    function safeJsonParse(raw, fallback) {
        try {
            const parsed = JSON.parse(raw);
            return parsed ?? fallback;
        } catch (error) {
            return fallback;
        }
    }

    function loadRecentEntries() {
        if (!canUseLocalStorage()) return [];

        const v2Stored = safeJsonParse(localStorage.getItem(RECENT_STORAGE_KEY), []);
        if (Array.isArray(v2Stored) && v2Stored.length > 0) {
            return v2Stored
                .filter((entry) => entry && typeof entry.headline === 'string' && entry.headline.trim())
                .slice(0, MAX_RECENT_STORAGE);
        }

        const legacyStored = safeJsonParse(localStorage.getItem(LEGACY_RECENT_STORAGE_KEY), []);
        if (!Array.isArray(legacyStored) || legacyStored.length === 0) return [];

        const nowIso = new Date().toISOString();
        const migrated = legacyStored
            .filter(Boolean)
            .slice(0, MAX_RECENT_STORAGE)
            .map((headline) => ({ headline, generatedAt: nowIso, section: 'latest' }));

        persistRecentEntries(migrated);
        return migrated;
    }

    function persistRecentEntries(entries) {
        if (!canUseLocalStorage()) return;
        try {
            localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_RECENT_STORAGE)));
        } catch (error) {
            return;
        }
    }

    const recentEntries = loadRecentEntries();

    function addRecentEntry(result) {
        recentEntries.unshift({
            headline: result.headline,
            generatedAt: result.generatedAt,
            section: result.section
        });

        if (recentEntries.length > MAX_RECENT_STORAGE) {
            recentEntries.length = MAX_RECENT_STORAGE;
        }

        persistRecentEntries(recentEntries);
    }

    function createSeededRng(seed) {
        let state = (seed >>> 0) || 1;
        return () => {
            state = (1664525 * state + 1013904223) >>> 0;
            return state / 0x100000000;
        };
    }

    function getRandom(rng) {
        if (typeof rng === 'function') return rng();
        if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
            const buffer = new Uint32Array(1);
            crypto.getRandomValues(buffer);
            return buffer[0] / 0x100000000;
        }
        return Math.random();
    }

    function pick(list, rng) {
        if (!Array.isArray(list) || list.length === 0) return '';
        return list[Math.floor(getRandom(rng) * list.length)] || '';
    }

    function normalizeText(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function tokenize(value) {
        const normalized = normalizeText(value).toLowerCase();
        if (!normalized) return [];

        if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
            const segmenter = new Intl.Segmenter('en', { granularity: 'word' });
            return Array.from(segmenter.segment(normalized))
                .map((entry) => entry.segment)
                .filter((segment) => /[a-z0-9]/.test(segment));
        }

        return normalized.split(/[^a-z0-9]+/).filter(Boolean);
    }

    function formatSentenceCase(text) {
        const normalized = normalizeText(text);
        if (!normalized) return '';
        const withoutTrailingPunctuation = normalized.replace(/[!?]+$/g, '');
        return withoutTrailingPunctuation.charAt(0).toUpperCase() + withoutTrailingPunctuation.slice(1);
    }

    function clampHeadlineLength(text) {
        const normalized = normalizeText(text);
        if (normalized.length <= HARD_MAX_LENGTH) return normalized;
        const clipped = normalized.slice(0, HARD_MAX_LENGTH + 1);
        const boundary = Math.max(clipped.lastIndexOf('; '), clipped.lastIndexOf(', '), clipped.lastIndexOf(' '));
        const safe = boundary > 60 ? clipped.slice(0, boundary) : clipped.slice(0, HARD_MAX_LENGTH);
        return safe.trim();
    }

    function inferSectionFromText(text) {
        const tokens = new Set(tokenize(text));
        let bestSection = 'latest';
        let bestScore = 0;

        Object.entries(SECTION_HINTS).forEach(([section, hints]) => {
            const score = hints.reduce((acc, hint) => acc + (tokens.has(hint) ? 1 : 0), 0);
            if (score > bestScore) {
                bestSection = section;
                bestScore = score;
            }
        });

        return bestSection;
    }

    function headlineTokenOverlap(left, right) {
        const a = new Set(tokenize(left));
        const b = new Set(tokenize(right));
        if (!a.size || !b.size) return 0;
        let intersection = 0;
        a.forEach((token) => {
            if (b.has(token)) intersection += 1;
        });
        return intersection / Math.max(a.size, b.size);
    }

    function buildPayload(section, rng) {
        const subject = pick(BEATS.subjects, rng);
        const normalizedSubject = typeof subject === 'object' ? subject.text : subject;
        const possessive = typeof subject === 'object' ? subject?.pronouns?.possessive || 'their' : 'their';
        const objectPhrase = String(pick(BEATS.objects, rng) || '').replace('{possessive}', possessive);
        const twist = String(pick(BEATS.twists, rng) || '').replace('{possessive}', possessive);

        return {
            desk: pick(BEATS.desks, rng),
            subject: normalizedSubject || 'someone online',
            verb: pick(BEATS.verbs, rng),
            object: objectPhrase,
            connector: pick(BEATS.connectors, rng),
            twist,
            impact: pick(BEATS.impacts, rng),
            section,
            marker: pick(SECTION_HINTS[section] || SECTION_HINTS.latest, rng)
        };
    }

    function synthesizeCandidate(payload, rng) {
        const patterns = [
            `${payload.desk} ${payload.subject} ${payload.verb} ${payload.object} ${payload.connector} ${payload.twist}; ${payload.impact}`,
            `${payload.subject} ${payload.verb} ${payload.object} while ${payload.marker} watchers refresh dashboards; ${payload.impact}`,
            `Breaking: ${payload.subject} ${payload.verb} ${payload.object}, because ${payload.twist}; ${payload.impact}`,
            `${payload.desk} ${payload.subject} frames ${payload.marker} as the real story and ${payload.verb} ${payload.object}; ${payload.impact}`
        ];

        return clampHeadlineLength(formatSentenceCase(pick(patterns, rng)));
    }

    function looksSafeTone(headline) {
        const normalized = headline.toLowerCase();
        return !HARASSMENT_TERMS.some((term) => normalized.includes(term));
    }

    function scoreCandidate(candidate, options, recentHeadlines) {
        const reasonCodes = [];
        let score = 0;
        const tokens = tokenize(candidate.headline);

        if (candidate.section === options.section || options.section === 'latest') {
            score += 0.22;
            reasonCodes.push('section-match');
        }

        const queryTokens = tokenize(options.query);
        if (queryTokens.length) {
            const overlap = queryTokens.filter((token) => tokens.includes(token)).length;
            const queryScore = overlap / queryTokens.length;
            score += queryScore * 0.35;
            if (queryScore > 0) reasonCodes.push('query-match');
        }

        const duplicates = recentHeadlines.slice(0, DUPLICATE_WINDOW);
        if (!duplicates.includes(candidate.headline)) {
            score += 0.18;
            reasonCodes.push('not-recent-duplicate');
        }

        const nearWindow = recentHeadlines.slice(0, NEAR_DUPLICATE_WINDOW);
        const maxOverlap = nearWindow.reduce((max, item) => Math.max(max, headlineTokenOverlap(candidate.headline, item)), 0);
        score += (1 - maxOverlap) * 0.2;
        if (maxOverlap < 0.5) reasonCodes.push('novel-structure');

        const length = candidate.headline.length;
        if (length >= MIN_LENGTH && length <= TARGET_MAX_LENGTH) {
            score += 0.15;
            reasonCodes.push('target-length');
        } else if (length <= HARD_MAX_LENGTH) {
            score += 0.07;
        }

        if (looksSafeTone(candidate.headline)) {
            score += 0.1;
            reasonCodes.push('tone-safe');
        }

        return {
            score: Math.max(0, Math.min(1, score)),
            reasonCodes
        };
    }

    function buildCandidates(options, rng) {
        const total = CANDIDATE_MIN + Math.floor(getRandom(rng) * (CANDIDATE_MAX - CANDIDATE_MIN + 1));
        const section = options.section && SECTION_HINTS[options.section] ? options.section : 'latest';

        return Array.from({ length: total }).map(() => {
            const weightedSection = section === 'latest' && getRandom(rng) < 0.35
                ? pick(['world', 'culture', 'tech', 'oddities'], rng)
                : section;
            const payload = buildPayload(weightedSection, rng);
            const queryToken = tokenize(options.query || '')[0];
            const generated = synthesizeCandidate(payload, rng);
            const headline = queryToken && getRandom(rng) < 0.55 && !generated.toLowerCase().includes(queryToken)
                ? clampHeadlineLength(`${generated} as ${queryToken} chatter keeps climbing`)
                : generated;
            return {
                headline,
                section: weightedSection
            };
        });
    }

    function pickBestCandidate(candidates, options, threshold) {
        const recent = recentEntries.map((entry) => entry.headline);
        const excluded = new Set((options.exclude || []).map((value) => normalizeText(value).toLowerCase()));

        const scored = candidates
            .filter((candidate) => {
                const normalized = normalizeText(candidate.headline).toLowerCase();
                if (!normalized || normalized.length > HARD_MAX_LENGTH) return false;
                if (excluded.has(normalized)) return false;
                if (recent.slice(0, DUPLICATE_WINDOW).includes(candidate.headline)) return false;
                return true;
            })
            .map((candidate) => {
                const result = scoreCandidate(candidate, options, recent);
                return {
                    ...candidate,
                    confidence: result.score,
                    reasonCodes: result.reasonCodes
                };
            })
            .sort((a, b) => b.confidence - a.confidence);

        return scored.find((candidate) => candidate.confidence >= threshold) || null;
    }

    function resolveAfterDelay(task, rng) {
        const { min, max } = GENERATION_DELAY_RANGE_MS;
        const delay = min + Math.floor(getRandom(rng) * (max - min + 1));
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

    async function generateHeadline(options = {}) {
        const request = {
            section: normalizeText(options.section || 'latest').toLowerCase(),
            source: options.source || 'any',
            query: normalizeText(options.query || ''),
            exclude: Array.isArray(options.exclude) ? options.exclude : [],
            seed: Number.isInteger(options.seed) ? options.seed : null
        };

        const rng = request.seed !== null ? createSeededRng(request.seed) : null;
        const runGeneration = () => {
            const candidates = buildCandidates(request, rng);
            let picked = pickBestCandidate(candidates, request, 0.52);
            if (!picked) {
                picked = pickBestCandidate(candidates, request, 0.42);
            }

            if (!picked) {
                const error = new Error('v2-no-eligible-candidate');
                error.code = 'NO_ELIGIBLE_CANDIDATE';
                throw error;
            }

            const result = {
                headline: picked.headline,
                section: inferSectionFromText(picked.headline) || picked.section || 'latest',
                confidence: picked.confidence,
                reasonCodes: picked.reasonCodes,
                generatedAt: new Date().toISOString()
            };

            addRecentEntry(result);
            lastDiagnostics = {
                backend: 'v2-heuristic',
                timeoutMs: TINY_LLM_TIMEOUT_MS,
                fallback: null,
                warm: true,
                reasonCodes: picked.reasonCodes
            };
            return result;
        };

        const generation = resolveAfterDelay(runGeneration, rng);
        const timeout = new Promise((_, reject) => {
            setTimeout(() => {
                const error = new Error('Generation timed out');
                error.code = 'GENERATION_TIMEOUT';
                reject(error);
            }, TINY_LLM_TIMEOUT_MS);
        });

        try {
            return await Promise.race([generation, timeout]);
        } catch (error) {
            lastDiagnostics = {
                backend: 'v2-heuristic',
                timeoutMs: TINY_LLM_TIMEOUT_MS,
                fallback: error?.code || error?.message || 'generation-error',
                warm: true,
                reasonCodes: []
            };
            throw error;
        }
    }

    return {
        generateHeadline,
        getLastDiagnostics() {
            return { ...lastDiagnostics };
        }
    };
})();

if (typeof window !== 'undefined') {
    window.tinyLlmClient = tinyLlmClient;
    window.tinyLlmClientV2 = tinyLlmClient;
}
