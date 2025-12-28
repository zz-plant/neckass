const TINY_LLM_TIMEOUT_MS = 2400;
const GENERATION_DELAY_RANGE_MS = { min: 420, max: 880 };
const RECENT_HEADLINE_HISTORY = 10;

const tinyLlmClient = (() => {
    const prefixes = [
        'Hot off the tiny press:',
        'Edge model whispers:',
        'Breaking from the pocket newsroom:',
        'Local dispatch:',
        'From the on-device desk:',
        'Field note from the microwave newsroom:',
        'Signal picked up from the couch bureau:'
    ];

    const subjects = [
        'Neckass',
        'a sleep-deprived influencer',
        'the neighborhood Wi-Fi sleuth',
        'a snack-fueled podcaster',
        'an overcaffeinated mod',
        'a Bluetooth astrologer',
        'the late-night content gremlin'
    ];

    const actionOpeners = [
        'liveblogs',
        'declares',
        'tries to crowdsource',
        'launches a startup that only sells',
        'hosts a webinar on how to',
        'rebrands',
        'attempts to benchmark'
    ];

    const actionDetails = [
        'his grocery run like it is Sundance',
        'dark mode a lifestyle and a tax write-off',
        'vibes with a Google Form',
        'apologies as NFTs',
        'mute push notifications with aura',
        'his hobby as a productivity pivot',
        'his screen time using vibes per minute'
    ];

    const connectors = [
        'after',
        'while',
        'because',
        'right as'
    ];

    const twists = [
        'doomscrolling through a meditation app',
        'someone in chat said "trust"',
        'the algorithm begged for mercy',
        'a notification ping demanded applause'
    ];

    const endings = [
        'sources say the backlog of screenshots is heroic.',
        'the algorithm remains unconvinced.',
        'commenters are already drafting dissertations.',
        'eyewitnesses report zero chill and maximum tabs.',
        'forecast calls for 90% chance of group chat drama.',
        'a focus group of houseplants requested a sequel.',
        'metrics include three sighs per minute and rising.'
    ];

    const recentHeadlines = [];

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

    function rememberHeadline(headline) {
        recentHeadlines.unshift(headline);
        if (recentHeadlines.length > RECENT_HEADLINE_HISTORY) {
            recentHeadlines.pop();
        }
    }

    function isRecentlyUsed(headline) {
        return recentHeadlines.includes(headline);
    }

    function buildHeadlineCandidate() {
        const prefix = pickRandom(prefixes);
        const subject = pickRandom(subjects);
        const action = `${pickRandom(actionOpeners)} ${pickRandom(actionDetails)}`;
        const connector = pickRandom(connectors);
        const twist = pickRandom(twists);
        const ending = pickRandom(endings);

        const headline = `${prefix} ${subject} ${action} ${connector} ${twist}, ${ending}`;
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
