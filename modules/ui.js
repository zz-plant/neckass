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
            dailyStreak: 'daily-streak',
            featureDateline: 'feature-date',
            twitterShareLink: 'twitter-share',
            facebookShareLink: 'facebook-share',
            redditShareLink: 'reddit-share',
            linkedinShareLink: 'linkedin-share',
            threadsShareLink: 'threads-share',
            blueskyShareLink: 'bluesky-share',
            copyButton: 'copy-btn',
            jumpCopyButton: 'jump-copy',
            copyLinkButton: 'copy-link',
            copyStatus: 'copy-status',
            nativeShareButton: 'native-share',
            jumpShareButton: 'jump-share',
            jumpExportButton: 'jump-export',
            shareStatus: 'share-status',
            downloadMockButton: 'download-mock',
            copyMockButton: 'copy-mock',
            exportStatus: 'export-status',
            globalToast: 'global-toast',
            mockFrame: 'mock-front',
            mockHeadline: 'mock-headline',
            mockDate: 'mock-date',
            headlineSource: 'headline-source',
            headlineSectionBadge: 'headline-section',
            filterStatus: 'filter-status',
            shuffleStreak: 'shuffle-streak',
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
            copySection: document.querySelector('.copy-headline'),
            exportSection: document.querySelector('#export-card')
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

    function formatFilterLabel(value) {
        return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;
    }

    function updateFilterStatus({ elements, filters, hasActiveFilters }) {
        if (!elements.filterStatus) return;
        const parts = [];
        if (filters.section !== 'latest') {
            parts.push(`Section: ${formatFilterLabel(filters.section)}`);
        }
        if (filters.query) {
            parts.push(`Query: "${filters.query}"`);
        }
        if (filters.source !== 'auto') {
            parts.push(`Source: ${formatFilterLabel(filters.source)}`);
        }

        elements.filterStatus.textContent = parts.length > 0
            ? `Filtered by ${parts.join(' · ')}`
            : 'All headlines';

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
