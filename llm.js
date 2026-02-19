const { data: neckassData } = window.Neckass || {};
const BEATS = neckassData?.BEATS || {};
const TEMPLATES = neckassData?.TEMPLATES || [];

const TINY_LLM_TIMEOUT_MS = 2400;
const WEBGPU_FIRST_RUN_TIMEOUT_BONUS_MS = 900;
const GENERATION_DELAY_RANGE_MS = { min: 420, max: 880 };
const RECENT_HEADLINE_HISTORY = 12;
const RECENT_STORAGE_KEY = 'tinyLlmRecentHeadlines';
const MODE_PRIOR_STORAGE_KEY = 'tinyLlmModePriors';
const TOKEN_PRIOR_STORAGE_KEY = 'tinyLlmTokenPriors';
const MAX_RECENT_STORAGE = 24;
const MAX_TOKEN_PRIOR_SIZE = 220;
const MIN_FUNNY_SCORE = 5;
const MAX_QUALITY_ATTEMPTS = 12;
const MAX_DISPLAY_HEADLINE_CHARS = 140;
const MIN_DISPLAY_HEADLINE_CHARS = 68;
const CANDIDATE_POOL_SIZE = 8;
const MODE_MEMORY = 6;
const SOFTMAX_TEMPERATURE = 0.85;
const MMR_LAMBDA = 0.78;

const STORY_MODES = [
    {
        id: 'bulletin',
        chance: 0.35,
        forceDesk: true,
        forceTag: true,
        scriptedBias: 0.62,
        humorSignals: ['breaking', 'dispatch', 'updates expected', 'developing story']
    },
    {
        id: 'live',
        chance: 0.35,
        forceDesk: false,
        forceTag: false,
        scriptedBias: 0.74,
        humorSignals: ['live update', 'chat screamed', 'season finale', 'press conference']
    },
    {
        id: 'analysis',
        chance: 0.3,
        forceDesk: false,
        forceTag: true,
        scriptedBias: 0.45,
        humorSignals: ['analysts', 'sources confirm', 'vibe check', 'performance art']
    }
];

