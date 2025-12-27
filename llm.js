const TINY_LLM_TIMEOUT_MS = 2400;
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

    function pickRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    async function generateHeadline() {
        const generation = new Promise((resolve, reject) => {
            const delay = 450 + Math.floor(Math.random() * 700);
            setTimeout(() => {
                try {
                    const headline = `${pickRandom(prefixes)} ${pickRandom(subjects)} ${pickRandom(actions)} ${pickRandom(endings)}`;
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
