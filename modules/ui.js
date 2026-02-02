export function mapElements() {
    return {
        headline: document.getElementById('headline'),
        loader: document.getElementById('loader'),
        loaderText: document.getElementById('loader-text'),
        nextButton: document.getElementById('next-btn'),
        previousButton: document.getElementById('prev-btn'),
        generateButton: document.getElementById('generate-btn'),
        favoriteButton: document.getElementById('favorite-btn'),
        counter: document.getElementById('counter'),
        mastheadDate: document.getElementById('masthead-date'),
        featureDateline: document.getElementById('feature-date'),
        twitterShareLink: document.getElementById('twitter-share'),
        facebookShareLink: document.getElementById('facebook-share'),
        redditShareLink: document.getElementById('reddit-share'),
        linkedinShareLink: document.getElementById('linkedin-share'),
        threadsShareLink: document.getElementById('threads-share'),
        blueskyShareLink: document.getElementById('bluesky-share'),
        copyButton: document.getElementById('copy-btn'),
        copyLinkButton: document.getElementById('copy-link'),
        copyStatus: document.getElementById('copy-status'),
        downloadMockButton: document.getElementById('download-mock'),
        copyMockButton: document.getElementById('copy-mock'),
        exportStatus: document.getElementById('export-status'),
        mockFrame: document.getElementById('mock-front'),
        mockHeadline: document.getElementById('mock-headline'),
        mockDate: document.getElementById('mock-date'),
        headlineSource: document.getElementById('headline-source'),
        headlineSectionBadge: document.getElementById('headline-section'),
        filterStatus: document.getElementById('filter-status'),
        clearFiltersButton: document.getElementById('clear-filters'),
        historyCount: document.getElementById('history-count'),
        headlineList: document.getElementById('headline-list'),
        searchInput: document.getElementById('search-input'),
        searchForm: document.getElementById('search-form'),
        applySearchButton: document.getElementById('apply-search'),
        clearSearchButton: document.getElementById('clear-search'),
        sectionButtons: Array.from(document.querySelectorAll('.section-filter')),
        sourceButtons: Array.from(document.querySelectorAll('.toggle-button[data-source]')),
        panelButtons: Array.from(document.querySelectorAll('.toggle-button[data-panel]')),
        layoutButtons: Array.from(document.querySelectorAll('.toggle-button[data-layout]')),
        containers: Array.from(document.querySelectorAll('.container')),
        headlineSection: document.querySelector('.headline-section'),
        controls: document.querySelector('.controls'),
        socialShare: document.querySelector('.social-share'),
        copySection: document.querySelector('.copy-headline')
    };
}

export function setButtonLoading(button, shouldShow) {
    if (!button) return;
    button.classList.toggle('is-loading', shouldShow);
    button.disabled = shouldShow;
    button.setAttribute('aria-busy', shouldShow ? 'true' : 'false');
}

export function updateToggleButtons(buttons, value, attribute = 'source') {
    if (!buttons) return;
    buttons.forEach((button) => {
        const isActive = button.dataset[attribute] === value;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
}

export function updateLayoutButtons(layoutButtons, layout) {
    if (!layoutButtons) return;
    layoutButtons.forEach((button) => {
        const isActive = button.dataset.layout === layout;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
}

export function updateFilterStatus({ elements, filters, hasActiveFilters }) {
    if (!elements.filterStatus) return;
    const parts = [];
    if (filters.section !== 'latest') {
        parts.push(filters.section);
    }
    if (filters.query) {
        parts.push(`"${filters.query}"`);
    }
    if (filters.source !== 'auto') {
        parts.push(filters.source);
    }
    elements.filterStatus.textContent = parts.length > 0 ? parts.join(' · ') : 'All headlines';
    if (elements.clearFiltersButton) {
        const hasFilters = hasActiveFilters(filters);
        elements.clearFiltersButton.hidden = !hasFilters;
        elements.clearFiltersButton.disabled = !hasFilters;
    }
}
