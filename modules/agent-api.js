(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;
    const {
        DEFAULT_FILTERS,
        sanitizeFilters,
        buildHeadlineUrl,
        isValidHeadlineIndex,
        normalizeHeadlineText,
        slugifyHeadline,
    } = Neckass;

    /**
     * The surface `window.Neckass.agent` is built on: identifier/index
     * translation, canonical URLs, and the snapshot and mutation calls an
     * automation runtime uses instead of clicking the UI.
     *
     * Mixed into HeadlineApp.prototype by app.js, so `this` is the app
     * instance exactly as it was when these lived in the class body.
     */
    Neckass.agentApiMethods = {
        identifierToIndex(identifier) {
            if (identifier === null || identifier === undefined) return null;
            const parsed = Number.parseInt(identifier, 10);
            if (
                Number.isInteger(parsed) &&
                String(parsed) === String(identifier)
            ) {
                return parsed;
            }

            const slugMatch = String(identifier).match(
                /^(\d+)(?:-[a-z0-9-]+)?$/i,
            );
            if (slugMatch) {
                return Number.parseInt(slugMatch[1], 10);
            }

            const normalized = normalizeHeadlineText(identifier);
            if (!normalized) return null;
            const cachedIndex = this.headlineCache.get(normalized);
            if (Number.isInteger(cachedIndex)) {
                return cachedIndex;
            }

            return this.registerSharedHeadline(normalized);
        },

        identifierFromIndex(index) {
            const headlineText = isValidHeadlineIndex(
                index,
                this.headlines.length,
            )
                ? this.headlines[index]
                : '';
            const slug = slugifyHeadline(headlineText);
            return slug ? `${index}-${slug}` : String(index);
        },

        buildHeadlineUrl(index) {
            return buildHeadlineUrl({
                index,
                headlines: this.headlines,
                filters: this.filters,
                identifierFromIndex: (idx) => this.identifierFromIndex(idx),
                isValidHeadlineIndex,
            });
        },

        getCanonicalUrl(index) {
            return this.buildHeadlineUrl(index);
        },

        getCurrentHeadlineText() {
            if (
                !isValidHeadlineIndex(
                    this.state.currentIndex,
                    this.headlines.length,
                )
            ) {
                return '';
            }
            return this.headlines[this.state.currentIndex] || '';
        },

        getAgentSnapshot() {
            const currentIndex = isValidHeadlineIndex(
                this.state.currentIndex,
                this.headlines.length,
            )
                ? this.state.currentIndex
                : null;
            return {
                index: currentIndex,
                identifier:
                    currentIndex === null
                        ? null
                        : this.identifierFromIndex(currentIndex),
                headline: this.getCurrentHeadlineText(),
                url:
                    currentIndex === null
                        ? null
                        : this.getCanonicalUrl(currentIndex),
                filters: { ...this.filters },
                poolSize: this.filteredIndexes.length,
                totalHeadlines: this.headlines.length,
                generatorAvailable: this.isGeneratorAvailable(),
            };
        },

        setFiltersForAgent(partialFilters = {}) {
            const incoming =
                partialFilters && typeof partialFilters === 'object'
                    ? partialFilters
                    : {};
            const nextFilters = sanitizeFilters({
                ...DEFAULT_FILTERS,
                ...this.filters,
                ...incoming,
            });

            const changed = Object.keys(nextFilters).some(
                (key) => nextFilters[key] !== this.filters[key],
            );
            if (!changed) {
                return this.getAgentSnapshot();
            }

            this.filters = nextFilters;
            if (this.elements.searchInput) {
                this.elements.searchInput.value = this.filters.query;
            }
            this.persistState();
            this.refreshFilteredIndexes();
            this.applyMockLayoutClass();

            if (this.filteredIndexes.length === 0) {
                this._renderEmptyStateCore();
                this.pushHistoryState(-1, { replace: true });
                return this.getAgentSnapshot();
            }

            const nextIndex = this.isIndexEligible(this.state.currentIndex)
                ? this.state.currentIndex
                : this.filteredIndexes[0];
            this.state.navigationStack = [nextIndex];
            this.state.currentIndex = nextIndex;
            this.renderHeadline(nextIndex, {
                pushToStack: false,
                replaceState: true,
            });
            return this.getAgentSnapshot();
        },

        selectHeadlineByIdentifier(identifier) {
            const index = this.identifierToIndex(identifier);
            if (!this.isIndexEligible(index)) {
                return null;
            }
            this._selectHeadlineCore(index);
            return this.getAgentSnapshot();
        },

        listHeadlinesForAgent({
            offset = 0,
            limit = 25,
            scope = 'eligible',
        } = {}) {
            const pool =
                scope === 'all'
                    ? this.headlines.map((_, index) => index)
                    : [...this.filteredIndexes];
            const start = Math.max(0, Number.parseInt(offset, 10) || 0);
            const max = Math.min(
                100,
                Math.max(1, Number.parseInt(limit, 10) || 25),
            );

            return pool.slice(start, start + max).map((index) => ({
                index,
                identifier: this.identifierFromIndex(index),
                headline: this.headlines[index],
                source:
                    index >= this.baseHeadlineCount ? 'generated' : 'curated',
            }));
        },
    };
})();
