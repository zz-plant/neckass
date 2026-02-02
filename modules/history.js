export function getUrlState() {
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

export function buildHeadlineUrl({ index, headlines, filters, identifierFromIndex, isValidHeadlineIndex }) {
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

    url.searchParams.set('section', filters.section);
    if (filters.query) {
        url.searchParams.set('q', filters.query);
    } else {
        url.searchParams.delete('q');
    }
    url.searchParams.set('source', filters.source);
    url.searchParams.set('panel', filters.panel);
    url.searchParams.set('layout', filters.layout);

    return url.toString();
}

export function updateHistoryState({
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
