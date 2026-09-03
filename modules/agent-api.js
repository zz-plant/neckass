(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;
    const {
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

            // Current form: the headline's own slug. Checked first so a slug
            // that happens to start with a digit is never read as an index.
            const asSlug = String(identifier);
            if (/^[a-z0-9-]+$/.test(asSlug)) {
                const bySlug = this.headlines.findIndex(
                    (text) => slugifyHeadline(text) === asSlug,
                );
                if (bySlug !== -1) return bySlug;
            }

            const parsed = Number.parseInt(identifier, 10);
            if (
                Number.isInteger(parsed) &&
                String(parsed) === String(identifier)
            ) {
                return parsed;
            }

            // Legacy form "<index>-<slug>", so links shared before the change
            // still resolve.
            const slugMatch = String(identifier).match(
                /^(\d+)(?:-[a-z0-9-]+)?$/i,
            );
            if (slugMatch) {
                return Number.parseInt(slugMatch[1], 10);
            }

            // A slug-shaped identifier that matched nothing is a stale link,
            // not a headline someone typed; do not register it as one.
            if (/^[a-z0-9-]+$/.test(asSlug) && asSlug.includes('-')) {
                return null;
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
            return slug || String(index);
        },

        buildHeadlineUrl(index) {
            return buildHeadlineUrl({
                index,
                headlines: this.headlines,
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
                totalHeadlines: this.headlines.length,
                generatorAvailable: this.isGeneratorAvailable(),
            };
        },

        selectHeadlineByIdentifier(identifier) {
            const index = this.identifierToIndex(identifier);
            if (!isValidHeadlineIndex(index, this.headlines.length)) {
                return null;
            }
            this._selectHeadlineCore(index);
            return this.getAgentSnapshot();
        },

        listHeadlinesForAgent({ offset = 0, limit = 25 } = {}) {
            const pool = this.headlines.map((_, index) => index);
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
