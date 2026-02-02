(() => {
    const Neckass = window.Neckass = window.Neckass || {};

    const DEFAULT_FILTERS = Object.freeze({
        section: 'latest',
        query: '',
        source: 'auto',
        panel: 'recent',
        layout: 'standard'
    });

    const ALLOWED_SECTIONS = ['latest', 'world', 'culture', 'tech', 'oddities'];
    const ALLOWED_SOURCES = ['auto', 'generated', 'curated'];
    const ALLOWED_PANELS = ['recent', 'favorites', 'generated'];
    const ALLOWED_LAYOUTS = ['standard', 'square', 'story'];

    function sanitizeFilters(filters = {}) {
        const sanitized = { ...DEFAULT_FILTERS };

        if (filters.section && ALLOWED_SECTIONS.includes(filters.section)) {
            sanitized.section = filters.section;
        }
        if (filters.source && ALLOWED_SOURCES.includes(filters.source)) {
            sanitized.source = filters.source;
        }
        if (filters.panel && ALLOWED_PANELS.includes(filters.panel)) {
            sanitized.panel = filters.panel;
        }
        if (filters.layout && ALLOWED_LAYOUTS.includes(filters.layout)) {
            sanitized.layout = filters.layout;
        }
        if (typeof filters.query === 'string') {
            sanitized.query = filters.query.trim();
        }

        return sanitized;
    }

    function hasActiveFilters(filters) {
        return Boolean(
            filters.query
            || filters.section !== DEFAULT_FILTERS.section
            || filters.source !== DEFAULT_FILTERS.source
        );
    }

    function classifyHeadline(headlineText) {
        if (!headlineText) return 'latest';
        const normalized = headlineText.toLowerCase();
        const patterns = {
            world: ['canada', 'federal', 'global', 'climate', 'ambassador', 'space', 'metaverse', 'crypto', 'treaty'],
            tech: ['app', 'wifi', 'ai', 'bot', 'algorithm', 'ios', 'android', 'tweet', 'stream', 'vr', 'podcast', 'discord', 'zoom'],
            culture: ['tiktok', 'reels', 'instagram', 'spotify', 'etsy', 'book', 'substack', 'newsletter', 'podcast', 'fashion', 'club'],
            oddities: ['unhinged', 'manifest', 'ghost', 'meme', 'weird', 'npc', 'pickleball', 'cursed', 'demon', 'zodiac']
        };

        if (patterns.tech.some((term) => normalized.includes(term))) return 'tech';
        if (patterns.culture.some((term) => normalized.includes(term))) return 'culture';
        if (patterns.world.some((term) => normalized.includes(term))) return 'world';
        if (patterns.oddities.some((term) => normalized.includes(term))) return 'oddities';
        return 'latest';
    }

    function isIndexEligible(index, { headlines, baseHeadlineCount, filters, normalizedQuery = null, isValidHeadlineIndex }) {
        if (!isValidHeadlineIndex(index, headlines.length)) return false;
        const headlineText = headlines[index];
        const query = normalizedQuery ?? filters.query.trim().toLowerCase();
        const { section, source } = filters;
        const isGenerated = index >= baseHeadlineCount;

        if (source === 'curated' && isGenerated) return false;
        if (source === 'generated' && !isGenerated) return false;
        if (section !== 'latest') {
            const assigned = classifyHeadline(headlineText);
            if (assigned !== section) return false;
        }
        if (query) {
            return headlineText.toLowerCase().includes(query);
        }
        return true;
    }

    function getEligibleIndexes({ headlines, baseHeadlineCount, filters, isValidHeadlineIndex }) {
        const query = filters.query.trim().toLowerCase();
        return headlines
            .map((_, index) => index)
            .filter((index) => isIndexEligible(index, {
                headlines,
                baseHeadlineCount,
                filters,
                normalizedQuery: query,
                isValidHeadlineIndex
            }));
    }

    Neckass.DEFAULT_FILTERS = DEFAULT_FILTERS;
    Neckass.sanitizeFilters = sanitizeFilters;
    Neckass.hasActiveFilters = hasActiveFilters;
    Neckass.classifyHeadline = classifyHeadline;
    Neckass.isIndexEligible = isIndexEligible;
    Neckass.getEligibleIndexes = getEligibleIndexes;
})();
