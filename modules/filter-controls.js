(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;
    const {
        DEFAULT_FILTERS,
        getEligibleIndexes,
        hasActiveFilters,
        isIndexEligible,
        updateLayoutButtons,
        updateToggleButtons,
        isValidHeadlineIndex,
        triggerHapticFeedback,
    } = Neckass;
    const renderFilterStatus = Neckass.updateFilterStatus;

    /**
     * Section/source/panel/layout filters and search: applying them,
     * keeping the visible headline inside the resulting pool, and syncing the
     * controls back to state.
     *
     * Mixed into HeadlineApp.prototype by app.js, so `this` is the app
     * instance exactly as it was when these lived in the class body.
     */
    Neckass.filterMethods = {
        setSectionFilter(section) {
            this.updateFilterValue('section', section || 'latest', {
                resetNavigation: true,
                refreshIndexes: true,
                ensureHeadline: true,
                syncControls: true,
            });
        },

        setSourceFilter(source) {
            if (source === 'generated' && !this.isGeneratorAvailable()) {
                this.reportCopyStatus(
                    'Tiny model unavailable. Source set to auto.',
                    true,
                );
                this.updateFilterValue('source', 'auto', {
                    resetNavigation: true,
                    refreshIndexes: true,
                    ensureHeadline: true,
                    syncControls: true,
                });
                return;
            }
            this.updateFilterValue('source', source || 'auto', {
                resetNavigation: true,
                refreshIndexes: true,
                ensureHeadline: true,
                syncControls: true,
            });
        },

        setActivePanel(panel) {
            this.updateFilterValue('panel', panel || 'recent', {
                syncControls: true,
                updateHistoryList: true,
                updateHistoryState: true,
            });
        },

        setMockLayout(layout) {
            this.updateFilterValue('layout', layout || 'standard', {
                applyLayout: true,
                syncControls: true,
                updateHistoryState: true,
            });
        },

        applyMockLayoutClass() {
            if (!this.elements.mockFrame) return;
            this.elements.mockFrame.classList.remove(
                'mock-front--square',
                'mock-front--story',
            );
            if (this.filters.layout === 'square') {
                this.elements.mockFrame.classList.add('mock-front--square');
            }
            if (this.filters.layout === 'story') {
                this.elements.mockFrame.classList.add('mock-front--story');
            }
            updateLayoutButtons(
                this.elements.layoutButtons,
                this.filters.layout,
            );
        },

        applySearch() {
            const query = this.elements.searchInput?.value ?? '';
            this.updateFilterValue('query', query.trim(), {
                resetNavigation: true,
                refreshIndexes: true,
                ensureHeadline: true,
                syncControls: true,
                updateStatusOnNoChange: true,
            });
        },

        clearSearch() {
            if (this.elements.searchInput) {
                this.elements.searchInput.value = '';
            }
            this.updateFilterValue('query', '', {
                resetNavigation: true,
                refreshIndexes: true,
                ensureHeadline: true,
                syncControls: true,
                updateStatusOnNoChange: true,
            });
        },

        resetNavigationForFilters() {
            const currentIndex = isValidHeadlineIndex(
                this.state.currentIndex,
                this.headlines.length,
            )
                ? this.state.currentIndex
                : null;
            this.state.navigationStack =
                currentIndex !== null ? [currentIndex] : [];
        },

        ensureHeadlineMatchesFilters() {
            if (this.filteredIndexes.length === 0) {
                this._renderEmptyStateCore();
                this.pushHistoryState(-1, { replace: false });
                return;
            }

            if (!this.isIndexEligible(this.state.currentIndex)) {
                const nextIndex = this.filteredIndexes[0];
                this.state.navigationStack = [nextIndex];
                this.state.currentIndex = nextIndex;
                this.renderHeadline(nextIndex, {
                    pushToStack: false,
                    replaceState: true,
                });
                return;
            }

            this.pushHistoryState(this.state.currentIndex, { replace: false });
            this.updateHistoryList();
        },

        refreshFilteredIndexes() {
            this.filteredIndexes = getEligibleIndexes({
                headlines: this.headlines,
                baseHeadlineCount: this.baseHeadlineCount,
                filters: this.filters,
                isValidHeadlineIndex,
            });
            this.updateFilterStatus();
            this.updateNavigationAvailability();
            this.updateHistoryList();
        },

        isIndexEligible(index) {
            return isIndexEligible(index, {
                headlines: this.headlines,
                baseHeadlineCount: this.baseHeadlineCount,
                filters: this.filters,
                isValidHeadlineIndex,
            });
        },

        updateFilterStatus() {
            renderFilterStatus({
                elements: this.elements,
                filters: this.filters,
                hasActiveFilters,
            });
        },

        syncFilterControls() {
            if (this.elements.searchInput) {
                this.elements.searchInput.value = this.filters.query;
            }
            updateToggleButtons(
                this.elements.sectionButtons,
                this.filters.section,
                'section',
            );
            updateToggleButtons(
                this.elements.sourceButtons,
                this.filters.source,
                'source',
            );
            updateToggleButtons(
                this.elements.panelButtons,
                this.filters.panel,
                'panel',
            );
            updateLayoutButtons(
                this.elements.layoutButtons,
                this.filters.layout,
            );
            this.syncGeneratorControls();
            this.updateFilterStatus();
        },

        clearAllFilters() {
            const nextFilters = { ...DEFAULT_FILTERS };
            const shouldReset = Object.keys(nextFilters).some(
                (key) => nextFilters[key] !== this.filters[key],
            );
            if (!shouldReset) {
                this.updateFilterStatus();
                this.pushHistoryState(this.state.currentIndex, {
                    replace: true,
                });
                this.showToast('Filters already clear.');
                return;
            }

            this.filters = nextFilters;
            if (this.elements.searchInput) {
                this.elements.searchInput.value = '';
            }
            this.persistState();
            this.syncFilterControls();
            this.refreshFilteredIndexes();
            this.applyMockLayoutClass();

            if (this.filteredIndexes.length === 0) {
                this._renderEmptyStateCore();
                this.pushHistoryState(-1, { replace: true });
                return;
            }

            const nextIndex = this.filteredIndexes[0];
            this.state.navigationStack = [nextIndex];
            this.state.currentIndex = nextIndex;
            triggerHapticFeedback('light');
            this.renderHeadline(nextIndex, {
                pushToStack: false,
                replaceState: true,
            });
            this.showToast('Filters cleared.');
        },

        updateFilterValue(filterKey, value, options = {}) {
            const {
                resetNavigation = false,
                refreshIndexes = false,
                ensureHeadline = false,
                syncControls = false,
                updateHistoryList: shouldUpdateHistoryList = false,
                updateHistoryState: shouldUpdateHistoryState = false,
                applyLayout = false,
                updateStatusOnNoChange = false,
            } = options;

            if (this.filters[filterKey] === value) {
                if (updateStatusOnNoChange) {
                    this.updateFilterStatus();
                }
                return;
            }

            this.filters[filterKey] = value;
            if (resetNavigation) {
                this.resetNavigationForFilters();
            }
            this.persistState();
            if (syncControls) {
                this.syncFilterControls();
            }
            if (refreshIndexes) {
                this.refreshFilteredIndexes();
            }
            if (applyLayout) {
                this.applyMockLayoutClass();
            }
            if (ensureHeadline) {
                this.ensureHeadlineMatchesFilters();
            }
            if (shouldUpdateHistoryList) {
                this.updateHistoryList();
            }
            if (shouldUpdateHistoryState) {
                this.pushHistoryState(this.state.currentIndex, {
                    replace: false,
                });
            }
        },
    };
})();
