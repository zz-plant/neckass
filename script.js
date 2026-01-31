const STORAGE_KEYS = {
    viewedCount: 'headlinesViewed',
    viewedList: 'viewedHeadlines',
    navigationStack: 'navigationStack',
    navigationStackLegacy: 'viewedStack',
    uniqueHeadlines: 'uniqueHeadlines',
    generatedHeadlines: 'generatedHeadlines',
    favorites: 'favoriteHeadlines',
    filters: 'headlineFilters'
};

const ANIMATION_DELAY_MS = 60;
const BRIGHTNESS_THRESHOLD = 130;
const MIN_CONTRAST_RATIO = 4.5;
const BASE_BACKGROUND_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--bg')?.trim() || '#0e1116';
const DEFAULT_FILTERS = Object.freeze({
    section: 'latest',
    query: '',
    source: 'auto',
    panel: 'recent',
    layout: 'standard'
});
const COLOR_PALETTE = [
    '#FF5733', '#33FF57', '#3357FF', '#F333FF',
    '#FF33A8', '#FF8F33', '#33FFF5', '#338FFF',
    '#FF33F6', '#FF4500', '#33FFBD', '#FFB533',
    '#FFA833', '#5A5AFF', '#FF33C4', '#FF4444',
    '#44FF88'
];

