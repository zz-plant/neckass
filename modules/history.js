(() => {
    const Neckass = window.Neckass = window.Neckass || {};

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
            section: params.get('section'),
            query: params.get('q'),
            source: params.get('source'),
            panel: params.get('panel'),
            layout: params.get('layout')
        };
    }

    function buildHeadlineUrl({ index, headlines, filters, identifierFromIndex, isValidHeadlineIndex }) {
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

        if (filters.section && filters.section !== 'latest') {
            url.searchParams.set('section', filters.section);
        } else {
            url.searchParams.delete('section');
        }
        if (filters.query) {
            url.searchParams.set('q', filters.query);
        } else {
            url.searchParams.delete('q');
        }
        if (filters.source && filters.source !== 'auto') {
            url.searchParams.set('source', filters.source);
        } else {
            url.searchParams.delete('source');
        }
        if (filters.panel && filters.panel !== 'recent') {
            url.searchParams.set('panel', filters.panel);
        } else {
            url.searchParams.delete('panel');
        }
        if (filters.layout && filters.layout !== 'standard') {
            url.searchParams.set('layout', filters.layout);
        } else {
            url.searchParams.delete('layout');
        }

        return url.toString();
    }

    function updateHistoryState({
        index,
        headlines,
        filters,
        navigationStack,
        uniqueHeadlines,
        identifierFromIndex,
        isValidHeadlineIndex,
        replace = false
    }) {
        const url = buildHeadlineUrl({ index, headlines, filters, identifierFromIndex, isValidHeadlineIndex });
        const state = {
            headlineIndex: isValidHeadlineIndex(index, headlines.length) ? index : null,
            navigationStack: [...navigationStack],
            uniqueHeadlines: Array.from(uniqueHeadlines),
            filters: { ...filters }
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
