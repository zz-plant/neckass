(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;

    // Parameters of the removed filter system. Links carrying them still
    // exist, so strip them from any URL this module writes rather than
    // dragging them along forever.
    const RETIRED_PARAMS = ['section', 'q', 'source', 'panel', 'layout'];

    function getUrlState() {
        const params = new URLSearchParams(window.location.search);
        let headline = params.get('headline');
        if (!headline) {
            const hashMatch = window.location.hash.match(/headline-([^&]+)/i);
            headline = hashMatch ? hashMatch[1] : null;
        }
        return {
            headline,
            hasHeadlineParam: params.has('headline'),
        };
    }

    function buildHeadlineUrl({
        index,
        headlines,
        identifierFromIndex,
        isValidHeadlineIndex,
    }) {
        const url = new URL(window.location.href);
        url.hash = '';
        const headlineIdentifier = isValidHeadlineIndex(index, headlines.length)
            ? identifierFromIndex(index)
            : '';
        if (headlineIdentifier) {
            url.searchParams.set('headline', headlineIdentifier);
        } else {
            url.searchParams.delete('headline');
        }
        RETIRED_PARAMS.forEach((param) => {
            url.searchParams.delete(param);
        });

        return url.toString();
    }

    function updateHistoryState({
        index,
        headlines,
        navigationStack,
        uniqueHeadlines,
        identifierFromIndex,
        isValidHeadlineIndex,
        replace = false,
    }) {
        const url = buildHeadlineUrl({
            index,
            headlines,
            identifierFromIndex,
            isValidHeadlineIndex,
        });
        const state = {
            headlineIndex: isValidHeadlineIndex(index, headlines.length)
                ? index
                : null,
            navigationStack: [...navigationStack],
            uniqueHeadlines: Array.from(uniqueHeadlines),
        };

        if (replace) {
            history.replaceState(state, '', url);
        } else {
            history.pushState(state, '', url);
        }
    }

    Neckass.getUrlState = getUrlState;
    Neckass.buildHeadlineUrl = buildHeadlineUrl;
    Neckass.updateHistoryState = updateHistoryState;
})();
