(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;
    const {
        copyTextWithFeedback,
        DEFAULT_FILTERS,
        classifyHeadline,
        hasActiveFilters,
        sanitizeFilters,
        getUrlState,
        updateHistoryState,
        exportMockFront,
        updateSocialShareLinks,
        appendGeneratedHeadlines,
        createHeadlineCache,
        setButtonLoading,
        isValidHeadlineIndex,
        normalizeHeadlineText,
        runViewTransition,
        scheduleBackgroundTask,
        triggerHapticFeedback,
        updateDocumentMetadata: updateHeadMetadata,
        updateHistoryList: renderHistoryList,
    } = Neckass;

    class HeadlineApp {
        constructor({ headlines: allHeadlines, elements, storage }) {
            this.headlines = Array.isArray(allHeadlines)
                ? [...allHeadlines]
                : [];
            this.baseHeadlineCount = this.headlines.length;
            this.elements = elements;
            this.storage = storage;
            this.state = storage.restore(this.headlines.length);
            this.state.isLoading = false;
            this.state.generatedHeadlines = Array.isArray(
                this.state.generatedHeadlines,
            )
                ? this.state.generatedHeadlines
                : [];
            this.filters = sanitizeFilters(this.state.filters);
            this.favoriteHeadlines = new Set(
                Array.isArray(this.state.favorites) ? this.state.favorites : [],
            );
            this.filteredIndexes = [];
            this.headlineCache = createHeadlineCache(this.headlines);
            appendGeneratedHeadlines({
                headlines: this.headlines,
                headlineCache: this.headlineCache,
                generatedHeadlines: this.state.generatedHeadlines || [],
            });
            this.handleDirectionalNavigation =
                this.handleDirectionalNavigation.bind(this);
            this.activeButton = null;
            this.celebrationTimer = null;
            this.headlineController = new Neckass.HeadlineController({
                app: this,
                dependencies: {
                    runViewTransition,
                    scheduleBackgroundTask,
                    updateHeadMetadata,
                    updateSocialShareLinks,
                    hasActiveFilters,
                    isValidHeadlineIndex,
                },
            });
            this.actionController = new Neckass.ActionController({
                app: this,
                dependencies: {
                    copyTextWithFeedback,
                    exportMockFront,
                    setButtonLoading,
                },
            });
        }

        init() {
            if (!this.validateRequiredElements()) {
                return;
            }

            this.bindEvents();
            this.applyUrlState();
            this.syncGeneratorControls();
            this.updateNavigationAvailability();
            this.updateMockDate();
            this.preflightExportAvailability();
            this.updateNextButtonLabel();
            this._renderInitialHeadlineCore();
        }

        validateRequiredElements() {
            const required = [
                ['nextButton', 'next action button'],
                ['previousButton', 'previous action button'],
                ['copyButton', 'copy action button'],
                ['headline', 'headline container'],
            ];

            const missing = required
                .filter(([key]) => !this.elements[key])
                .map(([, label]) => label);

            if (missing.length === 0) {
                return true;
            }

            console.error(
                `Missing required UI elements: ${missing.join(', ')}. Aborting app initialization.`,
            );
            return false;
        }
        bindEvents() {
            this.elements.nextButton.addEventListener('click', () =>
                this.handleNext(),
            );
            this.elements.previousButton.addEventListener('click', () =>
                this._handlePreviousCore(),
            );
            this.elements.copyButton.addEventListener('click', () =>
                this.copyHeadline(this.elements.copyButton),
            );
            this.elements.nativeShareButton?.addEventListener('click', () =>
                this.shareHeadline(this.elements.nativeShareButton),
            );
            this.elements.jumpCopyButton?.addEventListener('click', () =>
                this.copyHeadline(this.elements.jumpCopyButton),
            );
            this.elements.jumpShareButton?.addEventListener('click', () =>
                this.handleQuickShare(),
            );
            this.elements.jumpExportButton?.addEventListener('click', () =>
                this.handleQuickExport(),
            );
            this.elements.downloadMockButton?.addEventListener('click', () =>
                this.handleMockExport('download'),
            );
            this.elements.copyMockButton?.addEventListener('click', () =>
                this.handleMockExport('copy'),
            );
            this.elements.clearFiltersButton?.addEventListener('click', () =>
                this.clearAllFilters(),
            );
            [
                this.elements.twitterShareLink,
                this.elements.facebookShareLink,
                this.elements.redditShareLink,
                this.elements.linkedinShareLink,
                this.elements.threadsShareLink,
                this.elements.blueskyShareLink,
            ]
                .filter(Boolean)
                .forEach((link) => {
                    link.addEventListener('click', () => {
                        this.reportShareStatus('Share window opened.');
                    });
                });
            this.elements.headlineList?.addEventListener('click', (event) => {
                const target = event.target.closest('button[data-index]');
                if (!target) return;
                const index = Number.parseInt(target.dataset.index, 10);
                if (Number.isInteger(index)) {
                    this.activeButton = target;
                    this._selectHeadlineCore(index);
                }
            });
            window.addEventListener('popstate', (event) =>
                this._handlePopStateCore(event),
            );
            document.addEventListener(
                'keydown',
                this.handleDirectionalNavigation,
            );
        }

        async _handleNextCore() {
            if (this.state.isLoading) {
                return;
            }
            if (this.headlines.length === 0) {
                this._renderEmptyStateCore();
                return;
            }

            const generatorAvailable = this.isGeneratorAvailable();
            const wantsGenerated =
                this.filters.source === 'generated' ||
                (this.filters.source === 'auto' && generatorAvailable);
            let nextIndex = null;
            this.activeButton = this.elements.nextButton;

            if (wantsGenerated && generatorAvailable) {
                this.toggleLoader(true, 'Writing a new item.');
                nextIndex = await this.generateHeadlineWithFallback();
            }

            if (this.filters.source === 'generated' && !generatorAvailable) {
                this.toggleLoader(
                    true,
                    'Cannot write new items here. Showing one from the file.',
                );
            }

            if (nextIndex === null) {
                this.toggleLoader(true, 'Showing an item from the file.');
                nextIndex = this.getRandomIndex();
            }

            if (nextIndex === null) {
                this._renderEmptyStateCore();
                return;
            }

            triggerHapticFeedback('selection');
            this.renderHeadline(nextIndex);
        }

        _handlePreviousCore() {
            if (this.state.isLoading) {
                return;
            }
            if (this.state.navigationStack.length <= 1) {
                return;
            }
            this.activeButton = this.elements.previousButton;

            const removedIndex = this.state.navigationStack.pop();
            if (!this.state.navigationStack.includes(removedIndex)) {
                this.state.uniqueHeadlines.delete(removedIndex);
            }

            const previousIndex =
                this.state.navigationStack[
                    this.state.navigationStack.length - 1
                ];
            this.state.currentIndex = previousIndex;
            this.persistState();
            this.updateNavigationAvailability();
            triggerHapticFeedback('selection');
            this.renderHeadline(previousIndex, {
                pushToStack: false,
                replaceState: false,
            });
        }

        async handleGenerate() {
            const generatorAvailable = this.isGeneratorAvailable();
            this.activeButton = this.elements.generateButton;

            if (!generatorAvailable) {
                this.reportCopyStatus(
                    'Tiny model is unavailable in this session.',
                    true,
                );
                return;
            }

            this.toggleLoader(true, 'Writing a new item.');
            const generatedIndex = await this.generateHeadlineWithFallback();

            if (generatedIndex === null) {
                this.toggleLoader(
                    true,
                    'Nothing new. Showing an item from the file.',
                );
                const fallbackIndex = this.getRandomIndex();
                if (fallbackIndex === null) {
                    this._renderEmptyStateCore();
                    return;
                }
                this.renderHeadline(fallbackIndex);
                return;
            }

            if (!this.isIndexEligible(generatedIndex)) {
                const fallbackIndex = this.getRandomIndex();
                if (fallbackIndex === null) {
                    this._renderEmptyStateCore();
                    return;
                }
                this.renderHeadline(fallbackIndex);
                return;
            }

            this.renderHeadline(generatedIndex);
        }

        async generateHeadlineWithFallback() {
            try {
                const result = await window.tinyLlmClient.generateHeadline({
                    section: this.filters.section,
                    source:
                        this.filters.source === 'curated'
                            ? 'any'
                            : this.filters.source,
                    query: this.filters.query,
                    exclude: this.state.navigationStack
                        .map((index) => this.headlines[index])
                        .filter(Boolean)
                        .slice(-10),
                });
                const diagnostics =
                    typeof window.tinyLlmClient?.getLastDiagnostics ===
                    'function'
                        ? window.tinyLlmClient.getLastDiagnostics()
                        : null;
                if (diagnostics?.backend) {
                }
                const headlineText =
                    typeof result === 'string' ? result : result?.headline;
                return this.registerGeneratedHeadline(headlineText);
            } catch {
                const diagnostics =
                    typeof window.tinyLlmClient?.getLastDiagnostics ===
                    'function'
                        ? window.tinyLlmClient.getLastDiagnostics()
                        : null;
                if (diagnostics?.backend) {
                }
                this.updateLoaderMessage(
                    'Could not write a new item. Showing one from the file.',
                );
                return null;
            }
        }

        registerGeneratedHeadline(headlineText) {
            const normalized = this.normalizeGeneratedHeadline(headlineText);
            if (!normalized) {
                throw new Error('No headline text returned');
            }

            if (this.headlineCache.has(normalized)) {
                return this.headlineCache.get(normalized);
            }

            const newIndex = this.headlines.length;
            this.headlines.push(normalized);
            this.headlineCache.set(normalized, newIndex);
            this.state.generatedHeadlines = Array.isArray(
                this.state.generatedHeadlines,
            )
                ? this.state.generatedHeadlines
                : [];
            this.state.generatedHeadlines.push(normalized);
            this.persistState();
            this.refreshFilteredIndexes();
            return newIndex;
        }

        _renderHeadlineCore(
            index,
            options = { pushToStack: true, replaceState: false },
        ) {
            if (!isValidHeadlineIndex(index, this.headlines.length)) {
                this._renderEmptyStateCore();
                return;
            }

            this.clearCopyStatus();
            this.clearShareStatus();
            const loaderMessage =
                this.elements.loaderText?.textContent ||
                this.elements.loader.textContent ||
                'Loading.';
            this.toggleLoader(true, loaderMessage);
            this.elements.headline.classList.remove('show');

            scheduleBackgroundTask(() => {
                const headlineText = this.headlines[index];
                runViewTransition(() => {
                    this.elements.headline.textContent = headlineText;
                    this.elements.headline.classList.add('show');
                });
                this.toggleLoader(false);
                this.updateMockDate();

                this.updateViewedState(index, options);
                this.updateHeadlineBadges(index);
                updateHeadMetadata({
                    headline: headlineText,
                    index,
                    headlinesLength: this.headlines.length,
                    isValidHeadlineIndex,
                    getCanonicalUrl: (targetIndex) =>
                        this.getCanonicalUrl(targetIndex),
                    claimsIdentity: options.claimUrl !== false,
                });
                updateSocialShareLinks(
                    this.elements,
                    headlineText,
                    this.getCanonicalUrl(index),
                );
                this.updateMockHeadline(headlineText);
                this.persistState();
                // The initial render does not claim the address bar; see
                // _renderInitialHeadlineCore.
                if (options.claimUrl !== false) {
                    this.pushHistoryState(index, {
                        replace: options.replaceState,
                    });
                }
                this.updateHistoryList();
            });
        }

        _renderInitialHeadlineCore() {
            // A bare visit is a visit to the paper. The wire item showing on
            // arrival was not chosen by the reader, so it does not get to
            // rewrite the address, the title, or what a shared link resolves
            // to. Shuffling or arriving with ?headline= claims the URL; boot
            // does not.
            const claimUrl = getUrlState().hasHeadlineParam;
            if (
                this.state.navigationStack.length > 0 &&
                isValidHeadlineIndex(
                    this.state.currentIndex,
                    this.headlines.length,
                ) &&
                this.isIndexEligible(this.state.currentIndex)
            ) {
                this.renderHeadline(this.state.currentIndex, {
                    pushToStack: false,
                    replaceState: true,
                    claimUrl,
                });
                return;
            }

            if (this.filteredIndexes.length > 0) {
                const nextIndex = this.filteredIndexes[0];
                this.state.navigationStack = [nextIndex];
                this.state.currentIndex = nextIndex;
                this.renderHeadline(nextIndex, {
                    pushToStack: false,
                    replaceState: true,
                    claimUrl,
                });
                return;
            }

            this._renderEmptyStateCore();
        }

        _renderEmptyStateCore() {
            const hasFilters = hasActiveFilters(this.filters);
            this.elements.headline.textContent = hasFilters
                ? 'No items match these filters.'
                : 'No items on file.';
            this.elements.headline.style.color = '';
            this.clearCopyStatus();
            updateHeadMetadata({
                headline: '',
                index: -1,
                headlinesLength: this.headlines.length,
                isValidHeadlineIndex,
                getCanonicalUrl: (targetIndex) =>
                    this.getCanonicalUrl(targetIndex),
            });
            updateSocialShareLinks(this.elements, '', this.getCanonicalUrl(-1));
            this.updateMockHeadline('No items on file.');
            this.updateHeadlineBadges(null);
            this.updateHistoryList();
            this.toggleLoader(false, 'No items on file.');
            this.state.isLoading = false;
            this.state.navigationStack = [];
            this.state.currentIndex = -1;
            this.elements.nextButton.disabled = true;
            this.setNextButtonLabel(
                hasFilters ? 'Try a different filter' : 'Shuffle',
            );
            if (this.elements.clearFiltersButton) {
                this.elements.clearFiltersButton.hidden = !hasFilters;
                this.elements.clearFiltersButton.disabled = !hasFilters;
            }
            this.updateNavigationAvailability();
        }

        updateViewedState(index, options = { pushToStack: true }) {
            if (options.pushToStack && index !== this.state.currentIndex) {
                this.state.navigationStack.push(index);
            }

            this.state.uniqueHeadlines.add(index);
            this.state.currentIndex = index;

            this.persistState();
            this.updateNavigationAvailability();
        }

        updateNavigationAvailability() {
            const hasEligible =
                this.filteredIndexes.length > 0 ||
                this.filters.source === 'generated';
            this.elements.previousButton.disabled =
                this.state.isLoading || this.state.navigationStack.length <= 1;
            this.elements.nextButton.disabled =
                this.state.isLoading || !hasEligible;
            this.updateNextButtonLabel();
        }

        setNextButtonLabel(label) {
            if (!this.elements.nextButton) {
                return;
            }

            const labelElement =
                this.elements.nextButton.querySelector('.button-label') ||
                this.elements.nextButton.querySelector('span');
            if (labelElement) {
                labelElement.textContent = label;
                return;
            }

            this.elements.nextButton.textContent = label;
        }

        updateNextButtonLabel() {
            if (!this.elements.nextButton || this.state.isLoading) {
                return;
            }
            this.setNextButtonLabel('Shuffle');
        }

        _selectHeadlineCore(index) {
            if (!this.isIndexEligible(index)) return;
            this.state.currentIndex = index;
            if (
                this.state.navigationStack[
                    this.state.navigationStack.length - 1
                ] !== index
            ) {
                this.state.navigationStack.push(index);
            }
            this.renderHeadline(index, {
                pushToStack: false,
                replaceState: false,
            });
        }

        updateHeadlineBadges(index) {
            if (this.elements.headlineSource) {
                const label =
                    index === null ||
                    !isValidHeadlineIndex(index, this.headlines.length)
                        ? 'Source: unavailable'
                        : index >= this.baseHeadlineCount
                          ? 'Source: generated'
                          : 'Source: curated';
                this.elements.headlineSource.textContent = label;
            }
            if (this.elements.headlineSectionBadge) {
                const label =
                    index === null ||
                    !isValidHeadlineIndex(index, this.headlines.length)
                        ? 'Section: latest'
                        : `Section: ${classifyHeadline(this.headlines[index])}`;
                this.elements.headlineSectionBadge.textContent = label;
            }
        }

        updateHistoryList() {
            renderHistoryList({
                elements: this.elements,
                panel: this.filters.panel,
                isIndexEligible: (index) => this.isIndexEligible(index),
                favoriteHeadlines: this.favoriteHeadlines,
                headlineCache: this.headlineCache,
                headlines: this.headlines,
                baseHeadlineCount: this.baseHeadlineCount,
                navigationStack: this.state.navigationStack,
                currentIndex: this.state.currentIndex,
            });
        }

        async _shareHeadlineCore(
            triggerButton = this.elements.nativeShareButton,
        ) {
            const headline = this.headlines[this.state.currentIndex];
            const canonicalUrl = this.getCanonicalUrl(this.state.currentIndex);

            if (!headline || !canonicalUrl) {
                this.reportShareStatus('No headline available to share.', true);
                return;
            }

            if (!navigator.share || typeof navigator.share !== 'function') {
                this.reportShareStatus(
                    'Native sharing unavailable in this browser.',
                    true,
                );
                return;
            }

            const payload = {
                title: 'Neckass Headlines',
                text: headline,
                url: canonicalUrl,
            };

            if (
                navigator.canShare &&
                typeof navigator.canShare === 'function'
            ) {
                try {
                    if (!navigator.canShare(payload)) {
                        this.reportShareStatus(
                            'Native sharing unavailable in this browser.',
                            true,
                        );
                        return;
                    }
                } catch {
                    this.reportShareStatus(
                        'Native sharing unavailable in this browser.',
                        true,
                    );
                    return;
                }
            }

            setButtonLoading(triggerButton, true);
            try {
                await navigator.share(payload);
                this.reportShareStatus('Shared successfully.', false);
                triggerHapticFeedback('success');
            } catch (error) {
                if (error && error.name === 'AbortError') {
                    this.reportShareStatus('Share canceled.', false);
                } else {
                    this.reportShareStatus(
                        'Share failed. Please try again.',
                        true,
                    );
                }
            } finally {
                setButtonLoading(triggerButton, false);
            }
        }

        async _handleQuickShareCore() {
            const canUseNativeShare =
                navigator.share && typeof navigator.share === 'function';
            if (!canUseNativeShare) {
                this.jumpToCard('share');
                this.reportShareStatus(
                    'Native sharing unavailable in this browser.',
                    true,
                );
                return;
            }

            await this.shareHeadline(
                this.elements.jumpShareButton ||
                    this.elements.nativeShareButton,
            );
        }

        async _handleQuickExportCore() {
            if (!window.htmlToImage) {
                this.jumpToCard('export');
                this.reportExportStatus(
                    'Export unavailable. Reload, then try Download mock front page.',
                    true,
                );
                return;
            }

            await this.handleMockExport('download');
        }

        _handleDirectionalNavigationCore(event) {
            if (event.defaultPrevented) return;

            const target = event.target;
            if (target) {
                const tag = target.tagName?.toLowerCase();
                const isEditable = target.isContentEditable;
                if (
                    isEditable ||
                    ['input', 'textarea', 'select', 'button'].includes(tag)
                ) {
                    return;
                }
            }

            const forwardKeys = ['ArrowRight', 'ArrowDown'];
            const backwardKeys = ['ArrowLeft', 'ArrowUp'];

            if (forwardKeys.includes(event.key)) {
                event.preventDefault();
                this.handleNext().catch(() => {
                    this.toggleLoader(false);
                });
            } else if (backwardKeys.includes(event.key)) {
                event.preventDefault();
                this._handlePreviousCore();
            }
        }

        applyUrlState() {
            const urlState = getUrlState();
            this.filters = this.getFiltersFromUrl(urlState);
            if (
                this.filters.source === 'generated' &&
                !this.isGeneratorAvailable()
            ) {
                this.filters.source = 'auto';
            }
            this.persistState();
            this.refreshFilteredIndexes();
            this.applyMockLayoutClass();

            const index = this.identifierToIndex(urlState.headline);
            const eligibleIndex =
                isValidHeadlineIndex(index, this.headlines.length) &&
                this.isIndexEligible(index)
                    ? index
                    : null;
            // With no headline in the URL, resume where the restored session
            // left off rather than jumping to the first eligible entry.
            const restoredIndex = this.state.currentIndex;
            const restoredEligible =
                isValidHeadlineIndex(restoredIndex, this.headlines.length) &&
                this.isIndexEligible(restoredIndex);
            const fallbackIndex =
                eligibleIndex ??
                (restoredEligible ? restoredIndex : null) ??
                this.filteredIndexes[0] ??
                null;

            if (fallbackIndex !== null) {
                // Storage has just restored navigationStack. Replacing it here
                // discarded the whole session history on every boot; keep it,
                // and only extend it when the URL names a different headline.
                const stack = this.state.navigationStack;
                if (stack.length === 0) {
                    this.state.navigationStack = [fallbackIndex];
                } else if (stack[stack.length - 1] !== fallbackIndex) {
                    stack.push(fallbackIndex);
                }
                this.state.uniqueHeadlines.add(fallbackIndex);
                this.state.currentIndex = fallbackIndex;
                this.persistState();
                this.updateNavigationAvailability();
                // Only claim the URL when the reader arrived pointed at an
                // item. A bare visit is a visit to the paper, and rewriting
                // the address to a wire item nobody picked would make sharing
                // the homepage share that item instead of the issue.
                if (urlState.hasHeadlineParam) {
                    this.pushHistoryState(fallbackIndex, { replace: true });
                }
            } else if (index !== null || urlState.hasHeadlineParam) {
                this.pushHistoryState(-1, { replace: true });
            }
        }

        _handlePopStateCore(event) {
            const state = event.state || {};
            const urlState = getUrlState();
            const urlIndex = this.identifierToIndex(urlState.headline);
            const stateIndex = this.identifierToIndex(state.headlineIndex);
            this.filters = this.getFiltersFromUrl(urlState);
            this.refreshFilteredIndexes();
            this.applyMockLayoutClass();

            const targetIndex = isValidHeadlineIndex(
                stateIndex,
                this.headlines.length,
            )
                ? stateIndex
                : isValidHeadlineIndex(urlIndex, this.headlines.length)
                  ? urlIndex
                  : null;

            const eligibleTarget =
                targetIndex !== null && this.isIndexEligible(targetIndex)
                    ? targetIndex
                    : (this.filteredIndexes[0] ?? null);

            const restoredStack = Array.isArray(state.navigationStack)
                ? state.navigationStack.filter((idx) =>
                      isValidHeadlineIndex(idx, this.headlines.length),
                  )
                : [];
            const restoredUnique = Array.isArray(state.uniqueHeadlines)
                ? state.uniqueHeadlines.filter((idx) =>
                      isValidHeadlineIndex(idx, this.headlines.length),
                  )
                : [];

            if (eligibleTarget === null) {
                this._renderEmptyStateCore();
                return;
            }

            const filteredStack = restoredStack.filter((idx) =>
                this.isIndexEligible(idx),
            );
            this.state.navigationStack =
                filteredStack.length > 0 ? filteredStack : [eligibleTarget];
            if (!this.state.navigationStack.includes(eligibleTarget)) {
                this.state.navigationStack.push(eligibleTarget);
            }

            this.state.uniqueHeadlines = new Set([
                ...this.state.uniqueHeadlines,
                ...restoredUnique,
                eligibleTarget,
            ]);
            this.state.currentIndex = eligibleTarget;
            this.persistState();
            this.updateNavigationAvailability();
            this.renderHeadline(eligibleTarget, {
                pushToStack: false,
                replaceState: true,
            });
        }

        getFiltersFromUrl(urlState) {
            return sanitizeFilters({
                ...DEFAULT_FILTERS,
                section: urlState.section ?? DEFAULT_FILTERS.section,
                query: urlState.query ?? DEFAULT_FILTERS.query,
                source: urlState.source ?? DEFAULT_FILTERS.source,
                panel: urlState.panel ?? DEFAULT_FILTERS.panel,
                layout: urlState.layout ?? DEFAULT_FILTERS.layout,
            });
        }

        async _copyHeadlineCore(triggerButton = this.elements.copyButton) {
            const headlineText = this.elements.headline.innerText;

            if (!headlineText) {
                this.reportCopyStatus('No headline available to copy.', true);
                return;
            }

            await copyTextWithFeedback({
                text: headlineText,
                button: triggerButton,
                successMessage: 'Headline copied to clipboard.',
                onStatus: (message, isError) => {
                    this.reportCopyStatus(message, isError);
                    if (!isError) {
                        triggerHapticFeedback('success');
                        this.flashCopiedButtonLabel(triggerButton);
                    }
                },
                setButtonLoading,
            });
        }

        toggleLoader(shouldShow, message = null) {
            if (message && this.elements.loaderText) {
                this.elements.loaderText.textContent = message;
            } else if (message && this.elements.loader) {
                this.elements.loader.textContent = message;
            }
            if (this.elements.loader) {
                this.elements.loader.classList.toggle('is-visible', shouldShow);
                this.elements.loader.setAttribute(
                    'aria-hidden',
                    shouldShow ? 'false' : 'true',
                );
            }
            this.setNavigationLoading(shouldShow);
        }

        setNavigationLoading(shouldShow) {
            this.state.isLoading = shouldShow;
            this.updateNavigationAvailability();
            if (this.activeButton) {
                setButtonLoading(this.activeButton, shouldShow);
            }
            if (this.elements.headlineList) {
                this.elements.headlineList.setAttribute(
                    'aria-busy',
                    shouldShow ? 'true' : 'false',
                );
                this.elements.headlineList
                    .querySelectorAll('button[data-index]')
                    .forEach((button) => {
                        button.disabled = shouldShow;
                    });
            }
        }

        updateLoaderMessage(message) {
            if (this.elements.loaderText) {
                this.elements.loaderText.textContent = message;
                return;
            }
            if (!this.elements.loader) return;
            this.elements.loader.textContent = message;
        }

        updateMockHeadline(text) {
            if (this.elements.mockHeadline) {
                this.elements.mockHeadline.textContent = text;
            }
        }

        preflightExportAvailability() {
            if (!this.elements.exportStatus) return;
            if (this.elements.downloadMockButton) {
                this.elements.downloadMockButton.disabled = !window.htmlToImage;
                this.elements.downloadMockButton.setAttribute(
                    'aria-disabled',
                    String(!window.htmlToImage),
                );
            }
            if (this.elements.copyMockButton) {
                this.elements.copyMockButton.disabled = !window.htmlToImage;
                this.elements.copyMockButton.setAttribute(
                    'aria-disabled',
                    String(!window.htmlToImage),
                );
            }
            if (!window.htmlToImage) {
                this.reportExportStatus(
                    'Export unavailable. Reload, then try Download mock front page.',
                    true,
                );
            }
        }

        updateMockDate() {
            const now = new Date();
            const dateFormatter = new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            });
            if (this.elements.mockDate) {
                this.elements.mockDate.textContent = dateFormatter.format(now);
            }

            // The masthead belongs to the issue: modules/issue.js derives the
            // date and number, including for back issues, so nothing here
            // second-guesses it.
        }

        async _handleMockExportCore(mode) {
            await exportMockFront({
                mode,
                elements: this.elements,
                reportStatus: (message, isError) =>
                    this.reportExportStatus(message, isError),
                setButtonLoading,
            });
        }

        jumpToCard(type) {
            const cardMap = {
                copy: {
                    section: this.elements.copySection,
                    focus: this.elements.copyButton,
                },
                share: {
                    section: this.elements.socialShare,
                    focus: this.elements.nativeShareButton,
                },
                export: {
                    section: this.elements.exportSection,
                    focus: this.elements.downloadMockButton,
                },
            };

            const target = cardMap[type];
            if (!target?.section) return;
            target.section.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });

            if (target.focus) {
                window.setTimeout(() => {
                    target.focus.focus({ preventScroll: true });
                }, 220);
            }
        }

        getRandomIndex() {
            const pool =
                this.filteredIndexes.length > 0 ? this.filteredIndexes : [];

            if (pool.length === 0) {
                return null;
            }

            if (pool.length === 1) {
                return pool[0];
            }

            const unvisitedPool = pool.filter(
                (index) => !this.state.navigationStack.includes(index),
            );
            if (unvisitedPool.length > 0) {
                return unvisitedPool[
                    Math.floor(Math.random() * unvisitedPool.length)
                ];
            }

            let randomIndex = pool[Math.floor(Math.random() * pool.length)];
            while (randomIndex === this.state.currentIndex && pool.length > 1) {
                randomIndex = pool[Math.floor(Math.random() * pool.length)];
            }

            return randomIndex;
        }

        normalizeGeneratedHeadline(headlineText) {
            const normalized = normalizeHeadlineText(headlineText);
            if (!normalized) {
                return '';
            }

            const maxLength = 132;
            if (normalized.length <= maxLength) {
                return normalized;
            }

            const clipped = normalized.slice(0, maxLength);
            const lastBreak = Math.max(
                clipped.lastIndexOf(' · '),
                clipped.lastIndexOf(' — '),
                clipped.lastIndexOf(', '),
                clipped.lastIndexOf(' '),
            );
            const safeClip =
                lastBreak > 90 ? clipped.slice(0, lastBreak) : clipped;
            return `${safeClip.trim()}…`;
        }

        registerSharedHeadline(headlineText) {
            const normalized = normalizeHeadlineText(headlineText);
            if (!normalized) return null;
            if (this.headlineCache.has(normalized)) {
                return this.headlineCache.get(normalized);
            }

            const newIndex = this.headlines.length;
            this.headlines.push(normalized);
            this.headlineCache.set(normalized, newIndex);
            this.state.generatedHeadlines = Array.isArray(
                this.state.generatedHeadlines,
            )
                ? this.state.generatedHeadlines
                : [];
            this.state.generatedHeadlines.push(normalized);
            this.persistState();
            this.refreshFilteredIndexes();
            return newIndex;
        }

        persistState() {
            this.storage.persist({
                navigationStack: this.state.navigationStack,
                uniqueHeadlines: this.state.uniqueHeadlines,
                currentIndex: this.state.currentIndex,
                generatedHeadlines: this.state.generatedHeadlines,
                favorites: Array.from(this.favoriteHeadlines),
                filters: this.filters,
            });
        }

        isGeneratorAvailable() {
            return typeof window.tinyLlmClient?.generateHeadline === 'function';
        }

        syncGeneratorControls() {
            const generatorAvailable = this.isGeneratorAvailable();
            if (this.elements.generateButton) {
                this.elements.generateButton.disabled = !generatorAvailable;
                this.elements.generateButton.setAttribute(
                    'aria-disabled',
                    String(!generatorAvailable),
                );
            }
            if (this.elements.sourceButtons) {
                this.elements.sourceButtons.forEach((button) => {
                    if (button.dataset.source === 'generated') {
                        button.disabled = !generatorAvailable;
                        button.setAttribute(
                            'aria-disabled',
                            String(!generatorAvailable),
                        );
                    }
                });
            }
        }

        async handleNext() {
            return this.headlineController.handleNext();
        }
        handlePrevious() {
            return this.headlineController.handlePrevious();
        }
        renderHeadline(
            index,
            options = { pushToStack: true, replaceState: false },
        ) {
            return this.headlineController.renderHeadline(index, options);
        }
        renderInitialHeadline() {
            return this.headlineController.renderInitialHeadline();
        }
        renderEmptyState() {
            return this.headlineController.renderEmptyState();
        }
        selectHeadline(index) {
            return this.headlineController.selectHeadline(index);
        }
        handleDirectionalNavigation(event) {
            return this.headlineController.handleDirectionalNavigation(event);
        }
        handlePopState(event) {
            return this.headlineController.handlePopState(event);
        }

        async shareHeadline(triggerButton = this.elements.nativeShareButton) {
            return this.actionController.shareHeadline(triggerButton);
        }
        async handleQuickShare() {
            return this.actionController.handleQuickShare();
        }
        async handleQuickExport() {
            return this.actionController.handleQuickExport();
        }
        async handleMockExport(mode) {
            return this.actionController.handleMockExport(mode);
        }
        async copyHeadline(triggerButton = this.elements.copyButton) {
            return this.actionController.copyHeadline(triggerButton);
        }

        pushHistoryState(index, { replace = false } = {}) {
            updateHistoryState({
                index,
                headlines: this.headlines,
                filters: this.filters,
                navigationStack: this.state.navigationStack,
                uniqueHeadlines: this.state.uniqueHeadlines,
                identifierFromIndex: (idx) => this.identifierFromIndex(idx),
                isValidHeadlineIndex,
                replace,
            });
        }
    }

    // Method groups that live in their own modules; they are plain objects of
    // shorthand methods, so `this` behaves exactly as it did in the class body.
    Object.assign(
        HeadlineApp.prototype,
        Neckass.filterMethods,
        Neckass.agentApiMethods,
        Neckass.feedbackMethods,
        Neckass.statusMethods,
    );

    Neckass.HeadlineApp = HeadlineApp;
})();
