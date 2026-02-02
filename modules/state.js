(() => {
    const Neckass = window.Neckass = window.Neckass || {};

    function createHeadlineCache(headlines) {
        const cache = new Map();
        headlines.forEach((headlineText, index) => {
            const normalized = Neckass.normalizeHeadlineText(headlineText);
            if (!normalized) return;
            if (!cache.has(normalized)) {
                cache.set(normalized, index);
            }
        });
        return cache;
    }

    function appendGeneratedHeadlines({ headlines, headlineCache, generatedHeadlines }) {
        const additions = Array.isArray(generatedHeadlines) ? generatedHeadlines : [];
        additions.forEach((headlineText) => {
            if (!headlineText || typeof headlineText !== 'string') return;
            const normalized = headlineText.trim();
            if (!normalized) return;
            if (headlineCache.has(normalized)) return;

            headlines.push(normalized);
            headlineCache.set(normalized, headlines.length - 1);
        });
    }

    Neckass.createHeadlineCache = createHeadlineCache;
    Neckass.appendGeneratedHeadlines = appendGeneratedHeadlines;
})();
