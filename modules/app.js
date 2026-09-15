(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;
    const {
        copyTextWithFeedback,
        getUrlState,
        updateHistoryState,
        exportClipping,
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
            this.favoriteHeadlines = new Set(
                Array.isArray(this.state.favorites) ? this.state.favorites : [],
            );
            this.headlineCache = createHeadlineCache(this.headlines);
            appendGeneratedHeadlines({
                headlines: this.headlines,
                headlineCache: this.headlineCache,
                generatedHeadlines: this.state.generatedHeadlines || [],
            });
            this.handleDirectionalNavigation =
                this.handleDirectionalNavigation.bind(this);
            this.activeButton = null;
        }

        init() {
            if (!this.validateRequiredElements()) {
                return;
            }

            this.bindEvents();
            this.applyUrlState();
            this.updateNavigationAvailability();
            this.updateClippingDate();
            this.preflightExportAvailability();
            this.updateNextButtonLabel();
            this.renderInitialHeadline();
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
                this.handlePrevious(),
            );
            this.elements.copyButton.addEventListener('click', () =>
                this.copyHeadline(this.elements.copyButton),
            );
            this.elements.nativeShareButton?.addEventListener('click', () =>
                this.shareHeadline(this.elements.nativeShareButton),
            );
            this.elements.downloadClippingButton?.addEventListener(
                'click',
                () => this.handleClippingExport('download'),
            );
            this.elements.copyClippingButton?.addEventListener('click', () =>
                this.handleClippingExport('copy'),
            );
            [
                this.elements.twitterShareLink,
                this.elements.facebookShareLink,
                this.elements.redditShareLink,
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
                    this.selectHeadline(index);
                }
            });
            window.addEventListener('popstate', (event) =>
                this.handlePopState(event),
            );
            document.addEventListener(
                'keydown',
                this.handleDirectionalNavigation,
            );
        }

        async handleNext() {
            if (this.state.isLoading) {
                return;
            }
            if (this.headlines.length === 0) {
                this.renderEmptyState();
                return;
            }

            this.activeButton = this.elements.nextButton;

            // The wire deals from the written catalogue. The on-device
            // generator cannot produce specificity, and specificity is where
            // the joke is; it remains reachable through the agent API's
            // `generate` tool for anyone who wants it.
            this.toggleLoader(true, 'Loading.');
            const nextIndex = this.getRandomIndex();

            if (nextIndex === null) {
                this.renderEmptyState();
                return;
            }

            triggerHapticFeedback('selection');
            this.renderHeadline(nextIndex);
        }

        handlePrevious() {
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
                    this.renderEmptyState();
                    return;
                }
                this.renderHeadline(fallbackIndex);
                return;
            }

            if (!isValidHeadlineIndex(generatedIndex, this.headlines.length)) {
                const fallbackIndex = this.getRandomIndex();
                if (fallbackIndex === null) {
                    this.renderEmptyState();
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
            this.updateNavigationAvailability();
            this.updateHistoryList();
            return newIndex;
        }

        renderHeadline(
            index,
            options = { pushToStack: true, replaceState: false },
        ) {
            if (!isValidHeadlineIndex(index, this.headlines.length)) {
                this.renderEmptyState();
                return;
            }

            this.clearItemStatus();
            const loaderMessage =
                this.elements.loader?.textContent ||
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
                this.updateClippingDate();

                this.updateViewedState(index, options);
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
                this.updateClippingHeadline(headlineText);
                this.persistState();
                // The initial render does not claim the address bar; see
                // renderInitialHeadline.
                if (options.claimUrl !== false) {
                    this.pushHistoryState(index, {
                        replace: options.replaceState,
                    });
                }
                this.updateHistoryList();
            });
        }

        renderInitialHeadline() {
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
                )
            ) {
                this.renderHeadline(this.state.currentIndex, {
                    pushToStack: false,
                    replaceState: true,
                    claimUrl,
                });
                return;
            }

            if (this.headlines.length > 0) {
                const nextIndex = 0;
                this.state.navigationStack = [nextIndex];
                this.state.currentIndex = nextIndex;
                this.renderHeadline(nextIndex, {
                    pushToStack: false,
                    replaceState: true,
                    claimUrl,
                });
                return;
            }

            this.renderEmptyState();
        }

        renderEmptyState() {
            this.elements.headline.textContent = 'No items on file.';
            this.elements.headline.style.color = '';
            this.clearItemStatus();
            updateHeadMetadata({
                headline: '',
                index: -1,
                headlinesLength: this.headlines.length,
                isValidHeadlineIndex,
                getCanonicalUrl: (targetIndex) =>
                    this.getCanonicalUrl(targetIndex),
            });
            updateSocialShareLinks(this.elements, '', this.getCanonicalUrl(-1));
            this.updateClippingHeadline('No items on file.');
            this.updateHistoryList();
            this.toggleLoader(false, 'No items on file.');
            this.state.isLoading = false;
            this.state.navigationStack = [];
            this.state.currentIndex = -1;
            this.elements.nextButton.disabled = true;
            this.setNextButtonLabel('Shuffle');
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

        selectHeadline(index) {
            if (!isValidHeadlineIndex(index, this.headlines.length)) return;
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

        updateHistoryList() {
            renderHistoryList({
                elements: this.elements,
                headlines: this.headlines,
                navigationStack: this.state.navigationStack,
                currentIndex: this.state.currentIndex,
            });
        }

        async shareHeadline(triggerButton = this.elements.nativeShareButton) {
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

        handleDirectionalNavigation(event) {
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
                this.handlePrevious();
            }
        }

        applyUrlState() {
            const urlState = getUrlState();
            this.persistState();
            this.updateNavigationAvailability();
            this.updateHistoryList();

            const index = this.identifierToIndex(urlState.headline);
            const namedIndex = isValidHeadlineIndex(
                index,
                this.headlines.length,
            )
                ? index
                : null;
            // With no headline in the URL, resume where the restored session
            // left off rather than jumping to the first entry.
            const restoredIndex = this.state.currentIndex;
            const restoredValid = isValidHeadlineIndex(
                restoredIndex,
                this.headlines.length,
            );
            const fallbackIndex =
                namedIndex ??
                (restoredValid ? restoredIndex : null) ??
                (this.headlines.length > 0 ? 0 : null);

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

        handlePopState(event) {
            const state = event.state || {};
            const urlState = getUrlState();
            const urlIndex = this.identifierToIndex(urlState.headline);
            const stateIndex = this.identifierToIndex(state.headlineIndex);

            const targetIndex = isValidHeadlineIndex(
                stateIndex,
                this.headlines.length,
            )
                ? stateIndex
                : isValidHeadlineIndex(urlIndex, this.headlines.length)
                  ? urlIndex
                  : null;

            const eligibleTarget =
                targetIndex ?? (this.headlines.length > 0 ? 0 : null);

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
                this.renderEmptyState();
                return;
            }

            this.state.navigationStack =
                restoredStack.length > 0 ? restoredStack : [eligibleTarget];
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

        async copyHeadline(triggerButton = this.elements.copyButton) {
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

        updateClippingHeadline(text) {
            if (this.elements.clippingHeadline) {
                this.elements.clippingHeadline.textContent = text;
            }
        }

        preflightExportAvailability() {
            if (!this.elements.exportStatus) return;
            if (this.elements.downloadClippingButton) {
                this.elements.downloadClippingButton.disabled =
                    !window.htmlToImage;
                this.elements.downloadClippingButton.setAttribute(
                    'aria-disabled',
                    String(!window.htmlToImage),
                );
            }
            if (this.elements.copyClippingButton) {
                this.elements.copyClippingButton.disabled = !window.htmlToImage;
                this.elements.copyClippingButton.setAttribute(
                    'aria-disabled',
                    String(!window.htmlToImage),
                );
            }
            if (!window.htmlToImage) {
                this.reportExportStatus(
                    'Export unavailable. Reload, then try Download clipping.',
                    true,
                );
            }
        }

        updateClippingDate() {
            const now = new Date();
            const dateFormatter = new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            });
            if (this.elements.clippingDate) {
                this.elements.clippingDate.textContent =
                    dateFormatter.format(now);
            }

            // The masthead belongs to the issue: modules/issue.js derives the
            // date and number, including for back issues, so nothing here
            // second-guesses it.
        }

        async handleClippingExport(mode) {
            await exportClipping({
                mode,
                elements: this.elements,
                reportStatus: (message, isError) =>
                    this.reportExportStatus(message, isError),
                setButtonLoading,
            });
        }

        getRandomIndex() {
            const pool = this.headlines.map((_, index) => index);

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
            this.updateNavigationAvailability();
            this.updateHistoryList();
            return newIndex;
        }

        persistState() {
            this.storage.persist({
                navigationStack: this.state.navigationStack,
                uniqueHeadlines: this.state.uniqueHeadlines,
                currentIndex: this.state.currentIndex,
                generatedHeadlines: this.state.generatedHeadlines,
                favorites: Array.from(this.favoriteHeadlines),
            });
        }

        isGeneratorAvailable() {
            return typeof window.tinyLlmClient?.generateHeadline === 'function';
        }

        pushHistoryState(index, { replace = false } = {}) {
            updateHistoryState({
                index,
                headlines: this.headlines,
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
        Neckass.agentApiMethods,
        Neckass.feedbackMethods,
        Neckass.statusMethods,
        Neckass.loaderMethods,
    );

    Neckass.HeadlineApp = HeadlineApp;
})();