const headlines = [
    "BREAKING: Neckass opens 19 browser tabs to compare cereal prices, still buys the first one for nostalgia",
    "Local Neckass declares his Google Calendar a 'living document' and holds a memorial for the meeting he never attended",
    "Neckass starts a productivity podcast, records three episodes, spends six hours choosing cover art",
    "BREAKING: Neckass attempts to cancel plans by sending a meme and calling it 'emotional labor'",
    "Local Neckass live-streams his laundry fold, calls it 'texture content,' forgets to press record",
    "Neckass says he's going off-grid, posts a 14-step thread on how to find him",
    "BREAKING: Neckass adds 'read receipts' to his houseplants and gets ghosted by a fern",
    "Local Neckass tries to speedrun errands, stops to review every coffee shop on the way",
    "Neckass insists his to-do list is a 'seasonal arc,' then renews it for another season",
    "BREAKING: Neckass files a noise complaint against his own alarm clock",
    "Local Neckass brings a ring light to brunch 'for the ambience,' blinds three friends",
    "Neckass launches a group chat called 'focus hour,' immediately posts memes in it",
    "BREAKING: Neckass asks his smart speaker for life advice, gets told to hydrate",
    "Local Neckass claims his Wi-Fi has moods, schedules a check-in meeting",
    "Neckass soft-launches a new hobby, posts seven story polls, buys no supplies",
    "BREAKING: Neckass tries to barter with points at checkout, insists it's 'real economy'",
    "Local Neckass updates his resume as a Twitter thread, pins it, forgets to apply anywhere",
    "Neckass brings a mechanical keyboard to a library, calls the clicks 'ambient feedback'",
    "BREAKING: Neckass subscribes to a meal kit, still orders takeout 'for research'",
    "Local Neckass demands dark mode for the sun, submits a feature request",
    "Neckass calls his fridge a 'content studio' and films a snack review with plot twists",
    "BREAKING: Neckass tries to manifest a vacation by changing his desktop wallpaper",
    "Local Neckass hosts a webinar on time management, starts 30 minutes late",
    "Neckass claims he's minimal now, buys three organizers to store fewer items",
    "BREAKING: Neckass starts a newsletter about his cat's mood swings, subscribers beg for spoilers",
    "Local Neckass uses voice notes for everything, labels them 'personal podcasts'",
    "Neckass turns his grocery list into a mood board, cries in the produce aisle",
    "BREAKING: Neckass rebrands his chores as 'quests' and assigns himself side missions",
    "Local Neckass tries to cancel his subscription, gets distracted and renews for a year",
    "Neckass hosts a TED Talk in his living room, charges admission in snacks",
    "BREAKING: Neckass buys a planner, uses it to track other planners",
    "Local Neckass starts a book club, first pick is the terms of service",
    "Neckass says he's being 'intentional,' schedules naps on a shared calendar",
    "BREAKING: Neckass applies for a job, immediately unfollows the company on LinkedIn",
    "Local Neckass keeps a spreadsheet of his dreams, color-codes the plot twists",
    "Neckass insists his coffee ritual is a 'wellness practice,' drinks four cups",
    "BREAKING: Neckass joins a fitness challenge, logs steps from walking to the fridge",
    "Local Neckass launches a merch drop for a joke no one remembers",
    "Neckass files a complaint with customer service about a meme format",
    "BREAKING: Neckass starts a group chat to plan a trip, never books the tickets",
    "Local Neckass narrates his cooking like a sports broadcast, calls for a replay",
    "Neckass sets his out-of-office reply to 'mentally at the beach' and means it",
    "BREAKING: Neckass tries to pay with a QR code he screenshotted last week",
    "Local Neckass describes his desk as 'open-concept,' it's just clutter",
    "Neckass creates a vision board out of unread emails and feels inspired",
    "BREAKING: Neckass writes a manifesto about why Tuesdays are a scam",
    "Local Neckass brings a tripod to the park, says it's 'just for posture'",
    "Neckass calls his shopping cart a 'prototype lab,' buys five versions of socks",
    "BREAKING: Neckass tries to return a hoodie he wore for emotional support",
    "Local Neckass schedules a 'social battery recharge' and sets it to airplane mode",
    "Neckass hosts a silent disco for introverts, everyone texts 'vibes'",
    "BREAKING: Neckass updates his bio to 'offline,' refreshes it every hour",
    "Local Neckass cooks one meal, calls himself a 'home chef,' opens a Q&A",
    "Neckass starts a gratitude journal, only writes about free shipping",
    "BREAKING: Neckass claims he invented the idea of 'soft launch'",
    "Local Neckass rates his sleep like a podcast episode: 'solid but too many ads'",
    "Neckass submits a help ticket because his motivation is buffering",
    "BREAKING: Neckass packs for a weekend trip, brings three chargers and no shoes",
    "Local Neckass signs up for a yoga class, stays for the playlist",
    "Neckass calls his desk lamp a 'mood coach,' adjusts it mid-conversation",
    "BREAKING: Neckass opens a tab to learn a new skill, forgets which skill",
    "Local Neckass spends 40 minutes picking a playlist, cleans for 10",
    "Neckass says he's cutting screen time, immediately starts a screen-time tracker",
    "BREAKING: Neckass tries to tip with a compliment, gets a receipt anyway",
    "Local Neckass updates his status to 'in a meeting' while eating cereal",
    "Neckass calls his notifications 'the news,' unfollows them for his mental health",
    "BREAKING: Neckass hosts a 'low-stakes hang,' sends a three-page agenda",
    "Local Neckass joins a co-working space, spends the day rearranging his chair",
    "Neckass keeps a backup plan for his backup plan, labels it 'Plan B+'",
    "BREAKING: Neckass starts a side hustle reviewing other side hustles",
    "Local Neckass color-codes his calendar, still misses the appointment",
    "Neckass says he's embracing spontaneity, schedules it for Friday",
    "BREAKING: Neckass posts a 'quick update,' writes a 12-tweet thread",
    "Local Neckass turns his walk into a podcast episode and forgets to walk",
    "Neckass demands a refund for a bad vibe, gets store credit instead",
    "BREAKING: Neckass tries to save a meme to the cloud, prints it out",
    "Local Neckass builds a 'focus playlist,' gets distracted by track two",
    "Neckass insists his inbox is a museum of intent, closes it for renovations",
    "BREAKING: Neckass asks the group chat for advice, ignores every answer"
];

document.addEventListener('DOMContentLoaded', () => {
    const app = new HeadlineApp({
        headlines,
        elements: mapElements(),
        storage: createStorageAdapter()
    });

    app.init();
});

class HeadlineApp {
    constructor({ headlines: allHeadlines, elements, storage }) {
        this.headlines = Array.isArray(allHeadlines) ? [...allHeadlines] : [];
        this.baseHeadlineCount = this.headlines.length;
        this.elements = elements;
        this.storage = storage;
        this.headlineCache = new Map();
        this.state = storage.restore(this.headlines.length, this.baseHeadlineCount);
        this.state.isLoading = false;
        this.state.generatedHeadlines = Array.isArray(this.state.generatedHeadlines) ? this.state.generatedHeadlines : [];
        this.filters = sanitizeFilters(this.state.filters);
        this.favoriteHeadlines = new Set(Array.isArray(this.state.favorites) ? this.state.favorites : []);
        this.filteredIndexes = [];
        this.buildHeadlineCache();
        this.appendGeneratedHeadlines(this.state.generatedHeadlines || []);
        this.handleDirectionalNavigation = this.handleDirectionalNavigation.bind(this);
        this.activeButton = null;
    }

