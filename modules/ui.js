(() => {
    const Neckass = window.Neckass = window.Neckass || {};

    const getById = (id) => document.getElementById(id);
    const getAll = (selector) => Array.from(document.querySelectorAll(selector));

    function mapElements() {
        const idMap = {
            headline: 'headline',
            loader: 'loader',
            loaderText: 'loader-text',
            nextButton: 'next-btn',
            previousButton: 'prev-btn',
            generateButton: 'generate-btn',
            favoriteButton: 'favorite-btn',
            counter: 'counter',
            mastheadDate: 'masthead-date',
            featureDateline: 'feature-date',
            twitterShareLink: 'twitter-share',
            facebookShareLink: 'facebook-share',
            redditShareLink: 'reddit-share',
            linkedinShareLink: 'linkedin-share',
            threadsShareLink: 'threads-share',
            blueskyShareLink: 'bluesky-share',
            copyButton: 'copy-btn',
            copyLinkButton: 'copy-link',
            copyStatus: 'copy-status',
            downloadMockButton: 'download-mock',
            copyMockButton: 'copy-mock',
            exportStatus: 'export-status',
            mockFrame: 'mock-front',
            mockHeadline: 'mock-headline',
            mockDate: 'mock-date',
            headlineSource: 'headline-source',
            headlineSectionBadge: 'headline-section',
            filterStatus: 'filter-status',
            clearFiltersButton: 'clear-filters',
            historyCount: 'history-count',
            headlineList: 'headline-list',
            searchInput: 'search-input',
            searchForm: 'search-form',
            applySearchButton: 'apply-search',
            clearSearchButton: 'clear-search'
        };
        const elements = Object.fromEntries(
            Object.entries(idMap).map(([key, id]) => [key, getById(id)])
        );

        return {
            ...elements,
            sectionButtons: getAll('.section-filter'),
            sourceButtons: getAll('.toggle-button[data-source]'),
            panelButtons: getAll('.toggle-button[data-panel]'),
            layoutButtons: getAll('.toggle-button[data-layout]'),
            containers: getAll('.container'),
            headlineSection: document.querySelector('.headline-section'),
            controls: document.querySelector('.controls'),
            socialShare: document.querySelector('.social-share'),
            copySection: document.querySelector('.copy-headline')
        };
    }

    function setButtonLoading(button, shouldShow) {
        if (!button) return;
        button.classList.toggle('is-loading', shouldShow);
        button.disabled = shouldShow;
        button.setAttribute('aria-busy', shouldShow ? 'true' : 'false');
    }

    function updateToggleButtons(buttons, value, attribute = 'source') {
        if (!buttons) return;
        buttons.forEach((button) => {
            const isActive = button.dataset[attribute] === value;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    }

    function updateLayoutButtons(layoutButtons, layout) {
        if (!layoutButtons) return;
        layoutButtons.forEach((button) => {
            const isActive = button.dataset.layout === layout;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    }

    function updateFilterStatus({ elements, filters, hasActiveFilters }) {
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

    Neckass.mapElements = mapElements;
    Neckass.setButtonLoading = setButtonLoading;
    Neckass.updateToggleButtons = updateToggleButtons;
    Neckass.updateLayoutButtons = updateLayoutButtons;
    Neckass.updateFilterStatus = updateFilterStatus;
})();
