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
    "BREAKING: Neckass goes viral for doomscrolling on Twitch, claims he's doing citizen journalism from his couch",
    "Local Neckass live-tweets his own dentist appointment, calls it ‘transparent healthcare for the timeline’",
    "Neckass launches a Substack titled ‘Thoughts I Had in Target’—every post is just a photo of rotisserie chickens",
    "BREAKING: Neckass refuses to accept the Terms of Service, declares himself ‘off the grid’ while posting about it",
    "Neckass joins a Discord for focus sessions, never mutes, narrates his snack choices like a cooking stream",
    "Local Neckass attempts to cancel gravity on Change.org, adds ‘ratio incoming’ in the petition description",
    "Neckass claims his Spotify Wrapped is a diagnostic tool, says lo-fi beats prove he’s enlightened",
    "BREAKING: Neckass soft-launches his houseplants on Instagram, insists they asked for privacy",
    "Neckass insists he’s ‘laptop optional,’ shows up to remote work with a Nintendo Switch and a dream",
    "Local Neckass blames Mercury retrograde for typo in his Venmo request, sends a follow-up request for emotional damages",
    "Neckass starts a GoFundMe to buy Twitter Blue just so he can un-send a tweet from 2014",
    "BREAKING: Neckass refuses to use Google Maps, crowd-sources directions via Instagram polls while driving",
    "Neckass posts a Notes app apology for microwaving fish at WeWork, adds promo code for his podcast",
    "Local Neckass claims his Reels are educational, demonstrates how to fold a hoodie ‘for the algorithm’",
    "Neckass liveblogs his trip to Costco, calls the sample aisle ‘content heaven’",
    "BREAKING: Neckass invents a productivity hack called ‘refresh inbox again,’ patents it as Inbox Pilates",
    "Neckass says he’s going ‘phone-free,’ announces it on every platform, schedules reminders to brag",
    "Local Neckass claims his FYP is a degree program, lists TikTok University on LinkedIn",
    "Neckass threatens to move to Canada after getting roasted in a group chat, Googles ‘does Canada have Wi-Fi’",
    "BREAKING: Neckass launches a BeReal for his cat, still forgets to post on time",
    "Neckass argues with ChatGPT for three hours, screenshots it as proof he’s ‘winning the discourse’",
    "Local Neckass files a Freedom of Information request for who keeps skipping his Spotify queue",
    "Neckass sells ‘main character energy’ candles on Etsy, they smell like Monster and anxiety",
    "BREAKING: Neckass proposes a federal law against slow typers, cites carpal tunnel solidarity",
    "Neckass holds a TEDx in a Discord stage channel, charges entry in Roblox gift cards",
    "Local Neckass calls his mom on FaceTime to prove he’s ‘touching grass,’ never flips the camera",
    "Neckass says he’s starting an intentional community, it’s just a group chat with a color theme",
    "BREAKING: Neckass claims crypto is back because his friend’s cousin said ‘trust,’ remortgages his gaming chair",
    "Neckass refuses to buy a planner, insists his brain has tabs, keeps losing them",
    "Local Neckass attempts to speedrun his taxes on Twitch, gets banned for spoilers",
    "Neckass forms a BookTok club, first pick is the AirPods user guide",
    "BREAKING: Neckass believes he can manifest Wi-Fi strength by making heart hands at the router",
    "Neckass launches a dating app for people who type in all lowercase, calls it ‘no caps’",
    "Local Neckass claims his sleep paralysis demon is an unpaid intern, files for back pay",
    "Neckass starts a newsletter reviewing microwavable meals, rates everything ‘vibes-based’",
    "BREAKING: Neckass insists he invented the selfie timer, demands royalties from Apple",
    "Neckass opens a virtual museum of unhinged Craigslist posts, tickets cost one cursed JPEG",
    "Local Neckass joins a co-working space just to hog the cold brew and say ‘synergy’",
    "Neckass says he’s ‘not an influencer’ while unboxing a ring light and three discount codes",
    "BREAKING: Neckass refuses to update his phone, says iOS should adapt to his aura, still uses U2 album",
    "Neckass runs a poll to decide his haircut, ignores the winner, blames bots",
    "Local Neckass starts a micro-nation in the comments section, crowns himself Mod-for-Life",
    "Neckass claims he’s biohacking because he switched to oat milk and got a standing desk",
    "BREAKING: Neckass sells NFTs of his grocery list, brags that someone right-clicked them",
    "Neckass calls customer service to complain about a meme format, asks to speak to the algorithm",
    "Local Neckass brings a ring light to jury duty, says the people deserve content",
    "Neckass joins a backyard pickleball league, live streams every serve with dramatic zooms",
    "BREAKING: Neckass tries to ratio the weather account, blocks the sun for ‘being loud’",
    "Neckass launches a podcast reviewing other podcasts, every episode is just the intro music",
    "Local Neckass writes a Medium post titled ‘Why I Ghosted My Landlord,’ cites research",
    "Neckass claims he can taste different Wi-Fi networks, calls Starbucks signal ‘notes of vanilla and lag’",
    "BREAKING: Neckass sets up a LinkedIn for his dog, immediately receives recruiter DMs",
    "Neckass opens a pop-up nap lounge inside a Verizon store, calls it ‘restorative bandwidth’",
    "Local Neckass says he’s ‘crowdsourcing his feelings,’ posts a survey with one option: yes",
    "Neckass submits a FOIA request to find out who left him on read",
    "BREAKING: Neckass insists he invented vibe checks, offers certifications for $12 and a follow back",
    "Neckass complains that his smart fridge won’t like his tweets, accuses it of shadowbanning",
    "Local Neckass attempts to cook exclusively using DoorDash instructions, calls it ‘ghost kitchen cosplay’",
    "Neckass shows up to Zoom court with an anime background, insists it’s his legal brand",
    "BREAKING: Neckass starts a neighborhood watch to track who’s stealing his parking lot Wi-Fi",
    "Neckass claims he’s ‘off caffeine’ while holding a venti iced espresso with two Red Bulls inside",
    "Local Neckass buys a treadmill just to get more steps on his Apple Watch circles, resells it as NFT art",
    "Neckass pitches Shark Tank on selling air from his apartment as ‘limited edition vibe drafts’",
    "BREAKING: Neckass demands reparations for buffering, sends invoice to his ISP with emojis",
    "Neckass livestreams himself reading the comments section, tears up when someone posts a period",
    "Local Neckass uses BeReal as his budgeting app, still overspends on hoodies",
    "Neckass claims his aura is biodegradable, encourages composting compliments",
    "BREAKING: Neckass files a trademark on ‘out of office’ then forgets to set his own",
    "Neckass organizes a silent disco for introverts, everyone just types ‘vibe’ in the chat",
    "Local Neckass says he’s running for HOA president on a platform of better memes in the bulletin board",
    "Neckass makes a vision board entirely out of screenshots of his own tweets",
    "BREAKING: Neckass opens an Etsy store selling receipts he found in his Uber, calls them vintage PDFs",
    "Neckass gets banned from the library for treating it like a co-working space with ASMR calls",
    "Local Neckass installs RGB lights in his shower for ‘emotional patch notes’",
    "Neckass hosts a Zoom wedding for his houseplants, registry is just soil links",
    "BREAKING: Neckass refuses to clap on planes, says applause is microtransaction-based now",
    "Neckass creates a new zodiac sign based on screen time, calls himself a ‘full moon scroller’",
    "Local Neckass thinks TSA PreCheck is an NFT whitelist, shows his MetaMask at security",
    "Neckass files his taxes in Comic Sans, claims it’s his authentic personal brand",
    "BREAKING: Neckass pitches a reality show where he judges people’s screen setups, winner gets a cable management kit",
    "Neckass says he’s ‘doing a social experiment’ by only replying in gifs for a week, loses three friends and a cousin",
    "Local Neckass refuses to join the family group text, starts a Discord server with lore documents",
    "Neckass insists he’s allergic to scheduled emails, requests all invites be sent as memes",
    "BREAKING: Neckass buys a standing desk for his cat so they can ‘grind together’",
    "Neckass accidentally invents a new sport called ‘scroll and stroll,’ counts steps by doomscroll volume",
    "Local Neckass claims his apartment is ‘tiny-home-core,’ refuses to measure square footage",
    "Neckass hosts a webinar on time management that starts 45 minutes late, blames daylight savings",
    "BREAKING: Neckass applies for ambassador to the Metaverse, uses Bitmoji headshot on his resume",
    "Neckass converts his couch to a ‘home office,’ writes off his blanket as ergonomic equipment",
    "Local Neckass rewrites his resume as a Twitter thread, includes memes as endorsements",
    "Neckass files a bug report on daylight, requests dark mode for 2 p.m.",
    "BREAKING: Neckass installs a ring light on his bike helmet to ‘go live’ while commuting",
    "Neckass claims to be carbon-neutral because he only cooks with an air fryer and vibes",
    "Local Neckass tries to sell ‘pre-owned ideas’ on Depop, calls it intellectual thrift",
    "Neckass starts a book club where they only read Terms of Service, calls it legal lit",
    "BREAKING: Neckass renames his calendar events ‘quests,’ levels up by hitting snooze",
    "Neckass demands a national holiday for the day he almost went viral, drafts parade route in Canva",
    "Local Neckass launches a Kickstarter for a smart toaster that only browns bread influencers approve",
    "Neckass claims he can smell low battery, demands universal chargers in public restrooms",
    "BREAKING: Neckass starts a side hustle rating public Wi-Fi like a sommelier, carries a pocket router for notes",
    "Neckass says he’s ‘experimenting with minimalism’ by deleting one app and reinstalling it nightly",
    "Local Neckass builds a DIY standing desk from pizza boxes, calls it ‘carbonated ergonomics’",
    "Neckass opens a VR co-working space in his living room, charges admission in exposure",
    "BREAKING: Neckass records a guided meditation that’s just him scrolling slowly on mute",
    "Neckass insists his aura syncs with Bluetooth, claims AirPods are reading his thoughts",
    "Local Neckass tries to manifest a yacht by adding it to his ‘For You’ keywords",
    "Neckass files a ticket with HR for being assigned to the wrong meme channel",
    "BREAKING: Neckass attempts to patent the phrase ‘per my last vibe,’ sends cease-and-desists in glitter envelopes",
    "Neckass holds a stand-up set entirely in the comments section, gets heckled by a bot",
    "Local Neckass brings a mechanical keyboard to coffee shops just for the ASMR",
    "Neckass builds a mirror maze for networking events so the turnout always looks packed",
    "BREAKING: Neckass publishes a map of ‘places worth his presence,’ it’s just Buc-ee’s and his couch",
    "Neckass refuses to use calendars, says time should be push-notified when it’s ready",
    "Local Neckass leaves Yelp reviews on public restrooms based on mirror selfie lighting",
    "Neckass claims the moon is a ring light for the ocean, demands merch",
    "BREAKING: Neckass names his router ‘neighborhood watch,’ blocks everyone but himself",
    "Neckass hosts a daily Twitch stream called ‘watch me wait for packages,’ 40 people subscribe",
    "Local Neckass patents his eye roll, requests royalties from sitcom reruns",
    "Neckass writes a manifesto about why blue light glasses are a scam, posts it at 3 a.m.",
    "BREAKING: Neckass starts a climate initiative where he recycles only compliments, calls it verbal compost",
    "Neckass builds a spreadsheet of people who ‘owe him a like,’ sends monthly reminders with Bitmoji stamps",
    "Local Neckass submits his grocery list to the Library of Congress as ‘historically online’",
    "Neckass drafts peace talks with Mondays, streams negotiations, chat spams F in support",
    "BREAKING: Neckass claims he invented air, demands his face on LaCroix cans, gets ratioed by seltzer Twitter",
    "Neckass hosts a meditation retreat focused on manifesting more Neckass, snacks not included",
    "Local Neckass refuses to leave the group chat, files restraining order against the ‘left chat’ notification",
    "Neckass claims he can taste colors, rates blue ‘overrated,’ prefers limited-edition Baja Blast hue",
    "BREAKING: Neckass tries to sell autographs of his future self, insists they’re NFT-ready",
    "Neckass uses VR headset to tour his imagination, charges admission for premium daydreams",
    "Local Neckass opens a pop-up philosophy booth: $10 to hear him ask ‘but what is money?’ next to a bank",
    "Neckass applies to Space Force, lists ‘cosmic swagger’ as primary skill, references Buzz Lightyear",
    "BREAKING: Neckass holds a networking event where only he can talk, name tags all say Neckass"
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
        this.elements.headlineList?.addEventListener('click', (event) => {
            const target = event.target.closest('button[data-index]');
            if (!target) return;
            const index = Number.parseInt(target.dataset.index, 10);
            if (Number.isInteger(index)) {
                this.selectHeadline(index);
            }
        });
        window.addEventListener('popstate', (event) => this.handlePopState(event));
        document.addEventListener('keydown', this.handleDirectionalNavigation);
    }

    async handleNext() {
        if (this.headlines.length === 0) {
            this.renderEmptyState();
            return;
        }

        const generatorAvailable = typeof window.tinyLlmClient?.generateHeadline === 'function';
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
        const generatorAvailable = typeof window.tinyLlmClient?.generateHeadline === 'function';
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
        const hasFilters = Boolean(this.filters.query || this.filters.section !== 'latest' || this.filters.source !== 'auto');
        this.elements.headline.textContent = hasFilters
            ? 'No headlines match your current filters.'
            : 'No headlines available.';
        this.elements.headline.style.color = '';
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

        this.elements.twitterShareLink.href = `https://twitter.com/intent/tweet?text=${encodedHeadline}&url=${encodedUrl}&hashtags=Neckass`;
        this.elements.facebookShareLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedHeadline}`;
        this.elements.redditShareLink.href = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedHeadline}`;
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
        const normalized = section || 'latest';
        if (this.filters.section === normalized) return;
        this.filters.section = normalized;
        this.resetNavigationForFilters();
        this.persistState();
        this.syncFilterControls();
        this.refreshFilteredIndexes();
        this.ensureHeadlineMatchesFilters();
    }

    setSourceFilter(source) {
        const normalized = source || 'auto';
        if (this.filters.source === normalized) return;
        this.filters.source = normalized;
        this.resetNavigationForFilters();
        this.persistState();
        this.syncFilterControls();
        this.refreshFilteredIndexes();
        this.ensureHeadlineMatchesFilters();
    }

    setActivePanel(panel) {
        const normalized = panel || 'recent';
        if (this.filters.panel === normalized) return;
        this.filters.panel = normalized;
        this.persistState();
        this.syncFilterControls();
        this.updateHistoryList();
        this.updateHistoryState(this.state.currentIndex, { replace: false });
    }

    setMockLayout(layout) {
        const normalized = layout || 'standard';
        if (this.filters.layout === normalized) return;
        this.filters.layout = normalized;
        this.persistState();
        this.applyMockLayoutClass();
        this.updateHistoryState(this.state.currentIndex, { replace: false });
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
        if (this.filters.query === query.trim()) {
            this.updateFilterStatus();
            return;
        }
        this.filters.query = query.trim();
        this.resetNavigationForFilters();
        this.persistState();
        this.syncFilterControls();
        this.refreshFilteredIndexes();
        this.ensureHeadlineMatchesFilters();
    }

    clearSearch() {
        if (this.elements.searchInput) {
            this.elements.searchInput.value = '';
        }
        if (!this.filters.query) {
            this.updateFilterStatus();
            return;
        }
        this.filters.query = '';
        this.resetNavigationForFilters();
        this.persistState();
        this.syncFilterControls();
        this.refreshFilteredIndexes();
        this.ensureHeadlineMatchesFilters();
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

        indexes.forEach((index) => {
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
            this.elements.headlineList.appendChild(item);
        });
    }

    getPanelIndexes(panel) {
        let indexes = [];
        if (panel === 'favorites') {
            indexes = Array.from(this.favoriteHeadlines)
                .map((headline) => this.headlineCache.get(headline))
                .filter((index) => Number.isInteger(index));
        } else if (panel === 'generated') {
            indexes = this.headlines
                .map((_, index) => index)
                .filter((index) => index >= this.baseHeadlineCount);
        } else {
            indexes = [...this.state.navigationStack].reverse();
        }

        return indexes.filter((index) => this.isIndexEligible(index));
    }

    updateLayoutButtons() {
        if (!this.elements.layoutButtons) return;
        this.elements.layoutButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.layout === this.filters.layout);
        });
    }

    updateToggleButtons(buttons, value, attribute = 'source') {
        if (!buttons) return;
        buttons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset[attribute] === value);
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
        this.updateFilterStatus();
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
        const mergedFilters = sanitizeFilters({
            ...this.filters,
            section: urlState.section ?? this.filters.section,
            query: urlState.query ?? this.filters.query,
            source: urlState.source ?? this.filters.source,
            panel: urlState.panel ?? this.filters.panel,
            layout: urlState.layout ?? this.filters.layout
        });

        this.filters = mergedFilters;
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
        const mergedFilters = sanitizeFilters({
            ...this.filters,
            ...state.filters,
            section: urlState.section ?? state.filters?.section ?? this.filters.section,
            query: urlState.query ?? state.filters?.query ?? this.filters.query,
            source: urlState.source ?? state.filters?.source ?? this.filters.source,
            panel: urlState.panel ?? state.filters?.panel ?? this.filters.panel,
            layout: urlState.layout ?? state.filters?.layout ?? this.filters.layout
        });

        this.filters = mergedFilters;
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

    toggleLoader(shouldShow, message = null) {
        if (message && this.elements.loaderText) {
            this.elements.loaderText.textContent = message;
        } else if (message && this.elements.loader) {
            this.elements.loader.textContent = message;
        }
        this.elements.loader.style.display = shouldShow ? 'flex' : 'none';
        this.elements.loader.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
        this.setNavigationLoading(shouldShow);
    }

    setNavigationLoading(shouldShow) {
        this.state.isLoading = shouldShow;
        this.updateNavigationAvailability();
        if (this.activeButton) {
            this.setButtonLoading(this.activeButton, shouldShow);
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
