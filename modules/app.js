(() => {
    const Neckass = window.Neckass = window.Neckass || {};
    const {
        copyTextWithFeedback,
        DEFAULT_FILTERS,
        classifyHeadline,
        getEligibleIndexes,
        hasActiveFilters,
        isIndexEligible,
        sanitizeFilters,
        buildHeadlineUrl,
        getUrlState,
        updateHistoryState,
        exportMockFront,
        updateSocialShareLinks,
        appendGeneratedHeadlines,
        createHeadlineCache,
        setButtonLoading,
        updateLayoutButtons,
        updateToggleButtons,
        isValidHeadlineIndex,
        normalizeHeadlineText,
        selectReadableColor,
        slugifyHeadline,
        runViewTransition
    } = Neckass;
    const renderFilterStatus = Neckass.updateFilterStatus;

    const ANIMATION_DELAY_MS = 60;
    const STREAK_MILESTONES = [3, 5, 8, 12];

    class HeadlineApp {
    constructor({ headlines: allHeadlines, elements, storage }) {
        this.headlines = Array.isArray(allHeadlines) ? [...allHeadlines] : [];
        this.baseHeadlineCount = this.headlines.length;
        this.elements = elements;
        this.storage = storage;
        this.state = storage.restore(this.headlines.length);
        this.state.isLoading = false;
        this.state.generatedHeadlines = Array.isArray(this.state.generatedHeadlines) ? this.state.generatedHeadlines : [];
        this.filters = sanitizeFilters(this.state.filters);
        this.favoriteHeadlines = new Set(Array.isArray(this.state.favorites) ? this.state.favorites : []);
        this.filteredIndexes = [];
        this.headlineCache = createHeadlineCache(this.headlines);
        appendGeneratedHeadlines({
            headlines: this.headlines,
            headlineCache: this.headlineCache,
            generatedHeadlines: this.state.generatedHeadlines || []
        });
        this.handleDirectionalNavigation = this.handleDirectionalNavigation.bind(this);
        this.activeButton = null;
        this.shuffleStreak = 0;
        this.shouldIncrementStreak = false;
        this.celebrationTimer = null;
        this.dailyEngagement = this.normalizeDailyEngagement(this.state.dailyEngagement);
        this.dailyVisitMeta = { isReturnVisitToday: false, advancedStreakToday: false };
    }

    init() {
        this.bindEvents();
        this.applyUrlState();
        this.syncGeneratorControls();
        this.updateHeadlineCounter();
        this.updateNavigationAvailability();
        this.updateMockDate();
        this.refreshDailyEngagement();
        this.renderDailyStreak();
        this.preflightExportAvailability();
        this.renderShuffleStreak();
        this.updateNextButtonLabel();
        this.renderInitialHeadline();
    }

    bindEvents() {
        this.elements.nextButton.addEventListener('click', () => this.handleNext());
        this.elements.previousButton.addEventListener('click', () => this.handlePrevious());
        this.elements.copyButton.addEventListener('click', () => this.copyHeadline(this.elements.copyButton));
        this.elements.nativeShareButton?.addEventListener('click', () => this.shareHeadline(this.elements.nativeShareButton));
        this.elements.jumpCopyButton?.addEventListener('click', () => this.jumpToCard('copy'));
        this.elements.jumpShareButton?.addEventListener('click', () => this.jumpToCard('share'));
        this.elements.jumpExportButton?.addEventListener('click', () => this.jumpToCard('export'));
        this.elements.copyLinkButton?.addEventListener('click', () => this.copyHeadlineLink());
        this.elements.generateButton?.addEventListener('click', () => this.handleGenerate());
        this.elements.favoriteButton?.addEventListener('click', () => this.toggleFavorite());
        this.elements.downloadMockButton?.addEventListener('click', () => this.handleMockExport('download'));
        this.elements.copyMockButton?.addEventListener('click', () => this.handleMockExport('copy'));
        this.elements.applySearchButton?.addEventListener('click', () => this.applySearch());
        this.elements.clearSearchButton?.addEventListener('click', () => this.clearSearch());
        this.elements.searchForm?.addEventListener('submit', (event) => {
            event.preventDefault();
            this.applySearch();
        });
        this.elements.sectionButtons?.forEach((button) => {
            button.addEventListener('click', () => this.setSectionFilter(button.dataset.section || 'latest'));
        });
        this.elements.sourceButtons?.forEach((button) => {
            button.addEventListener('click', () => this.setSourceFilter(button.dataset.source || 'auto'));
        });
        this.elements.panelButtons?.forEach((button) => {
            button.addEventListener('click', () => this.setActivePanel(button.dataset.panel || 'recent'));
        });
        this.elements.layoutButtons?.forEach((button) => {
            button.addEventListener('click', () => this.setMockLayout(button.dataset.layout || 'standard'));
        });
        this.elements.clearFiltersButton?.addEventListener('click', () => this.clearAllFilters());
        [
            this.elements.twitterShareLink,
            this.elements.facebookShareLink,
            this.elements.redditShareLink,
            this.elements.linkedinShareLink,
            this.elements.threadsShareLink,
            this.elements.blueskyShareLink
        ].filter(Boolean).forEach((link) => {
            link.addEventListener('click', () => {
                this.reportShareStatus('Opened in a new tab.');
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
        window.addEventListener('popstate', (event) => this.handlePopState(event));
        document.addEventListener('keydown', this.handleDirectionalNavigation);
    }

    async handleNext() {
        if (this.state.isLoading) {
            return;
        }
        if (this.headlines.length === 0) {
            this.renderEmptyState();
            return;
        }

        const generatorAvailable = this.isGeneratorAvailable();
        const wantsGenerated = this.filters.source === 'generated'
            || (this.filters.source === 'auto' && generatorAvailable);
        let nextIndex = null;
        this.activeButton = this.elements.nextButton;
        this.shouldIncrementStreak = true;

        if (wantsGenerated && generatorAvailable) {
            this.toggleLoader(true, 'Generating headline with the tiny model...');
            nextIndex = await this.generateHeadlineWithFallback();
        }

        if (this.filters.source === 'generated' && !generatorAvailable) {
            this.toggleLoader(true, 'Tiny model unavailable, using curated headlines.');
        }

        if (nextIndex === null) {
            this.toggleLoader(true, 'Shuffling stored headlines...');
            nextIndex = this.getRandomIndex();
        }

        if (nextIndex === null) {
            this.renderEmptyState();
            return;
        }

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
        this.shouldIncrementStreak = false;

        const removedIndex = this.state.navigationStack.pop();
        if (!this.state.navigationStack.includes(removedIndex)) {
            this.state.uniqueHeadlines.delete(removedIndex);
        }

        const previousIndex = this.state.navigationStack[this.state.navigationStack.length - 1];
        this.state.currentIndex = previousIndex;
        this.persistState();
        this.updateHeadlineCounter();
        this.updateNavigationAvailability();
        this.renderHeadline(previousIndex, { pushToStack: false, replaceState: false });
    }

    async handleGenerate() {
        const generatorAvailable = this.isGeneratorAvailable();
        this.activeButton = this.elements.generateButton;
        this.shouldIncrementStreak = false;

        if (!generatorAvailable) {
            this.reportCopyStatus('Tiny model is unavailable in this session.', true);
            return;
        }

        this.toggleLoader(true, 'Generating headline with the tiny model...');
        const generatedIndex = await this.generateHeadlineWithFallback();

        if (generatedIndex === null) {
            this.toggleLoader(true, 'Falling back to stored headlines...');
            const fallbackIndex = this.getRandomIndex();
            if (fallbackIndex === null) {
                this.renderEmptyState();
                return;
            }
            this.renderHeadline(fallbackIndex);
            return;
        }

        if (!this.isIndexEligible(generatedIndex)) {
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
            const headlineText = await window.tinyLlmClient.generateHeadline();
            return this.registerGeneratedHeadline(headlineText);
        } catch (error) {
            this.updateLoaderMessage('Generation unavailable, using saved headlines.');
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
        this.state.generatedHeadlines = Array.isArray(this.state.generatedHeadlines) ? this.state.generatedHeadlines : [];
        this.state.generatedHeadlines.push(normalized);
        this.persistState();
        this.refreshFilteredIndexes();
        return newIndex;
    }

    renderHeadline(index, options = { pushToStack: true, replaceState: false }) {
        if (!isValidHeadlineIndex(index, this.headlines.length)) {
            this.renderEmptyState();
            return;
        }

        this.clearCopyStatus();
        this.clearShareStatus();
        const loaderMessage = this.elements.loaderText?.textContent || this.elements.loader.textContent || 'Loading headline...';
        const previousIndex = this.state.currentIndex;
        const shouldIncrementStreak = this.shouldIncrementStreak;
        this.shouldIncrementStreak = false;
        this.toggleLoader(true, loaderMessage);
        this.elements.headline.classList.remove('show');

        setTimeout(() => {
            const headlineText = this.headlines[index];
            runViewTransition(() => {
                this.elements.headline.textContent = headlineText;
                this.elements.headline.style.color = selectReadableColor();
                this.elements.headline.classList.add('show');
            });
            this.toggleLoader(false);
            this.updateMockDate();

            this.updateViewedState(index, options);
            this.updateShuffleStreak(shouldIncrementStreak && previousIndex !== index);
            this.updateHeadlineBadges(index);
            this.updateFavoriteButton();
            this.updateDocumentMetadata(headlineText, index);
            updateSocialShareLinks(this.elements, headlineText, this.getCanonicalUrl(index));
            this.updateMockHeadline(headlineText);
            this.persistState();
            this.pushHistoryState(index, { replace: options.replaceState });
            this.updateHistoryList();
        }, ANIMATION_DELAY_MS);
    }

    renderInitialHeadline() {
        if (this.state.navigationStack.length > 0
            && isValidHeadlineIndex(this.state.currentIndex, this.headlines.length)
            && this.isIndexEligible(this.state.currentIndex)) {
            this.renderHeadline(this.state.currentIndex, { pushToStack: false, replaceState: true });
            return;
        }

        if (this.filteredIndexes.length > 0) {
            const nextIndex = this.filteredIndexes[0];
            this.state.navigationStack = [nextIndex];
            this.state.currentIndex = nextIndex;
            this.renderHeadline(nextIndex, { pushToStack: false, replaceState: true });
            return;
        }

        this.renderEmptyState();
    }

    renderEmptyState() {
        const hasFilters = hasActiveFilters(this.filters);
        this.elements.headline.textContent = hasFilters
            ? 'No headlines match your current filters.'
            : 'No headlines available.';
        this.elements.headline.style.color = '';
        this.clearCopyStatus();
        this.updateDocumentMetadata('', -1);
        updateSocialShareLinks(this.elements, '', this.getCanonicalUrl(-1));
        this.updateMockHeadline('No headlines available.');
        this.updateHeadlineBadges(null);
        this.updateFavoriteButton();
        this.updateHistoryList();
        this.toggleLoader(false, 'No headlines available.');
        this.state.isLoading = false;
        this.state.navigationStack = [];
        this.state.currentIndex = -1;
        this.elements.nextButton.disabled = true;
        this.setNextButtonLabel(hasFilters ? 'Try a different filter' : 'Shuffle');
        this.updateShuffleStreak(false);
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
        this.updateHeadlineCounter();
        this.updateNavigationAvailability();
    }

    updateHeadlineCounter() {
        this.elements.counter.textContent = this.state.uniqueHeadlines.size;
    }

    normalizeDailyEngagement(rawEngagement) {
        const parsed = rawEngagement && typeof rawEngagement === 'object' ? rawEngagement : {};
        const streakDays = Number.isInteger(parsed.streakDays) && parsed.streakDays > 0 ? parsed.streakDays : 0;
        const visitsThisDate = Number.isInteger(parsed.visitsThisDate) && parsed.visitsThisDate > 0 ? parsed.visitsThisDate : 0;
        const maxStreakDays = Number.isInteger(parsed.maxStreakDays) && parsed.maxStreakDays > 0
            ? parsed.maxStreakDays
            : streakDays;

        return {
            lastVisitDate: typeof parsed.lastVisitDate === 'string' ? parsed.lastVisitDate : '',
            streakDays,
            visitsThisDate,
            maxStreakDays
        };
    }

    getDateKey(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    getDayDifference(previousDateKey, currentDateKey) {
        const toDate = (key) => {
            const [year, month, day] = key.split('-').map(Number);
            return new Date(year, (month || 1) - 1, day || 1);
        };

        const previous = toDate(previousDateKey);
        const current = toDate(currentDateKey);
        if (Number.isNaN(previous.getTime()) || Number.isNaN(current.getTime())) {
            return Number.NaN;
        }

        const msPerDay = 24 * 60 * 60 * 1000;
        return Math.round((current - previous) / msPerDay);
    }

    refreshDailyEngagement() {
        const todayKey = this.getDateKey();
        const engagement = this.normalizeDailyEngagement(this.dailyEngagement);
        const previousKey = engagement.lastVisitDate;

        this.dailyVisitMeta = {
            isReturnVisitToday: previousKey === todayKey,
            advancedStreakToday: false
        };

        if (!previousKey) {
            engagement.streakDays = 1;
            engagement.visitsThisDate = 1;
        } else if (previousKey === todayKey) {
            engagement.visitsThisDate += 1;
        } else {
            const dayDifference = this.getDayDifference(previousKey, todayKey);
            engagement.streakDays = dayDifference === 1 ? engagement.streakDays + 1 : 1;
            engagement.visitsThisDate = 1;
            this.dailyVisitMeta.advancedStreakToday = dayDifference === 1;
        }

        engagement.lastVisitDate = todayKey;
        engagement.maxStreakDays = Math.max(engagement.maxStreakDays || 0, engagement.streakDays);

        this.dailyEngagement = engagement;
        this.state.dailyEngagement = engagement;
        this.persistState();
        this.maybeCelebrateDailyMilestone();
    }

    renderDailyStreak() {
        if (!this.elements.dailyStreak) return;

        const streakDays = this.dailyEngagement.streakDays || 1;
        const visitsToday = this.dailyEngagement.visitsThisDate || 1;
        const dayLabel = streakDays === 1 ? 'day' : 'days';
        let suffix = 'Come back tomorrow to build momentum.';

        if (this.dailyVisitMeta.advancedStreakToday && streakDays >= 2) {
            suffix = streakDays >= 7 ? 'Weekly streak rolling. Keep it alive.' : 'Run extended. Keep the desk hot.';
        } else if (this.dailyVisitMeta.isReturnVisitToday && visitsToday > 1) {
            suffix = `Visit ${visitsToday} today.`;
        }

        this.elements.dailyStreak.textContent = `Daily desk streak: ${streakDays} ${dayLabel} · ${suffix}`;
    }

    maybeCelebrateDailyMilestone() {
        if (!this.dailyVisitMeta.advancedStreakToday) {
            return;
        }

        const milestoneMessages = {
            3: 'Daily streak 3: now it is a habit.',
            7: 'Daily streak 7: full-week momentum.',
            14: 'Daily streak 14: newsroom legend status.'
        };

        const message = milestoneMessages[this.dailyEngagement.streakDays];
        if (message) {
            this.showToast(message);
        }
    }

    renderShuffleStreak() {
        if (!this.elements.shuffleStreak) return;
        if (this.shuffleStreak <= 0) {
            this.elements.shuffleStreak.textContent = 'Shuffle streak: 0 · Start a run.';
            return;
        }

        const nextMilestone = STREAK_MILESTONES.find((milestone) => milestone > this.shuffleStreak) || null;
        const suffix = this.shuffleStreak >= 8
            ? 'Headline hurricane.'
            : this.shuffleStreak >= 5
                ? 'Desk is on fire.'
                : 'Nice rhythm.';
        const nextMilestoneText = nextMilestone
            ? `${nextMilestone - this.shuffleStreak} to badge ${nextMilestone}.`
            : 'Legend badge unlocked.';
        this.elements.shuffleStreak.textContent = `Shuffle streak: ${this.shuffleStreak} · ${suffix} ${nextMilestoneText}`;
    }

    updateShuffleStreak(shouldIncrement) {
        this.shuffleStreak = shouldIncrement ? this.shuffleStreak + 1 : 0;
        this.renderShuffleStreak();
        this.updateNextButtonLabel();
        if (shouldIncrement) {
            this.handleShuffleMilestone();
        } else {
            this.clearCelebration();
        }
    }

    handleShuffleMilestone() {
        const messages = {
            3: 'Shuffle streak 3: rhythm established.',
            5: 'Shuffle streak 5: absurdity unlocked.',
            8: 'Shuffle streak 8: headline hurricane.'
        };
        const message = messages[this.shuffleStreak];
        if (!message) {
            return;
        }

        this.showToast(message);
        this.triggerCelebration();
    }

    clearCelebration() {
        if (this.celebrationTimer) {
            window.clearTimeout(this.celebrationTimer);
            this.celebrationTimer = null;
        }
        this.elements.headlineSection?.classList.remove('is-celebrating');
    }

    triggerCelebration() {
        this.clearCelebration();
        this.elements.headlineSection?.classList.add('is-celebrating');
        this.celebrationTimer = window.setTimeout(() => {
            this.elements.headlineSection?.classList.remove('is-celebrating');
            this.celebrationTimer = null;
        }, 900);
    }

    updateNavigationAvailability() {
        const hasEligible = this.filteredIndexes.length > 0 || this.filters.source === 'generated';
        this.elements.previousButton.disabled = this.state.isLoading || this.state.navigationStack.length <= 1;
        this.elements.nextButton.disabled = this.state.isLoading || !hasEligible;
        this.updateNextButtonLabel();
    }

    setNextButtonLabel(label) {
        if (!this.elements.nextButton) {
            return;
        }

        const labelElement = this.elements.nextButton.querySelector('.button-label')
            || this.elements.nextButton.querySelector('span');
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
        this.setNextButtonLabel(this.shuffleStreak > 0
            ? `Keep streak · ${this.shuffleStreak}`
            : 'Shuffle');
    }

    setSectionFilter(section) {
        this.updateFilterValue('section', section || 'latest', {
            resetNavigation: true,
            refreshIndexes: true,
            ensureHeadline: true,
            syncControls: true
        });
    }

    setSourceFilter(source) {
        if (source === 'generated' && !this.isGeneratorAvailable()) {
            this.reportCopyStatus('Tiny model unavailable. Source set to auto.', true);
            this.updateFilterValue('source', 'auto', {
                resetNavigation: true,
                refreshIndexes: true,
                ensureHeadline: true,
                syncControls: true
            });
            return;
        }
        this.updateFilterValue('source', source || 'auto', {
            resetNavigation: true,
            refreshIndexes: true,
            ensureHeadline: true,
            syncControls: true
        });
    }

    setActivePanel(panel) {
        this.updateFilterValue('panel', panel || 'recent', {
            syncControls: true,
            updateHistoryList: true,
            updateHistoryState: true
        });
    }

    setMockLayout(layout) {
        this.updateFilterValue('layout', layout || 'standard', {
            applyLayout: true,
            updateHistoryState: true
        });
    }

    applyMockLayoutClass() {
        if (!this.elements.mockFrame) return;
        this.elements.mockFrame.classList.remove('mock-front--square', 'mock-front--story');
        if (this.filters.layout === 'square') {
            this.elements.mockFrame.classList.add('mock-front--square');
        }
        if (this.filters.layout === 'story') {
            this.elements.mockFrame.classList.add('mock-front--story');
        }
        updateLayoutButtons(this.elements.layoutButtons, this.filters.layout);
    }

    applySearch() {
        const query = this.elements.searchInput?.value ?? '';
        this.updateFilterValue('query', query.trim(), {
            resetNavigation: true,
            refreshIndexes: true,
            ensureHeadline: true,
            syncControls: true,
            updateStatusOnNoChange: true
        });
    }

    clearSearch() {
        if (this.elements.searchInput) {
            this.elements.searchInput.value = '';
        }
        this.updateFilterValue('query', '', {
            resetNavigation: true,
            refreshIndexes: true,
            ensureHeadline: true,
            syncControls: true,
            updateStatusOnNoChange: true
        });
    }

    resetNavigationForFilters() {
        const currentIndex = isValidHeadlineIndex(this.state.currentIndex, this.headlines.length)
            ? this.state.currentIndex
            : null;
        this.state.navigationStack = currentIndex !== null ? [currentIndex] : [];
    }

    ensureHeadlineMatchesFilters() {
        if (this.filteredIndexes.length === 0) {
            this.renderEmptyState();
            this.pushHistoryState(-1, { replace: false });
            return;
        }

        if (!this.isIndexEligible(this.state.currentIndex)) {
            const nextIndex = this.filteredIndexes[0];
            this.state.navigationStack = [nextIndex];
            this.state.currentIndex = nextIndex;
            this.renderHeadline(nextIndex, { pushToStack: false, replaceState: true });
            return;
        }

        this.pushHistoryState(this.state.currentIndex, { replace: false });
        this.updateHistoryList();
    }

    refreshFilteredIndexes() {
        this.filteredIndexes = getEligibleIndexes({
            headlines: this.headlines,
            baseHeadlineCount: this.baseHeadlineCount,
            filters: this.filters,
            isValidHeadlineIndex
        });
        this.updateFilterStatus();
        this.updateNavigationAvailability();
        this.updateHistoryList();
    }

    isIndexEligible(index) {
        return isIndexEligible(index, {
            headlines: this.headlines,
            baseHeadlineCount: this.baseHeadlineCount,
            filters: this.filters,
            isValidHeadlineIndex
        });
    }

    selectHeadline(index) {
        if (!this.isIndexEligible(index)) return;
        this.state.currentIndex = index;
        this.shouldIncrementStreak = false;
        if (this.state.navigationStack[this.state.navigationStack.length - 1] !== index) {
            this.state.navigationStack.push(index);
        }
        this.renderHeadline(index, { pushToStack: false, replaceState: false });
    }

    updateHeadlineBadges(index) {
        if (this.elements.headlineSource) {
            const label = index === null || !isValidHeadlineIndex(index, this.headlines.length)
                ? 'Source: unavailable'
                : (index >= this.baseHeadlineCount ? 'Source: generated' : 'Source: curated');
            this.elements.headlineSource.textContent = label;
        }
        if (this.elements.headlineSectionBadge) {
            const label = index === null || !isValidHeadlineIndex(index, this.headlines.length)
                ? 'Section: latest'
                : `Section: ${classifyHeadline(this.headlines[index])}`;
            this.elements.headlineSectionBadge.textContent = label;
        }
    }

    updateFilterStatus() {
        renderFilterStatus({
            elements: this.elements,
            filters: this.filters,
            hasActiveFilters
        });
    }

    updateFavoriteButton() {
        if (!this.elements.favoriteButton) return;
        const headlineText = this.headlines[this.state.currentIndex];
        const isFavorite = Boolean(headlineText && this.favoriteHeadlines.has(headlineText));
        this.elements.favoriteButton.setAttribute('aria-pressed', String(isFavorite));
        this.elements.favoriteButton.querySelector('.button-label').textContent = isFavorite
            ? 'Saved to favorites'
            : 'Save to favorites';
    }

    toggleFavorite() {
        const headlineText = this.headlines[this.state.currentIndex];
        if (!headlineText) return;
        if (this.favoriteHeadlines.has(headlineText)) {
            this.favoriteHeadlines.delete(headlineText);
            this.reportCopyStatus('Removed from favorites.');
        } else {
            this.favoriteHeadlines.add(headlineText);
            this.reportCopyStatus('Saved to favorites.');
        }
        this.persistState();
        this.updateFavoriteButton();
        this.updateHistoryList();
    }

    updateHistoryList() {
        if (!this.elements.headlineList) return;
        const panel = this.filters.panel;
        const indexes = this.getPanelIndexes(panel);
        this.elements.headlineList.innerHTML = '';

        if (this.elements.historyCount) {
            this.elements.historyCount.textContent = `${indexes.length} items`;
        }

        if (indexes.length === 0) {
            const item = document.createElement('li');
            item.className = 'headline-item headline-item--empty';
            item.textContent = 'No headlines available in this view.';
            this.elements.headlineList.appendChild(item);
            return;
        }

        const fragment = document.createDocumentFragment();
        indexes.forEach((index) => {
            fragment.appendChild(this.createHistoryListItem(index));
        });
        this.elements.headlineList.appendChild(fragment);
    }

    getPanelIndexes(panel) {
        const indexes = this.getPanelIndexPool(panel);
        return indexes.filter((index) => this.isIndexEligible(index));
    }

    syncFilterControls() {
        if (this.elements.searchInput) {
            this.elements.searchInput.value = this.filters.query;
        }
        updateToggleButtons(this.elements.sectionButtons, this.filters.section, 'section');
        updateToggleButtons(this.elements.sourceButtons, this.filters.source, 'source');
        updateToggleButtons(this.elements.panelButtons, this.filters.panel, 'panel');
        updateLayoutButtons(this.elements.layoutButtons, this.filters.layout);
        this.syncGeneratorControls();
        this.updateFilterStatus();
    }

    clearAllFilters() {
        const nextFilters = { ...DEFAULT_FILTERS };
        const shouldReset = Object.keys(nextFilters).some((key) => nextFilters[key] !== this.filters[key]);
        if (!shouldReset) {
            this.updateFilterStatus();
            this.pushHistoryState(this.state.currentIndex, { replace: true });
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
            this.renderEmptyState();
            this.pushHistoryState(-1, { replace: true });
            return;
        }

        const nextIndex = this.filteredIndexes[0];
        this.state.navigationStack = [nextIndex];
        this.state.currentIndex = nextIndex;
        this.renderHeadline(nextIndex, { pushToStack: false, replaceState: true });
        this.showToast('Filters cleared.');

    }

    updateFilterValue(filterKey, value, options = {}) {
        const {
            resetNavigation = false,
            refreshIndexes = false,
            ensureHeadline = false,
            syncControls = false,
            updateHistoryList: shouldUpdateHistoryList = false,
            updateHistoryState: shouldUpdateHistoryState = false,
            applyLayout = false,
            updateStatusOnNoChange = false
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
            this.pushHistoryState(this.state.currentIndex, { replace: false });
        }
    }

    createHistoryListItem(index) {
        const item = document.createElement('li');
        item.className = 'headline-item';
        if (index === this.state.currentIndex) {
            item.classList.add('headline-item--active');
        }
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.index = String(index);
        button.textContent = this.headlines[index];
        item.appendChild(button);
        return item;
    }

    getPanelIndexPool(panel) {
        if (panel === 'favorites') {
            return Array.from(this.favoriteHeadlines)
                .map((headline) => this.headlineCache.get(headline))
                .filter((index) => Number.isInteger(index));
        }
        if (panel === 'generated') {
            return this.headlines
                .map((_, index) => index)
                .filter((index) => index >= this.baseHeadlineCount);
        }
        return [...this.state.navigationStack].reverse();
    }

    async shareHeadline(triggerButton = this.elements.nativeShareButton) {
        const headline = this.headlines[this.state.currentIndex];
        const canonicalUrl = this.getCanonicalUrl(this.state.currentIndex);

        if (!headline || !canonicalUrl) {
            this.reportShareStatus('No headline available to share.', true);
            return;
        }

        if (!navigator.share || typeof navigator.share !== 'function') {
            this.reportShareStatus('Native sharing unavailable in this browser.', true);
            return;
        }

        const payload = {
            title: 'Neckass Headlines',
            text: headline,
            url: canonicalUrl
        };

        if (navigator.canShare && typeof navigator.canShare === 'function') {
            try {
                if (!navigator.canShare(payload)) {
                    this.reportShareStatus('Native sharing unavailable in this browser.', true);
                    return;
                }
            } catch (error) {
                this.reportShareStatus('Native sharing unavailable in this browser.', true);
                return;
            }
        }

        setButtonLoading(triggerButton, true);
        try {
            await navigator.share(payload);
            this.reportShareStatus('Shared successfully.', false);
        } catch (error) {
            if (error && error.name === 'AbortError') {
                this.reportShareStatus('Share canceled.', false);
            } else {
                this.reportShareStatus('Share failed. Please try again.', true);
            }
        } finally {
            setButtonLoading(triggerButton, false);
        }
    }

    async copyHeadlineLink() {
        const canonicalUrl = this.getCanonicalUrl(this.state.currentIndex);
        if (!canonicalUrl) {
            this.reportCopyStatus('No headline link available.', true);
            return;
        }
        await copyTextWithFeedback({
            text: canonicalUrl,
            button: this.elements.copyLinkButton,
            successMessage: 'Headline link copied!',
            onStatus: (message, isError) => this.reportCopyStatus(message, isError),
            setButtonLoading
        });
    }

    handleDirectionalNavigation(event) {
        if (event.defaultPrevented) return;

        const target = event.target;
        if (target) {
            const tag = target.tagName?.toLowerCase();
            const isEditable = target.isContentEditable;
            if (isEditable || ['input', 'textarea', 'select', 'button'].includes(tag)) {
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
        this.filters = this.getFiltersFromUrl(urlState);
        if (this.filters.source === 'generated' && !this.isGeneratorAvailable()) {
            this.filters.source = 'auto';
        }
        this.persistState();
        this.syncFilterControls();
        this.refreshFilteredIndexes();
        this.applyMockLayoutClass();

        const index = this.identifierToIndex(urlState.headline);
        const eligibleIndex = isValidHeadlineIndex(index, this.headlines.length) && this.isIndexEligible(index)
            ? index
            : null;
        const fallbackIndex = eligibleIndex ?? this.filteredIndexes[0] ?? null;

        if (fallbackIndex !== null) {
            this.state.navigationStack = [fallbackIndex];
            this.state.uniqueHeadlines.add(fallbackIndex);
            this.state.currentIndex = fallbackIndex;
            this.persistState();
            this.updateHeadlineCounter();
            this.updateNavigationAvailability();
            this.pushHistoryState(fallbackIndex, { replace: true });
        } else if (index !== null || urlState.hasHeadlineParam) {
            this.pushHistoryState(-1, { replace: true });
        }
    }

    handlePopState(event) {
        const state = event.state || {};
        const urlState = getUrlState();
        const urlIndex = this.identifierToIndex(urlState.headline);
        const stateIndex = this.identifierToIndex(state.headlineIndex);
        this.filters = this.getFiltersFromUrl(urlState);
        this.syncFilterControls();
        this.refreshFilteredIndexes();
        this.applyMockLayoutClass();

        const targetIndex = isValidHeadlineIndex(stateIndex, this.headlines.length)
            ? stateIndex
            : (isValidHeadlineIndex(urlIndex, this.headlines.length) ? urlIndex : null);

        const eligibleTarget = targetIndex !== null && this.isIndexEligible(targetIndex)
            ? targetIndex
            : this.filteredIndexes[0] ?? null;

        const restoredStack = Array.isArray(state.navigationStack)
            ? state.navigationStack.filter((idx) => isValidHeadlineIndex(idx, this.headlines.length))
            : [];
        const restoredUnique = Array.isArray(state.uniqueHeadlines)
            ? state.uniqueHeadlines.filter((idx) => isValidHeadlineIndex(idx, this.headlines.length))
            : [];

        if (eligibleTarget === null) {
            this.renderEmptyState();
            return;
        }

        const filteredStack = restoredStack.filter((idx) => this.isIndexEligible(idx));
        this.state.navigationStack = filteredStack.length > 0 ? filteredStack : [eligibleTarget];
        if (!this.state.navigationStack.includes(eligibleTarget)) {
            this.state.navigationStack.push(eligibleTarget);
        }

        this.state.uniqueHeadlines = new Set([...this.state.uniqueHeadlines, ...restoredUnique, eligibleTarget]);
        this.state.currentIndex = eligibleTarget;
        this.persistState();
        this.updateHeadlineCounter();
        this.updateNavigationAvailability();
        this.renderHeadline(eligibleTarget, { pushToStack: false, replaceState: true });
    }

    getFiltersFromUrl(urlState) {
        return sanitizeFilters({
            ...DEFAULT_FILTERS,
            section: urlState.section ?? DEFAULT_FILTERS.section,
            query: urlState.query ?? DEFAULT_FILTERS.query,
            source: urlState.source ?? DEFAULT_FILTERS.source,
            panel: urlState.panel ?? DEFAULT_FILTERS.panel,
            layout: urlState.layout ?? DEFAULT_FILTERS.layout
        });
    }

    updateDocumentMetadata(headline, index) {
        const baseTitle = 'Neckass Headlines';
        const hasHeadline = typeof headline === 'string' && headline.trim().length > 0 && isValidHeadlineIndex(index, this.headlines.length);
        const title = hasHeadline ? `${headline} | ${baseTitle}` : baseTitle;
        const description = hasHeadline ? headline : 'Explore a feed of inventive headlines where every shuffle serves up a fresh take ready to share.';
        const canonicalUrl = this.getCanonicalUrl(index);

        document.title = title;
        this.setMetaTag('name', 'description', description);
        this.setMetaTag('property', 'og:title', title);
        this.setMetaTag('property', 'og:description', description);
        this.setMetaTag('property', 'og:url', canonicalUrl);
        this.setMetaTag('name', 'twitter:title', title);
        this.setMetaTag('name', 'twitter:description', description);
        this.setMetaTag('name', 'twitter:url', canonicalUrl);
        this.setCanonicalLink(canonicalUrl);
    }

    setMetaTag(attribute, name, content) {
        let tag = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attribute, name);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    }

    setCanonicalLink(url) {
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', url);
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
            successMessage: 'Headline copied to clipboard!',
            onStatus: (message, isError) => {
                this.reportCopyStatus(message, isError);
                if (!isError) {
                    this.flashCopiedButtonLabel(triggerButton);
                }
            },
            setButtonLoading
        });
    }

    reportCopyStatus(message, isError = false) {
        if (!this.elements.copyStatus) return;
        this.elements.copyStatus.textContent = message;
        this.elements.copyStatus.classList.toggle('error', isError);
        if (!isError && message) {
            this.showToast(message);
        }
    }

    flashCopiedButtonLabel(button) {
        if (!button || button.dataset.copyLabelTimeout === 'active') return;

        const originalContent = button.dataset.originalContent || button.innerHTML;
        button.dataset.originalContent = originalContent;
        button.dataset.copyLabelTimeout = 'active';
        button.innerHTML = 'Copied';

        window.setTimeout(() => {
            button.innerHTML = originalContent;
            delete button.dataset.copyLabelTimeout;
        }, 1400);
    }

    clearCopyStatus() {
        if (!this.elements.copyStatus) return;
        this.elements.copyStatus.textContent = '';
        this.elements.copyStatus.classList.remove('error');
    }

    reportShareStatus(message, isError = false) {
        if (!this.elements.shareStatus) return;
        this.elements.shareStatus.textContent = message;
        this.elements.shareStatus.classList.toggle('error', isError);
        if (!isError && message) {
            this.showToast(message);
        }
    }

    clearShareStatus() {
        if (!this.elements.shareStatus) return;
        this.elements.shareStatus.textContent = '';
        this.elements.shareStatus.classList.remove('error');
    }

    toggleLoader(shouldShow, message = null) {
        if (message && this.elements.loaderText) {
            this.elements.loaderText.textContent = message;
        } else if (message && this.elements.loader) {
            this.elements.loader.textContent = message;
        }
        if (this.elements.loader) {
            this.elements.loader.classList.toggle('is-visible', shouldShow);
            this.elements.loader.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
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
            this.elements.headlineList.setAttribute('aria-busy', shouldShow ? 'true' : 'false');
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
            this.elements.downloadMockButton.setAttribute('aria-disabled', String(!window.htmlToImage));
        }
        if (this.elements.copyMockButton) {
            this.elements.copyMockButton.disabled = !window.htmlToImage;
            this.elements.copyMockButton.setAttribute('aria-disabled', String(!window.htmlToImage));
        }
        if (!window.htmlToImage) {
            this.reportExportStatus('Export unavailable right now. Try reloading the page.', true);
        }
    }

    updateMockDate() {
        const now = new Date();
        const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });

        if (this.elements.mockDate) {
            this.elements.mockDate.textContent = dateFormatter.format(now);
        }

        if (this.elements.mastheadDate) {
            this.elements.mastheadDate.textContent = `${dateFormatter.format(now)} · Digital edition`;
        }

        if (this.elements.featureDateline) {
            this.elements.featureDateline.textContent = `Published ${timeFormatter.format(now)}`;
        }
    }

    async handleMockExport(mode) {
        await exportMockFront({
            mode,
            elements: this.elements,
            reportStatus: (message, isError) => this.reportExportStatus(message, isError),
            setButtonLoading
        });
    }

    reportExportStatus(message, isError = false) {
        if (!this.elements.exportStatus) return;
        this.elements.exportStatus.textContent = message;
        this.elements.exportStatus.classList.toggle('error', isError);
        if (!isError && message) {
            this.showToast(message);
        }
    }

    jumpToCard(type) {
        const cardMap = {
            copy: {
                section: this.elements.copySection,
                focus: this.elements.copyButton
            },
            share: {
                section: this.elements.socialShare,
                focus: this.elements.nativeShareButton
            },
            export: {
                section: this.elements.exportSection,
                focus: this.elements.downloadMockButton
            }
        };

        const target = cardMap[type];
        if (!target?.section) return;
        target.section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (target.focus) {
            window.setTimeout(() => {
                target.focus.focus({ preventScroll: true });
            }, 220);
        }
    }

    showToast(message) {
        if (!this.elements.globalToast || !message) return;
        if (this.toastTimer) {
            window.clearTimeout(this.toastTimer);
        }
        this.elements.globalToast.textContent = message;
        this.elements.globalToast.classList.add('is-visible');
        this.elements.globalToast.setAttribute('aria-hidden', 'false');

        this.toastTimer = window.setTimeout(() => {
            this.elements.globalToast.classList.remove('is-visible');
            this.elements.globalToast.setAttribute('aria-hidden', 'true');
        }, 1800);
    }

    getRandomIndex() {
        const pool = this.filteredIndexes.length > 0
            ? this.filteredIndexes
            : [];

        if (pool.length === 0) {
            return null;
        }

        if (pool.length === 1) {
            return pool[0];
        }

        let randomIndex = pool[Math.floor(Math.random() * pool.length)];
        while (randomIndex === this.state.currentIndex && pool.length > 1) {
            randomIndex = pool[Math.floor(Math.random() * pool.length)];
        }

        return randomIndex;
    }

    normalizeGeneratedHeadline(headlineText) {
        const normalized = typeof headlineText === 'string' ? headlineText.trim() : '';
        if (!normalized) {
            return '';
        }

        const maxLength = 160;
        if (normalized.length <= maxLength) {
            return normalized;
        }

        const clipped = normalized.slice(0, maxLength);
        const lastBreak = Math.max(clipped.lastIndexOf(' · '), clipped.lastIndexOf(' — '), clipped.lastIndexOf(', '), clipped.lastIndexOf(' '));
        const safeClip = lastBreak > 90 ? clipped.slice(0, lastBreak) : clipped;
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
        this.state.generatedHeadlines = Array.isArray(this.state.generatedHeadlines) ? this.state.generatedHeadlines : [];
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
            dailyEngagement: this.dailyEngagement
        });
    }

    isGeneratorAvailable() {
        return typeof window.tinyLlmClient?.generateHeadline === 'function';
    }

    syncGeneratorControls() {
        const generatorAvailable = this.isGeneratorAvailable();
        if (this.elements.generateButton) {
            this.elements.generateButton.disabled = !generatorAvailable;
            this.elements.generateButton.setAttribute('aria-disabled', String(!generatorAvailable));
        }
        if (this.elements.sourceButtons) {
            this.elements.sourceButtons.forEach((button) => {
                if (button.dataset.source === 'generated') {
                    button.disabled = !generatorAvailable;
                    button.setAttribute('aria-disabled', String(!generatorAvailable));
                }
            });
        }
    }

    identifierToIndex(identifier) {
        if (identifier === null || identifier === undefined) return null;
        const parsed = Number.parseInt(identifier, 10);
        if (Number.isInteger(parsed) && String(parsed) === String(identifier)) {
            return parsed;
        }

        const slugMatch = String(identifier).match(/^(\d+)(?:-[a-z0-9-]+)?$/i);
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
    }

    identifierFromIndex(index) {
        const headlineText = isValidHeadlineIndex(index, this.headlines.length)
            ? this.headlines[index]
            : '';
        const slug = slugifyHeadline(headlineText);
        return slug ? `${index}-${slug}` : String(index);
    }

    buildHeadlineUrl(index) {
        return buildHeadlineUrl({
            index,
            headlines: this.headlines,
            filters: this.filters,
            identifierFromIndex: (idx) => this.identifierFromIndex(idx),
            isValidHeadlineIndex
        });
    }

    getCanonicalUrl(index) {
        return this.buildHeadlineUrl(index);
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
            replace
        });
    }
}

    Neckass.HeadlineApp = HeadlineApp;
})();