const tinyLlmClient = (() => {
    const recentHeadlines = loadRecentHeadlines();
    const recentModes = [];
    const modePriors = loadPriorMap(MODE_PRIOR_STORAGE_KEY);
    const tokenPriors = loadPriorMap(TOKEN_PRIOR_STORAGE_KEY);
    const corpusTokenStats = buildCorpusTokenStats();
    let activeBackend = null;
    let webgpuWarmup = { attempted: false, ready: false };
    let lastGenerationDiagnostics = {
        backend: 'cpu-mock',
        warm: false,
        timeoutMs: TINY_LLM_TIMEOUT_MS,
        fallback: null
    };
    let hasCompletedWebGpuGeneration = false;

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
        if (typeof localStorage === 'undefined') return [];
        try {
            const stored = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY));
            return Array.isArray(stored) ? stored.filter(Boolean) : [];
        } catch (error) {
            return [];
        }
    }

    function loadPriorMap(key) {
        if (typeof localStorage === 'undefined') return {};
        try {
            const stored = JSON.parse(localStorage.getItem(key));
            return stored && typeof stored === 'object' ? stored : {};
        } catch (error) {
            return {};
        }
    }

    function persistPriorMap(key, mapObject, maxSize) {
        if (typeof localStorage === 'undefined') return;
        try {
            const entries = Object.entries(mapObject)
                .filter(([, value]) => Number.isFinite(value))
                .sort((a, b) => b[1] - a[1])
                .slice(0, maxSize);
            localStorage.setItem(key, JSON.stringify(Object.fromEntries(entries)));
        } catch (error) {
            return;
        }
    }

    function updatePrior(mapObject, key, reward, floor = -6, ceil = 8) {
        const current = Number.isFinite(mapObject[key]) ? mapObject[key] : 0;
        const updated = Math.max(floor, Math.min(ceil, current + reward));
        mapObject[key] = updated;
    }

    function persistRecentHeadlines(headlines) {
        if (typeof localStorage === 'undefined') return;
        try {
            localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(headlines.slice(0, MAX_RECENT_STORAGE)));
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

    function rememberMode(modeId) {
        if (!modeId) return;
        recentModes.unshift(modeId);
        if (recentModes.length > MODE_MEMORY) {
            recentModes.pop();
        }
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
        recentPicks.set(key, list.slice(0, limit));
    }

    function pickWithRecent(list, key, limit = 3) {
        const recentList = getRecentList(key);
        const avoid = recentList.slice(0, limit);
        let candidate = pickRandom(list, avoid);
        if (!candidate) candidate = pickRandom(list);
        rememberPick(key, candidate, limit);
        return candidate;
    }

    function pickWeightedTemplate() {
        const recentTemplates = getRecentList('template');
        const candidate = pickRandom(TEMPLATES, recentTemplates.slice(0, 2));
        rememberPick('template', candidate, 2);
        return candidate;
    }

    function countRecentModes() {
        return recentModes.reduce((counts, modeId) => {
            counts[modeId] = (counts[modeId] || 0) + 1;
            return counts;
        }, {});
    }

    function pickStoryMode() {
        const modeCounts = countRecentModes();
        const weightedModes = STORY_MODES.map((mode) => {
            const recencyPenalty = 1 / (1 + (modeCounts[mode.id] || 0));
            const priorBias = 1 + ((modePriors[mode.id] || 0) * 0.08);
            return {
                mode,
                weight: Math.max(0.01, mode.chance * recencyPenalty * priorBias)
            };
        });

        const total = weightedModes.reduce((sum, entry) => sum + entry.weight, 0);
        if (total <= 0) return STORY_MODES[0];

        const roll = getSecureRandom() * total;
        let cursor = 0;
        for (const entry of weightedModes) {
            cursor += entry.weight;
            if (roll <= cursor) return entry.mode;
        }

        return STORY_MODES[0];
    }

    function buildSubjectPayload(rawSubject) {
        const subject = normalizeSubject(rawSubject);
        return {
            subject,
            tokens: {
                possessive: subject.pronouns.possessive,
                object: subject.pronouns.object
            }
        };
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

    function maybeAttachTag(headline, tag, shouldAttach) {
        if (!headline || !tag || !shouldAttach || headline.includes(tag)) return headline;
        return `${headline} ${tag}`;
    }

    function cleanHeadline(headline) {
        const normalized = (headline || '').replace(/\s+/g, ' ').trim();
        if (normalized.length <= MAX_DISPLAY_HEADLINE_CHARS) return normalized;

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

    function tokenize(text) {
        return (text || '')
            .toLowerCase()
            .replace(/[^a-z0-9+\s]/g, ' ')
            .split(/\s+/)
            .filter((token) => token.length > 2);
    }

    function tokenSetSimilaritySets(left, right) {
        if (left.size === 0 || right.size === 0) return 0;

        let intersection = 0;
        left.forEach((token) => {
            if (right.has(token)) intersection += 1;
        });

        const union = left.size + right.size - intersection;
        return union > 0 ? intersection / union : 0;
    }

    function tokenSetSimilarity(a, b) {
        return tokenSetSimilaritySets(new Set(tokenize(a)), new Set(tokenize(b)));
    }

    function buildCorpusTokenStats() {
        const fields = ['desks', 'subjects', 'verbs', 'objects', 'connectors', 'twists', 'impacts', 'tags', 'scripted'];
        const counts = {};
        let documents = 0;

        fields.forEach((field) => {
            const source = BEATS[field] || [];
            source.forEach((entry) => {
                const raw = typeof entry === 'string' ? entry : entry?.text || '';
                const tokens = new Set(tokenize(raw));
                if (tokens.size === 0) return;
                documents += 1;
                tokens.forEach((token) => {
                    counts[token] = (counts[token] || 0) + 1;
                });
            });
        });

        return { counts, documents: Math.max(1, documents) };
    }

    function scoreHeadlineHumor(headline, mode) {
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
            if (normalized.includes(phrase)) score += 1;
        });

        if (mode?.humorSignals?.length) {
            mode.humorSignals.forEach((phrase) => {
                if (normalized.includes(phrase)) score += 1;
            });
        }

        if (/[;:]/.test(headline)) score += 1;
        if ((headline.match(/\./g) || []).length >= 2) score += 1;
        if (headline.length >= 90 && headline.length <= 190) score += 1;
        if (headline.length >= MIN_DISPLAY_HEADLINE_CHARS) score += 1;
        if (/\b(like it is|just tried to|insists|declared)\b/i.test(headline)) score += 1;
        if (/\b(breaking|alert|live update|sources|analysts|developing)\b/i.test(headline)) score += 1;

        return score;
    }

    function scoreCoherence(headline) {
        if (!headline) return 0;

        const words = tokenize(headline);
        const uniqueWords = new Set(words);
        const uniqueRatio = words.length ? uniqueWords.size / words.length : 0;

        let score = 0;
        if (/^[A-Z]/.test(headline)) score += 1;
        if (/[.!?]$/.test(headline)) score += 1;
        if (!/(\b\w+\b)(\s+\1\b)/i.test(headline)) score += 1;
        if (uniqueRatio >= 0.7) score += 1;
        if (!/\.{4,}/.test(headline)) score += 0.5;

        return score;
    }

    function scoreNovelty(headline, poolHeadlines) {
        const historical = recentHeadlines.slice(0, RECENT_HEADLINE_HISTORY);
        const maxHistoricalSimilarity = historical.reduce(
            (max, item) => Math.max(max, tokenSetSimilarity(headline, item)),
            0
        );

        const maxPoolSimilarity = poolHeadlines.reduce(
            (max, item) => Math.max(max, tokenSetSimilarity(headline, item)),
            0
        );

        const noveltyFromHistory = 1 - maxHistoricalSimilarity;
        const noveltyFromPool = 1 - maxPoolSimilarity;

        return (noveltyFromHistory * 3) + (noveltyFromPool * 2);
    }

    function scoreInformativeness(headline) {
        const tokens = tokenize(headline);
        if (tokens.length === 0) return 0;

        const { counts, documents } = corpusTokenStats;
        const idfTotal = tokens.reduce((sum, token) => {
            const frequency = counts[token] || 0;
            const idf = Math.log((documents + 1) / (frequency + 1));
            return sum + idf;
        }, 0);

        return Math.min(4, idfTotal / tokens.length);
    }

    function scorePriorAlignment(headline, mode) {
        const modeBonus = (modePriors[mode.id] || 0) * 0.35;
        const tokenBonus = tokenize(headline)
            .slice(0, 9)
            .reduce((sum, token) => sum + ((tokenPriors[token] || 0) * 0.05), 0);
        return modeBonus + tokenBonus;
    }

    function selectTemplateByMode(mode) {
        if (!Array.isArray(TEMPLATES) || TEMPLATES.length === 0) {
            return () => '';
        }
        if (mode.id === 'bulletin') {
            return pickRandom(TEMPLATES.slice(0, 5)) || pickWeightedTemplate();
        }
        if (mode.id === 'analysis') {
            return pickRandom(TEMPLATES.slice(3)) || pickWeightedTemplate();
        }
        return pickWeightedTemplate();
    }

    function buildHeadlineCandidate() {
        const mode = pickStoryMode();
        const template = selectTemplateByMode(mode);
        const rawSubject = pickRandom(BEATS.subjects, lastPayload ? [lastPayload.rawSubject] : []);
        const { payload, rawObject, rawTwist } = buildPayload(rawSubject);
        const useScripted = getSecureRandom() < mode.scriptedBias;

        const baseHeadline = useScripted
            ? applyTokens(pickWithRecent(BEATS.scripted, 'scripted', 3), toScriptedTokens(payload))
            : template(payload);

        const withModeTone = maybeAttachTag(baseHeadline, payload.tag, mode.forceTag);
        const withDeskTone = mode.forceDesk && !withModeTone.startsWith(payload.desk)
            ? `${payload.desk} ${withModeTone}`
            : withModeTone;

        const cleanedHeadline = cleanHeadline(withDeskTone);
        lastPayload = { ...payload, rawSubject, rawObject, rawTwist };

        return {
            headline: cleanedHeadline,
            mode,
            tokenSet: new Set(tokenize(cleanedHeadline))
        };
    }

    function scoreCandidate(candidate, poolHeadlines, similarityScores = {}) {
        const humor = scoreHeadlineHumor(candidate.headline, candidate.mode);
        const coherence = scoreCoherence(candidate.headline);
        const novelty = similarityScores.novelty ?? scoreNovelty(candidate.headline, poolHeadlines);
        const informativeness = scoreInformativeness(candidate.headline);
        const priorAlignment = scorePriorAlignment(candidate.headline, candidate.mode);
        const rhythmBonus = /[;:.]/.test(candidate.headline) ? 1 : 0;

        const total = (humor * 1.35)
            + (coherence * 1.15)
            + novelty
            + (informativeness * 0.9)
            + priorAlignment
            + rhythmBonus;

        return {
            total,
            humor,
            coherence,
            novelty,
            informativeness,
            priorAlignment
        };
    }

    function selectBySoftmax(candidates) {
        const scaled = candidates.map((candidate) => ({
            candidate,
            weight: Math.exp(candidate.score.total / SOFTMAX_TEMPERATURE)
        }));
        const total = scaled.reduce((sum, entry) => sum + entry.weight, 0);
        if (total <= 0) return candidates[0];

        let cursor = 0;
        const roll = getSecureRandom() * total;
        for (const entry of scaled) {
            cursor += entry.weight;
            if (roll <= cursor) {
                return entry.candidate;
            }
        }

        return candidates[0];
    }

    function rankByMMR(scoredPool, similarityMatrix = []) {
        const ranked = [];
        const remaining = scoredPool.slice();

        while (remaining.length > 0) {
            let bestIndex = 0;
            let bestValue = -Infinity;

            remaining.forEach((candidate, index) => {
                const similarityPenalty = ranked.length
                    ? ranked.reduce((max, selected) => {
                        const pairSimilarity = similarityMatrix[candidate.poolIndex]?.[selected.poolIndex]
                            ?? tokenSetSimilarity(candidate.headline, selected.headline);
                        return Math.max(max, pairSimilarity);
                    }, 0)
                    : 0;

                const mmrScore = (MMR_LAMBDA * candidate.score.total)
                    - ((1 - MMR_LAMBDA) * similarityPenalty * 6);

                if (mmrScore > bestValue) {
                    bestValue = mmrScore;
                    bestIndex = index;
                }
            });

            ranked.push(remaining.splice(bestIndex, 1)[0]);
        }

        return ranked;
    }

    function buildSimilarityMatrix(pool) {
        const matrix = pool.map(() => pool.map(() => 0));
        for (let leftIndex = 0; leftIndex < pool.length; leftIndex += 1) {
            for (let rightIndex = leftIndex + 1; rightIndex < pool.length; rightIndex += 1) {
                const similarity = tokenSetSimilaritySets(pool[leftIndex].tokenSet, pool[rightIndex].tokenSet);
                matrix[leftIndex][rightIndex] = similarity;
                matrix[rightIndex][leftIndex] = similarity;
            }
        }
        return matrix;
    }

    async function warmupWebGpuBackend() {
        if (webgpuWarmup.attempted) return webgpuWarmup;
        webgpuWarmup = { attempted: true, ready: false };

        if (typeof navigator === 'undefined' || !navigator.gpu?.requestAdapter) {
            return webgpuWarmup;
        }

        try {
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) return webgpuWarmup;
            const device = await adapter.requestDevice();
            if (!device) return webgpuWarmup;
            webgpuWarmup = { attempted: true, ready: true };
            return webgpuWarmup;
        } catch (error) {
            return webgpuWarmup;
        }
    }

    function scheduleBackendWarmup() {
        if (typeof window === 'undefined' || webgpuWarmup.attempted) return;
        window.setTimeout(() => {
            warmupWebGpuBackend();
        }, 120);
    }

    async function selectGenerationBackend() {
        if (activeBackend) {
            return activeBackend;
        }

        const webGpuState = await warmupWebGpuBackend();
        activeBackend = webGpuState.ready
            ? { id: 'webgpu-similarity', isWarm: true }
            : { id: 'cpu-mock', isWarm: true };

        return activeBackend;
    }

    function updateLearningSignals(chosen) {
        if (!chosen || !chosen.mode) return;

        const score = chosen.score || { total: 0, novelty: 0 };
        const normalizedReward = Math.max(-0.25, Math.min(0.35, (score.total - 9) / 28));
        const noveltyReward = Math.max(-0.2, Math.min(0.3, (score.novelty - 2) / 8));
        const reward = normalizedReward + noveltyReward;

        updatePrior(modePriors, chosen.mode.id, reward);
        tokenize(chosen.headline)
            .slice(0, 10)
            .forEach((token) => updatePrior(tokenPriors, token, reward * 0.8, -3, 4));

        persistPriorMap(MODE_PRIOR_STORAGE_KEY, modePriors, STORY_MODES.length + 2);
        persistPriorMap(TOKEN_PRIOR_STORAGE_KEY, tokenPriors, MAX_TOKEN_PRIOR_SIZE);
    }

    function generateUniqueHeadline() {
        let attempt = 0;
        const maxAttempts = RECENT_HEADLINE_HISTORY + MAX_QUALITY_ATTEMPTS;
        const pool = [];

        while (attempt < maxAttempts && pool.length < CANDIDATE_POOL_SIZE) {
            const candidate = buildHeadlineCandidate();
            if (!candidate.headline || candidate.headline.length < MIN_DISPLAY_HEADLINE_CHARS) {
                attempt += 1;
                continue;
            }
            if (isRecentlyUsed(candidate.headline)) {
                attempt += 1;
                continue;
            }

            pool.push(candidate);
            attempt += 1;
        }

        if (pool.length === 0) {
            const fallback = buildHeadlineCandidate();
            rememberMode(fallback.mode.id);
            return fallback.headline;
        }

        const similarityMatrix = buildSimilarityMatrix(pool);

        const scoredPool = pool.map((candidate, index) => {
            const peerHeadlines = pool
                .filter((item, peerIndex) => peerIndex !== index)
                .map((item) => item.headline);
            const novelty = 5
                - Math.max(
                    recentHeadlines
                        .slice(0, RECENT_HEADLINE_HISTORY)
                        .reduce((max, item) => Math.max(max, tokenSetSimilarity(candidate.headline, item)), 0),
                    similarityMatrix[index].reduce((max, similarity) => Math.max(max, similarity), 0)
                ) * 5;
            return {
                ...candidate,
                poolIndex: index,
                score: scoreCandidate(candidate, peerHeadlines, { novelty })
            };
        });

        const ranked = rankByMMR(scoredPool, similarityMatrix);
        const shortlist = ranked.slice(0, 3);
        const picked = shortlist.length === 1
            ? shortlist[0]
            : selectBySoftmax(shortlist);

        const finalSelection = picked.score.humor >= MIN_FUNNY_SCORE
            ? picked
            : ranked[0];

        rememberMode(finalSelection.mode.id);
        updateLearningSignals(finalSelection);
        return finalSelection.headline;
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
        const backend = await selectGenerationBackend();
        const firstWebGpuRun = backend.id === 'webgpu-similarity' && !hasCompletedWebGpuGeneration;
        const timeoutMs = TINY_LLM_TIMEOUT_MS + (firstWebGpuRun ? WEBGPU_FIRST_RUN_TIMEOUT_BONUS_MS : 0);

        const generation = resolveAfterDelay(() => {
            const headline = generateUniqueHeadline();
            if (!headline || headline.trim().length === 0) {
                throw new Error('Empty generation result');
            }
            rememberHeadline(headline);
            lastGenerationDiagnostics = {
                backend: backend.id,
                warm: backend.id === 'webgpu-similarity' ? !firstWebGpuRun : true,
                timeoutMs,
                fallback: null
            };
            if (backend.id === 'webgpu-similarity') {
                hasCompletedWebGpuGeneration = true;
            }
            return headline;
        });

        const timeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Generation timed out')), timeoutMs);
        });

        try {
            return await Promise.race([generation, timeout]);
        } catch (error) {
            lastGenerationDiagnostics = {
                backend: backend.id,
                warm: backend.id === 'webgpu-similarity' ? hasCompletedWebGpuGeneration : true,
                timeoutMs,
                fallback: error?.message || 'generation-error'
            };
            throw error;
        }
    }

    scheduleBackendWarmup();

    return {
        generateHeadline,
        getLastDiagnostics() {
            return { ...lastGenerationDiagnostics };
        }
    };
})();

if (typeof window !== 'undefined') {
    window.tinyLlmClient = tinyLlmClient;
}
