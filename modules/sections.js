(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;

    /**
     * The section a wire item reads as, inferred from its own words. This is
     * a label for the badge under the headline, not a filter: nothing selects
     * or hides items by section.
     */
    function classifyHeadline(headlineText) {
        if (!headlineText) return 'latest';
        const normalized = headlineText.toLowerCase();
        const patterns = {
            world: [
                'canada',
                'federal',
                'global',
                'climate',
                'ambassador',
                'space',
                'metaverse',
                'crypto',
                'treaty',
            ],
            tech: [
                'app',
                'wifi',
                'ai',
                'bot',
                'algorithm',
                'ios',
                'android',
                'tweet',
                'stream',
                'vr',
                'podcast',
                'discord',
                'zoom',
            ],
            culture: [
                'tiktok',
                'reels',
                'instagram',
                'spotify',
                'etsy',
                'book',
                'substack',
                'newsletter',
                'podcast',
                'fashion',
                'club',
            ],
            oddities: [
                'unhinged',
                'manifest',
                'ghost',
                'meme',
                'weird',
                'npc',
                'pickleball',
                'cursed',
                'demon',
                'zodiac',
            ],
        };

        if (patterns.tech.some((term) => normalized.includes(term)))
            return 'tech';
        if (patterns.culture.some((term) => normalized.includes(term)))
            return 'culture';
        if (patterns.world.some((term) => normalized.includes(term)))
            return 'world';
        if (patterns.oddities.some((term) => normalized.includes(term)))
            return 'oddities';
        return 'latest';
    }

    Neckass.classifyHeadline = classifyHeadline;
})();