    appendGeneratedHeadlines(generatedHeadlines) {
        const additions = Array.isArray(generatedHeadlines) ? generatedHeadlines : [];
        additions.forEach((headlineText) => {
            if (!headlineText || typeof headlineText !== 'string') return;
            const normalized = headlineText.trim();
            if (normalized.length === 0) return;
            if (this.headlineCache.has(normalized)) return;

            this.headlines.push(normalized);
            this.headlineCache.set(normalized, this.headlines.length - 1);
        });
    }

    buildHeadlineCache() {
        this.headlines.forEach((headlineText, index) => {
            const normalized = typeof headlineText === 'string' ? headlineText.trim() : '';
            if (normalized.length === 0) return;
            if (!this.headlineCache.has(normalized)) {
                this.headlineCache.set(normalized, index);
            }
        });
    }

    init() {
        this.bindEvents();
        this.applyUrlState();
        this.syncGeneratorControls();
        this.updateHeadlineCounter();
        this.updateNavigationAvailability();
        this.updateMockDate();
        this.renderInitialHeadline();
    }

    bindEvents() {
        this.elements.nextButton.addEventListener('click', () => this.handleNext());
        this.elements.previousButton.addEventListener('click', () => this.handlePrevious());
        this.elements.copyButton.addEventListener('click', () => this.copyHeadline());
        this.elements.copyLinkButton?.addEventListener('click', () => this.copyHeadlineLink());
        this.elements.generateButton?.addEventListener('click', () => this.handleGenerate());
        this.elements.favoriteButton?.addEventListener('click', () => this.toggleFavorite());
        this.elements.downloadMockButton?.addEventListener('click', () => this.exportMockFront('download'));
        this.elements.copyMockButton?.addEventListener('click', () => this.exportMockFront('copy'));
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
        const normalized = typeof headlineText === 'string' ? headlineText.trim() : '';
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
        const loaderMessage = this.elements.loaderText?.textContent || this.elements.loader.textContent || 'Loading headline...';
        this.toggleLoader(true, loaderMessage);
        this.elements.headline.classList.remove('show');

        setTimeout(() => {
            const headlineText = this.headlines[index];
            this.elements.headline.textContent = headlineText;
            this.elements.headline.style.color = selectReadableColor();
            this.elements.headline.classList.add('show');
            this.toggleLoader(false);

            this.updateMockDate();

            this.updateViewedState(index, options);
            this.updateHeadlineBadges(index);
            this.updateFavoriteButton();
            this.updateDocumentMetadata(headlineText, index);
            this.updateSocialShareLinks(headlineText, index);
            this.updateMockHeadline(headlineText);
            this.persistState();
            this.updateHistoryState(index, { replace: options.replaceState });
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
        const hasFilters = this.hasActiveFilters();
        this.elements.headline.textContent = hasFilters
            ? 'No headlines match your current filters.'
            : 'No headlines available.';
        this.elements.headline.style.color = '';
        this.clearCopyStatus();
        this.updateDocumentMetadata('', -1);
        this.updateSocialShareLinks('', -1);
        this.updateMockHeadline('No headlines available.');
        this.updateHeadlineBadges(null);
        this.updateFavoriteButton();
        this.updateHistoryList();
        this.toggleLoader(false, 'No headlines available.');
        this.state.isLoading = false;
        this.state.navigationStack = [];
        this.state.currentIndex = -1;
        this.elements.nextButton.disabled = true;
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

    updateSocialShareLinks(headline, index) {
        const encodedHeadline = encodeURIComponent(headline);
        const canonicalUrl = this.getCanonicalUrl(index);
        const encodedUrl = encodeURIComponent(canonicalUrl);
        const combinedText = encodeURIComponent(`${headline} ${canonicalUrl}`.trim());

        if (this.elements.twitterShareLink) {
            this.elements.twitterShareLink.href = `https://twitter.com/intent/tweet?text=${encodedHeadline}&url=${encodedUrl}&hashtags=Neckass`;
        }
        if (this.elements.facebookShareLink) {
            this.elements.facebookShareLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedHeadline}`;
        }
        if (this.elements.redditShareLink) {
            this.elements.redditShareLink.href = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedHeadline}`;
        }
        if (this.elements.linkedinShareLink) {
            this.elements.linkedinShareLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        }
        if (this.elements.threadsShareLink) {
            this.elements.threadsShareLink.href = `https://www.threads.net/intent/post?text=${combinedText}`;
        }
        if (this.elements.blueskyShareLink) {
            this.elements.blueskyShareLink.href = `https://bsky.app/intent/compose?text=${combinedText}`;
        }
    }

    updateHeadlineCounter() {
        this.elements.counter.textContent = this.state.uniqueHeadlines.size;
    }

    updateNavigationAvailability() {
        const hasEligible = this.filteredIndexes.length > 0 || this.filters.source === 'generated';
        this.elements.previousButton.disabled = this.state.isLoading || this.state.navigationStack.length <= 1;
        this.elements.nextButton.disabled = this.state.isLoading || !hasEligible;
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
        this.updateLayoutButtons();
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
            this.updateHistoryState(-1, { replace: false });
            return;
        }

        if (!this.isIndexEligible(this.state.currentIndex)) {
            const nextIndex = this.filteredIndexes[0];
            this.state.navigationStack = [nextIndex];
            this.state.currentIndex = nextIndex;
            this.renderHeadline(nextIndex, { pushToStack: false, replaceState: true });
            return;
        }

        this.updateHistoryState(this.state.currentIndex, { replace: false });
        this.updateHistoryList();
    }

    refreshFilteredIndexes() {
        this.filteredIndexes = this.getEligibleIndexes();
        this.updateFilterStatus();
        this.updateNavigationAvailability();
        this.updateHistoryList();
    }

    getEligibleIndexes() {
        const query = this.filters.query.trim().toLowerCase();
        return this.headlines
            .map((_, index) => index)
            .filter((index) => this.isIndexEligible(index, query));
    }

    isIndexEligible(index, normalizedQuery = null) {
        if (!isValidHeadlineIndex(index, this.headlines.length)) return false;
        const headlineText = this.headlines[index];
        const query = normalizedQuery ?? this.filters.query.trim().toLowerCase();
        const section = this.filters.section;
        const source = this.filters.source;
        const isGenerated = index >= this.baseHeadlineCount;

        if (source === 'curated' && isGenerated) return false;
        if (source === 'generated' && !isGenerated) return false;
        if (section !== 'latest') {
            const assigned = this.classifyHeadline(headlineText);
            if (assigned !== section) return false;
        }
        if (query) {
            return headlineText.toLowerCase().includes(query);
        }
        return true;
    }

    classifyHeadline(headlineText) {
        if (!headlineText) return 'latest';
        const normalized = headlineText.toLowerCase();
        const patterns = {
            world: ['canada', 'federal', 'global', 'climate', 'ambassador', 'space', 'metaverse', 'crypto', 'treaty'],
            tech: ['app', 'wifi', 'ai', 'bot', 'algorithm', 'ios', 'android', 'tweet', 'stream', 'vr', 'podcast', 'discord', 'zoom'],
            culture: ['tiktok', 'reels', 'instagram', 'spotify', 'etsy', 'book', 'substack', 'newsletter', 'podcast', 'fashion', 'club'],
            oddities: ['unhinged', 'manifest', 'ghost', 'meme', 'weird', 'npc', 'pickleball', 'cursed', 'demon', 'zodiac']
        };

        if (patterns.tech.some((term) => normalized.includes(term))) return 'tech';
        if (patterns.culture.some((term) => normalized.includes(term))) return 'culture';
        if (patterns.world.some((term) => normalized.includes(term))) return 'world';
        if (patterns.oddities.some((term) => normalized.includes(term))) return 'oddities';
        return 'latest';
    }

    selectHeadline(index) {
        if (!this.isIndexEligible(index)) return;
        this.state.currentIndex = index;
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
                : `Section: ${this.classifyHeadline(this.headlines[index])}`;
            this.elements.headlineSectionBadge.textContent = label;
        }
    }

