const TINY_LLM_TIMEOUT_MS = 2400;
const MAX_GENERATION_ATTEMPTS = 5;
const HEADLINE_MEMORY_LIMIT = 64;

const tinyLlmClient = (() => {
    const prefixes = [
        'Hot off the tiny press:',
        'Edge model whispers:',
        'Breaking from the pocket newsroom:',
        'Local dispatch:',
        'From the on-device desk:'
    ];

    const subjects = [
        'Neckass',
        'a sleep-deprived influencer',
        'the neighborhood Wi-Fi sleuth',
        'a snack-fueled podcaster',
        'an overcaffeinated mod'
    ];

    const actions = [
        'liveblogs his grocery run like it is Sundance',
        'declares dark mode a lifestyle and a tax write-off',
        'tries to crowdsourcing vibes with a Google Form',
        'launches a startup that only sells apologies as NFTs',
        'hosts a webinar on how to mute push notifications with aura'
    ];

    const endings = [
        'sources say the backlog of screenshots is heroic.',
        'the algorithm remains unconvinced.',
        'commenters are already drafting dissertations.',
        'eyewitnesses report zero chill and maximum tabs.',
        'forecast calls for 90% chance of group chat drama.'
    ];

    const tokenBags = {
        prefix: createTokenBag(prefixes),
        subject: createTokenBag(subjects),
        action: createTokenBag(actions),
        ending: createTokenBag(endings)
    };

    const recentHeadlines = new Set();
    let lastHeadline = '';

    function createTokenBag(values) {
        const tokens = [...values];
        let cursor = shuffle(tokens);

        return {
            next() {
                if (cursor.length === 0) {
                    cursor = shuffle(tokens);
                }
                return cursor.shift();
            }
        };
    }

    function shuffle(list) {
        const items = [...list];
        for (let i = items.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        return items;
    }

    function buildCandidate() {
        return `${tokenBags.prefix.next()} ${tokenBags.subject.next()} ${tokenBags.action.next()} ${tokenBags.ending.next()}`;
    }

    function normalizeHeadline(headlineText) {
        const cleaned = headlineText.replace(/\s+/g, ' ').trim();
        if (!cleaned.endsWith('.')) {
            return `${cleaned}.`;
        }
        return cleaned;
    }

    function rememberHeadline(text) {
        recentHeadlines.add(text);
        if (recentHeadlines.size > HEADLINE_MEMORY_LIMIT) {
            const [oldest] = recentHeadlines;
            recentHeadlines.delete(oldest);
        }
        lastHeadline = text;
    }

    function isFreshCandidate(text) {
        return text && text !== lastHeadline && !recentHeadlines.has(text);
    }

    function generateCandidateHeadline() {
        for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
            const candidate = normalizeHeadline(buildCandidate());
            if (isFreshCandidate(candidate)) {
                rememberHeadline(candidate);
                return candidate;
            }
        }

        const fallback = normalizeHeadline(buildCandidate());
        rememberHeadline(fallback);
        return fallback;
    }

    function withTimeout(promise) {
        const timeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Generation timed out')), TINY_LLM_TIMEOUT_MS);
        });
        return Promise.race([promise, timeout]);
    }

    async function generateHeadline() {
        const generation = new Promise((resolve, reject) => {
            const delay = 450 + Math.floor(Math.random() * 700);
            setTimeout(() => {
                try {
                    const headline = generateCandidateHeadline();
                    if (!headline || headline.trim().length === 0) {
                        reject(new Error('Empty generation result'));
                        return;
                    }
                    resolve(headline);
                } catch (error) {
                    reject(error);
                }
            }, delay);
        });

        return withTimeout(generation);
    }

    return { generateHeadline };
})();

if (typeof window !== 'undefined') {
    window.tinyLlmClient = tinyLlmClient;
}
