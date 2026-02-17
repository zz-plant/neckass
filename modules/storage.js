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
        filters: 'headlineFilters',
        dailyEngagement: 'dailyEngagement',
        feedbackLog: 'headlineFeedbackLog'
    };

    function createStorageAdapter() {
        let queuedState = null;
        let persistScheduled = false;

        const flushPersist = () => {
            persistScheduled = false;
            if (!queuedState) return;

            const snapshot = queuedState;
            queuedState = null;

            safeSetItem(STORAGE_KEYS.viewedCount, snapshot.uniqueHeadlines.size);
            safeSetItem(STORAGE_KEYS.viewedList, JSON.stringify(snapshot.navigationStack));
            safeSetItem(STORAGE_KEYS.navigationStack, JSON.stringify(snapshot.navigationStack));
            safeSetItem(STORAGE_KEYS.navigationStackLegacy, JSON.stringify(snapshot.navigationStack));
            safeSetItem(STORAGE_KEYS.uniqueHeadlines, JSON.stringify(Array.from(snapshot.uniqueHeadlines)));
            safeSetItem(
                STORAGE_KEYS.generatedHeadlines,
                JSON.stringify(Array.isArray(snapshot.generatedHeadlines) ? snapshot.generatedHeadlines : [])
            );
            safeSetItem(
                STORAGE_KEYS.favorites,
                JSON.stringify(Array.isArray(snapshot.favorites) ? snapshot.favorites : [])
            );
            safeSetItem(
                STORAGE_KEYS.filters,
                JSON.stringify(snapshot.filters || Neckass.DEFAULT_FILTERS)
            );
            safeSetItem(
                STORAGE_KEYS.dailyEngagement,
                JSON.stringify(snapshot.dailyEngagement || {})
            );
            safeSetItem(
                STORAGE_KEYS.feedbackLog,
                JSON.stringify(Array.isArray(snapshot.feedbackLog) ? snapshot.feedbackLog : [])
            );
        };

        return {
            restore(baseHeadlineCount) {
                const generatedHeadlines = parseJson(safeGetItem(STORAGE_KEYS.generatedHeadlines), []);
                const totalHeadlines = baseHeadlineCount + (Array.isArray(generatedHeadlines) ? generatedHeadlines.length : 0);
                const storedStack = parseJson(safeGetItem(STORAGE_KEYS.navigationStack), null);
                const legacyNavigationStack = parseJson(safeGetItem(STORAGE_KEYS.navigationStackLegacy), null);
                const viewedListLegacy = parseJson(safeGetItem(STORAGE_KEYS.viewedList), []);
                const uniqueHeadlinesLegacy = parseJson(safeGetItem(STORAGE_KEYS.uniqueHeadlines), null);
                const favorites = parseJson(safeGetItem(STORAGE_KEYS.favorites), []);
                const filters = parseJson(safeGetItem(STORAGE_KEYS.filters), {});
                const rawStack = resolveNavigationStack(storedStack, legacyNavigationStack, viewedListLegacy);

                const sanitizedStack = rawStack.filter((index) => Neckass.isValidHeadlineIndex(index, totalHeadlines));
                const uniqueHeadlines = new Set(
                    Array.isArray(uniqueHeadlinesLegacy) && uniqueHeadlinesLegacy.length > 0
                        ? uniqueHeadlinesLegacy.filter((index) => Neckass.isValidHeadlineIndex(index, totalHeadlines))
                        : sanitizedStack
                );

                const dailyEngagement = parseJson(safeGetItem(STORAGE_KEYS.dailyEngagement), {});
                const feedbackLog = parseJson(safeGetItem(STORAGE_KEYS.feedbackLog), []);

                return {
                    navigationStack: sanitizedStack,
                    uniqueHeadlines,
                    currentIndex: sanitizedStack[sanitizedStack.length - 1] ?? -1,
                    generatedHeadlines: Array.isArray(generatedHeadlines)
                        ? generatedHeadlines.filter(Boolean)
                        : [],
                    favorites: Array.isArray(favorites) ? favorites.filter(Boolean) : [],
                    filters: Neckass.sanitizeFilters(filters),
                    dailyEngagement,
                    feedbackLog: Array.isArray(feedbackLog) ? feedbackLog : []
                };
            },

            persist(state) {
                queuedState = Neckass.cloneStateSnapshot(state);

                if (persistScheduled) return;
                persistScheduled = true;
                Neckass.scheduleBackgroundTask(flushPersist);
            }
        };
    }

    function safeGetItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function safeSetItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            return;
        }
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