    updateFilterStatus() {
        if (!this.elements.filterStatus) return;
        const parts = [];
        if (this.filters.section !== 'latest') {
            parts.push(this.filters.section);
        }
        if (this.filters.query) {
            parts.push(`"${this.filters.query}"`);
        }
        if (this.filters.source !== 'auto') {
            parts.push(this.filters.source);
        }
        this.elements.filterStatus.textContent = parts.length > 0 ? parts.join(' · ') : 'All headlines';
        if (this.elements.clearFiltersButton) {
            const hasFilters = this.hasActiveFilters();
            this.elements.clearFiltersButton.hidden = !hasFilters;
            this.elements.clearFiltersButton.disabled = !hasFilters;
        }
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

    updateLayoutButtons() {
        if (!this.elements.layoutButtons) return;
        this.elements.layoutButtons.forEach((button) => {
            const isActive = button.dataset.layout === this.filters.layout;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    }

    updateToggleButtons(buttons, value, attribute = 'source') {
        if (!buttons) return;
        buttons.forEach((button) => {
            const isActive = button.dataset[attribute] === value;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    }

    syncFilterControls() {
        if (this.elements.searchInput) {
            this.elements.searchInput.value = this.filters.query;
        }
        this.updateToggleButtons(this.elements.sectionButtons, this.filters.section, 'section');
        this.updateToggleButtons(this.elements.sourceButtons, this.filters.source, 'source');
        this.updateToggleButtons(this.elements.panelButtons, this.filters.panel, 'panel');
        this.updateLayoutButtons();
        this.syncGeneratorControls();
        this.updateFilterStatus();
    }

    clearAllFilters() {
        const nextFilters = { ...DEFAULT_FILTERS };
        const shouldReset = Object.keys(nextFilters).some((key) => nextFilters[key] !== this.filters[key]);
        if (!shouldReset) {
            this.updateFilterStatus();
            return;
        }

        this.filters = nextFilters;
        if (this.elements.searchInput) {
            this.elements.searchInput.value = '';
        }
        this.resetNavigationForFilters();
        this.persistState();
        this.syncFilterControls();
        this.refreshFilteredIndexes();
        this.applyMockLayoutClass();
        this.ensureHeadlineMatchesFilters();
    }

    hasActiveFilters() {
        return Boolean(
            this.filters.query
            || this.filters.section !== DEFAULT_FILTERS.section
            || this.filters.source !== DEFAULT_FILTERS.source
        );
    }

    updateFilterValue(filterKey, value, options = {}) {
        const {
            resetNavigation = false,
            refreshIndexes = false,
            ensureHeadline = false,
            syncControls = false,
            updateHistoryList = false,
            updateHistoryState = false,
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
        if (updateHistoryList) {
            this.updateHistoryList();
        }
        if (updateHistoryState) {
            this.updateHistoryState(this.state.currentIndex, { replace: false });
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

    async copyHeadlineLink() {
        const canonicalUrl = this.getCanonicalUrl(this.state.currentIndex);
        if (!canonicalUrl) {
            this.reportCopyStatus('No headline link available.', true);
            return;
        }
        await this.copyTextWithFeedback(
            canonicalUrl,
            this.elements.copyLinkButton,
            'Headline link copied!'
        );
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
            this.handleNext();
        } else if (backwardKeys.includes(event.key)) {
            event.preventDefault();
            this.handlePrevious();
        }
    }

    applyUrlState() {
        const urlState = this.getUrlState();
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
            this.updateHistoryState(fallbackIndex, { replace: true });
        } else if (index !== null || urlState.hasHeadlineParam) {
            this.updateHistoryState(-1, { replace: true });
        }
    }

    getUrlState() {
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

    headlineToIdentifier(headlineText) {
        return normalizeHeadlineText(headlineText) || '';
    }

    identifierFromIndex(index) {
        const headlineText = isValidHeadlineIndex(index, this.headlines.length)
            ? this.headlines[index]
            : '';
        const slug = slugifyHeadline(headlineText);
        return slug ? `${index}-${slug}` : String(index);
    }

    buildHeadlineUrl(index) {
        const url = new URL(window.location.href);
        url.hash = '';
        const headlineIdentifier = isValidHeadlineIndex(index, this.headlines.length)
            ? this.identifierFromIndex(index)
            : '';
        if (headlineIdentifier) {
            url.searchParams.set('headline', headlineIdentifier);
        } else {
            url.searchParams.delete('headline');
        }

        url.searchParams.set('section', this.filters.section);
        if (this.filters.query) {
            url.searchParams.set('q', this.filters.query);
        } else {
            url.searchParams.delete('q');
        }
        url.searchParams.set('source', this.filters.source);
        url.searchParams.set('panel', this.filters.panel);
        url.searchParams.set('layout', this.filters.layout);

        return url.toString();
    }

    getCanonicalUrl(index) {
        return this.buildHeadlineUrl(index);
    }

    updateHistoryState(index, { replace = false } = {}) {
        const url = this.buildHeadlineUrl(index);
        const state = {
            headlineIndex: isValidHeadlineIndex(index, this.headlines.length) ? index : null,
            navigationStack: [...this.state.navigationStack],
            uniqueHeadlines: Array.from(this.state.uniqueHeadlines),
            filters: { ...this.filters }
        };

        if (replace) {
            history.replaceState(state, '', url);
        } else {
            history.pushState(state, '', url);
        }
    }

    handlePopState(event) {
        const state = event.state || {};
        const urlState = this.getUrlState();
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

    async copyHeadline() {
        const headlineText = this.elements.headline.innerText;

        if (!headlineText) {
            this.reportCopyStatus('No headline available to copy.', true);
            return;
        }

        await this.copyTextWithFeedback(
            headlineText,
            this.elements.copyButton,
            'Headline copied to clipboard!'
        );
    }

    canUseClipboardApi() {
        return Boolean(
            window.isSecureContext
            && navigator.clipboard
            && typeof navigator.clipboard.writeText === 'function'
        );
    }

    async copyWithClipboardApi(text) {
        await navigator.clipboard.writeText(text);
    }

    copyWithFallback(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);

        const selection = document.getSelection();
        const selectedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

        textarea.select();
        const successful = document.execCommand('copy');

        if (selectedRange) {
            selection.removeAllRanges();
            selection.addRange(selectedRange);
        }

        document.body.removeChild(textarea);
        return successful;
    }

    async copyTextWithFeedback(text, button, successMessage) {
        this.setButtonLoading(button, true);
        try {
            if (this.canUseClipboardApi()) {
                await this.copyWithClipboardApi(text);
                this.reportCopyStatus(successMessage);
                return;
            }

            const success = this.copyWithFallback(text);
            if (success) {
                this.reportCopyStatus(successMessage);
            } else {
                this.reportCopyStatus('Copy failed. Please try again.', true);
            }
        } catch (error) {
            try {
                const success = this.copyWithFallback(text);
                if (success) {
                    this.reportCopyStatus(successMessage);
                } else {
                    this.reportCopyStatus('Clipboard unavailable in this browser.', true);
                }
            } catch (fallbackError) {
                this.reportCopyStatus('Clipboard unavailable in this browser.', true);
            }
        } finally {
            this.setButtonLoading(button, false);
        }
    }

    reportCopyStatus(message, isError = false) {
        if (!this.elements.copyStatus) return;
        this.elements.copyStatus.textContent = message;
        this.elements.copyStatus.classList.toggle('error', isError);
    }

    clearCopyStatus() {
        if (!this.elements.copyStatus) return;
        this.elements.copyStatus.textContent = '';
        this.elements.copyStatus.classList.remove('error');
    }

    toggleLoader(shouldShow, message = null) {
        if (message && this.elements.loaderText) {
            this.elements.loaderText.textContent = message;
        } else if (message && this.elements.loader) {
            this.elements.loader.textContent = message;
        }
        this.elements.loader.classList.toggle('is-visible', shouldShow);
        this.elements.loader.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
        this.setNavigationLoading(shouldShow);
    }

    setNavigationLoading(shouldShow) {
        this.state.isLoading = shouldShow;
        this.updateNavigationAvailability();
        if (this.activeButton) {
            this.setButtonLoading(this.activeButton, shouldShow);
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

    setButtonLoading(button, shouldShow) {
        if (!button) return;
        button.classList.toggle('is-loading', shouldShow);
        button.disabled = shouldShow;
        button.setAttribute('aria-busy', shouldShow ? 'true' : 'false');
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

    async exportMockFront(mode) {
        if (!this.elements.mockFrame || !window.htmlToImage) {
            this.reportExportStatus('Export unavailable. Image renderer did not load.', true);
            return;
        }

        this.reportExportStatus('Rendering front page...');
        const exportButton = mode === 'download' ? this.elements.downloadMockButton : this.elements.copyMockButton;
        this.setButtonLoading(exportButton, true);

        const options = {
            pixelRatio: window.devicePixelRatio || 2,
            backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg')?.trim() || undefined
        };

        try {
            if (mode === 'download') {
                const dataUrl = await window.htmlToImage.toPng(this.elements.mockFrame, options);
                const link = document.createElement('a');
                link.download = 'neckass-front-page.png';
                link.href = dataUrl;
                link.click();
                this.reportExportStatus('Mock front page downloaded.');
                this.setButtonLoading(exportButton, false);
                return;
            }

            if (!navigator.clipboard || !navigator.clipboard.write) {
                const dataUrl = await window.htmlToImage.toPng(this.elements.mockFrame, options);
                const link = document.createElement('a');
                link.download = 'neckass-front-page.png';
                link.href = dataUrl;
                link.click();
                this.reportExportStatus('Clipboard unavailable, downloaded instead.');
                this.setButtonLoading(exportButton, false);
                return;
            }

            const blob = await window.htmlToImage.toBlob(this.elements.mockFrame, options);
            if (!blob) {
                throw new Error('Failed to render image');
            }

            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);

            this.reportExportStatus('Image copied to clipboard.');
            this.setButtonLoading(exportButton, false);
        } catch (error) {
            this.reportExportStatus('Export failed. Please try again.', true);
            this.setButtonLoading(exportButton, false);
        }
    }

    reportExportStatus(message, isError = false) {
        if (!this.elements.exportStatus) return;
        this.elements.exportStatus.textContent = message;
        this.elements.exportStatus.classList.toggle('error', isError);
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
            filters: this.filters
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
}

function mapElements() {
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

function createStorageAdapter() {
    return {
        restore(baseHeadlineCount, originalCount = baseHeadlineCount) {
            const generatedHeadlines = parseJson(localStorage.getItem(STORAGE_KEYS.generatedHeadlines), []);
            const totalHeadlines = baseHeadlineCount + (Array.isArray(generatedHeadlines) ? generatedHeadlines.length : 0);
            const storedStack = parseJson(localStorage.getItem(STORAGE_KEYS.navigationStack), null);
            const legacyNavigationStack = parseJson(localStorage.getItem(STORAGE_KEYS.navigationStackLegacy), null);
            const viewedListLegacy = parseJson(localStorage.getItem(STORAGE_KEYS.viewedList), []);
            const uniqueHeadlinesLegacy = parseJson(localStorage.getItem(STORAGE_KEYS.uniqueHeadlines), null);
            const favorites = parseJson(localStorage.getItem(STORAGE_KEYS.favorites), []);
            const filters = parseJson(localStorage.getItem(STORAGE_KEYS.filters), {});

            const rawStack = Array.isArray(storedStack)
                ? storedStack
                : (Array.isArray(legacyNavigationStack)
                    ? legacyNavigationStack
                    : (Array.isArray(viewedListLegacy) ? viewedListLegacy : []));

            const sanitizedStack = rawStack.filter(index => isValidHeadlineIndex(index, totalHeadlines));
            const uniqueHeadlines = new Set(
                Array.isArray(uniqueHeadlinesLegacy) && uniqueHeadlinesLegacy.length > 0
                    ? uniqueHeadlinesLegacy.filter(index => isValidHeadlineIndex(index, totalHeadlines))
                    : sanitizedStack
            );

            return {
                navigationStack: sanitizedStack,
                uniqueHeadlines,
                currentIndex: sanitizedStack[sanitizedStack.length - 1] ?? -1,
                generatedHeadlines: Array.isArray(generatedHeadlines)
                    ? generatedHeadlines.filter(Boolean)
                    : [],
                favorites: Array.isArray(favorites) ? favorites.filter(Boolean) : [],
                filters: sanitizeFilters(filters)
            };
        },

        persist(state) {
            localStorage.setItem(STORAGE_KEYS.viewedCount, state.uniqueHeadlines.size);
            localStorage.setItem(STORAGE_KEYS.viewedList, JSON.stringify(state.navigationStack));
            localStorage.setItem(STORAGE_KEYS.navigationStack, JSON.stringify(state.navigationStack));
            localStorage.setItem(STORAGE_KEYS.navigationStackLegacy, JSON.stringify(state.navigationStack));
            localStorage.setItem(STORAGE_KEYS.uniqueHeadlines, JSON.stringify(Array.from(state.uniqueHeadlines)));
            localStorage.setItem(
                STORAGE_KEYS.generatedHeadlines,
                JSON.stringify(Array.isArray(state.generatedHeadlines) ? state.generatedHeadlines : [])
            );
            localStorage.setItem(
                STORAGE_KEYS.favorites,
                JSON.stringify(Array.isArray(state.favorites) ? state.favorites : [])
            );
            localStorage.setItem(
                STORAGE_KEYS.filters,
                JSON.stringify(state.filters || DEFAULT_FILTERS)
            );
        }
    };
}

function isValidHeadlineIndex(index, totalHeadlines) {
    return Number.isInteger(index) && index >= 0 && index < totalHeadlines;
}

function parseJson(value, fallback) {
    try {
        if (value === null) return fallback;
        return JSON.parse(value);
    } catch (error) {
        return fallback;
    }
}

function sanitizeFilters(filters = {}) {
    const sanitized = { ...DEFAULT_FILTERS };
    const allowedSections = ['latest', 'world', 'culture', 'tech', 'oddities'];
    const allowedSources = ['auto', 'generated', 'curated'];
    const allowedPanels = ['recent', 'favorites', 'generated'];
    const allowedLayouts = ['standard', 'square', 'story'];

    if (filters.section && allowedSections.includes(filters.section)) {
        sanitized.section = filters.section;
    }
    if (filters.source && allowedSources.includes(filters.source)) {
        sanitized.source = filters.source;
    }
    if (filters.panel && allowedPanels.includes(filters.panel)) {
        sanitized.panel = filters.panel;
    }
    if (filters.layout && allowedLayouts.includes(filters.layout)) {
        sanitized.layout = filters.layout;
    }
    if (typeof filters.query === 'string') {
        sanitized.query = filters.query.trim();
    }

    return sanitized;
}

function normalizeHeadlineText(text) {
    if (typeof text !== 'string') return '';
    return text.trim();
}

function selectReadableColor() {
    const selectedColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
    const rgb = hexToRgb(selectedColor);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    const background = parseColor(BASE_BACKGROUND_COLOR);

    let adjustedColor = selectedColor;
    if (brightness > BRIGHTNESS_THRESHOLD) {
        adjustedColor = darkenColor(selectedColor, 0.7);
    }

    const adjustedRgb = parseColor(adjustedColor);
    if (adjustedRgb && background) {
        const contrast = contrastRatio(adjustedRgb, background);
        if (contrast < MIN_CONTRAST_RATIO) {
            const improved = boostContrast(adjustedRgb, background);
            return rgbToString(improved);
        }
    }

    return adjustedColor;
}

function hexToRgb(hex) {
    const numeric = parseInt(hex.replace('#', ''), 16);
    return {
        r: (numeric >> 16) & 255,
        g: (numeric >> 8) & 255,
        b: numeric & 255
    };
}

function darkenColor(hex, factor) {
    const rgb = hexToRgb(hex);
    return `rgb(${Math.floor(rgb.r * factor)}, ${Math.floor(rgb.g * factor)}, ${Math.floor(rgb.b * factor)})`;
}

function parseColor(value) {
    if (!value) return null;
    if (value.startsWith('#')) {
        return hexToRgb(value);
    }
    const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) return null;
    return {
        r: Number.parseInt(match[1], 10),
        g: Number.parseInt(match[2], 10),
        b: Number.parseInt(match[3], 10)
    };
}

function relativeLuminance({ r, g, b }) {
    const normalize = (channel) => {
        const srgb = channel / 255;
        return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
    };
    const rLin = normalize(r);
    const gLin = normalize(g);
    const bLin = normalize(b);
    return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

function contrastRatio(foreground, background) {
    const lum1 = relativeLuminance(foreground);
    const lum2 = relativeLuminance(background);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}

function blendColors(color, target, amount) {
    const blendChannel = (c, t) => Math.round(c + (t - c) * amount);
    return {
        r: blendChannel(color.r, target.r),
        g: blendChannel(color.g, target.g),
        b: blendChannel(color.b, target.b)
    };
}

function boostContrast(color, background) {
    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };
    const whiteContrast = contrastRatio(white, background);
    const blackContrast = contrastRatio(black, background);
    const target = whiteContrast >= blackContrast ? white : black;

    let bestColor = color;
    let bestContrast = contrastRatio(color, background);

    for (let step = 1; step <= 10; step += 1) {
        const candidate = blendColors(color, target, step / 10);
        const candidateContrast = contrastRatio(candidate, background);
        if (candidateContrast > bestContrast) {
            bestContrast = candidateContrast;
            bestColor = candidate;
        }
        if (candidateContrast >= MIN_CONTRAST_RATIO) {
            return candidate;
        }
    }

    return bestColor;
}

function rgbToString({ r, g, b }) {
    return `rgb(${r}, ${g}, ${b})`;
}

function slugifyHeadline(headlineText) {
    if (!headlineText) return '';
    return headlineText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);
}
