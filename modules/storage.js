(() => {
    const Neckass = window.Neckass = window.Neckass || {};

    const STORAGE_KEYS = {
        viewedCount: 'headlinesViewed',
        viewedList: 'viewedHeadlines',
        navigationStack: 'navigationStack',
        navigationStackLegacy: 'viewedStack',
        uniqueHeadlines: 'uniqueHeadlines',
        generatedHeadlines: 'generatedHeadlines',
        favorites: 'favoriteHeadlines',
        filters: 'headlineFilters'
    };

    function createStorageAdapter() {
        return {
            restore(baseHeadlineCount) {
                const generatedHeadlines = parseJson(localStorage.getItem(STORAGE_KEYS.generatedHeadlines), []);
                const totalHeadlines = baseHeadlineCount + (Array.isArray(generatedHeadlines) ? generatedHeadlines.length : 0);
                const storedStack = parseJson(localStorage.getItem(STORAGE_KEYS.navigationStack), null);
                const legacyNavigationStack = parseJson(localStorage.getItem(STORAGE_KEYS.navigationStackLegacy), null);
                const viewedListLegacy = parseJson(localStorage.getItem(STORAGE_KEYS.viewedList), []);
                const uniqueHeadlinesLegacy = parseJson(localStorage.getItem(STORAGE_KEYS.uniqueHeadlines), null);
                const favorites = parseJson(localStorage.getItem(STORAGE_KEYS.favorites), []);
                const filters = parseJson(localStorage.getItem(STORAGE_KEYS.filters), {});
                const rawStack = resolveNavigationStack(storedStack, legacyNavigationStack, viewedListLegacy);

                const sanitizedStack = rawStack.filter((index) => Neckass.isValidHeadlineIndex(index, totalHeadlines));
                const uniqueHeadlines = new Set(
                    Array.isArray(uniqueHeadlinesLegacy) && uniqueHeadlinesLegacy.length > 0
                        ? uniqueHeadlinesLegacy.filter((index) => Neckass.isValidHeadlineIndex(index, totalHeadlines))
                        : sanitizedStack
                );

                return {
                    navigationStack: sanitizedStack,
                    uniqueHeadlines,
                    currentIndex: sanitizedStack[sanitizedStack.length - 1] ?? -1,
                    generatedHeadlines: Array.isArray(generatedHeadlines)
                        ? generatedHeadlines.filter(Boolean)
                        : [],
                    favorites: Array.isArray(favorites) ? favorites.filter(Boolean) : [],
                    filters: Neckass.sanitizeFilters(filters)
                };
            },

            persist(state) {
                localStorage.setItem(STORAGE_KEYS.viewedCount, state.uniqueHeadlines.size);
                localStorage.setItem(STORAGE_KEYS.viewedList, JSON.stringify(state.navigationStack));
                localStorage.setItem(STORAGE_KEYS.navigationStack, JSON.stringify(state.navigationStack));
                localStorage.setItem(STORAGE_KEYS.navigationStackLegacy, JSON.stringify(state.navigationStack));
                localStorage.setItem(STORAGE_KEYS.uniqueHeadlines, JSON.stringify(Array.from(state.uniqueHeadlines)));
                localStorage.setItem(
                    STORAGE_KEYS.generatedHeadlines,
                    JSON.stringify(Array.isArray(state.generatedHeadlines) ? state.generatedHeadlines : [])
                );
                localStorage.setItem(
                    STORAGE_KEYS.favorites,
                    JSON.stringify(Array.isArray(state.favorites) ? state.favorites : [])
                );
                localStorage.setItem(
                    STORAGE_KEYS.filters,
                    JSON.stringify(state.filters || Neckass.DEFAULT_FILTERS)
                );
            }
        };
    }

    function parseJson(value, fallback) {
        try {
            if (value === null) return fallback;
            return JSON.parse(value);
        } catch (error) {
            return fallback;
        }
    }

    function resolveNavigationStack(primaryStack, legacyStack, viewedList) {
        if (Array.isArray(primaryStack)) {
            return primaryStack;
        }
        if (Array.isArray(legacyStack)) {
            return legacyStack;
        }
        return Array.isArray(viewedList) ? viewedList : [];
    }

    Neckass.createStorageAdapter = createStorageAdapter;
})();
