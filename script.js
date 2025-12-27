const STORAGE_KEYS = {
    viewedCount: 'headlinesViewed',
    viewedList: 'viewedHeadlines',
    navigationStack: 'navigationStack',
    navigationStackLegacy: 'viewedStack',
    uniqueHeadlines: 'uniqueHeadlines',
    darkMode: 'darkMode'
};

const ANIMATION_DELAY_MS = 500;
const BRIGHTNESS_THRESHOLD = 130;
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
        this.headlines = allHeadlines;
        this.elements = elements;
        this.storage = storage;
        this.state = storage.restore(allHeadlines.length);
        this.handleDirectionalNavigation = this.handleDirectionalNavigation.bind(this);
    }

    init() {
        this.applyDarkMode(this.state.darkModeEnabled);
        this.updateHeadlineCounter();
        this.updateNavigationAvailability();
        this.updateMockDate();
        this.bindEvents();
        this.applyUrlHeadlineSelection();
        this.renderInitialHeadline();
    }

    bindEvents() {
        this.elements.nextButton.addEventListener('click', () => this.handleNext());
        this.elements.previousButton.addEventListener('click', () => this.handlePrevious());
        this.elements.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        this.elements.copyButton.addEventListener('click', () => this.copyHeadline());
        this.elements.downloadMockButton?.addEventListener('click', () => this.exportMockFront('download'));
        this.elements.copyMockButton?.addEventListener('click', () => this.exportMockFront('copy'));
        window.addEventListener('popstate', (event) => this.handlePopState(event));
        document.addEventListener('keydown', this.handleDirectionalNavigation);
    }

    handleNext() {
        if (this.headlines.length === 0) {
            this.renderEmptyState();
            return;
        }

        const nextIndex = this.getRandomIndex();
        this.renderHeadline(nextIndex);
    }

    handlePrevious() {
        if (this.state.navigationStack.length <= 1) {
            return;
        }

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

    renderHeadline(index, options = { pushToStack: true, replaceState: false }) {
        this.toggleLoader(true);
        this.elements.headline.classList.remove('show');

        setTimeout(() => {
            this.elements.headline.textContent = this.headlines[index];
            this.elements.headline.style.color = selectReadableColor(this.state.darkModeEnabled);
            this.elements.headline.classList.add('show');
            this.toggleLoader(false);

            this.updateMockDate();

            this.updateViewedState(index, options);
            this.updateDocumentMetadata(this.headlines[index], index);
            this.updateSocialShareLinks(this.headlines[index], index);
            this.updateMockHeadline(this.headlines[index]);
            this.persistState();
            this.updateHistoryState(index, { replace: options.replaceState });
        }, ANIMATION_DELAY_MS);
    }

    renderInitialHeadline() {
        if (this.state.navigationStack.length > 0 && isValidHeadlineIndex(this.state.currentIndex, this.headlines.length)) {
            this.renderHeadline(this.state.currentIndex, { pushToStack: false, replaceState: true });
            return;
        }

        this.handleNext();
    }

    renderEmptyState() {
        this.elements.headline.textContent = 'No headlines available.';
        this.elements.headline.style.color = '';
        this.updateDocumentMetadata('', -1);
        this.updateSocialShareLinks('', -1);
        this.updateMockHeadline('No headlines available.');
        this.toggleLoader(false);
        this.elements.nextButton.disabled = true;
        this.updateNavigationAvailability();
    }

    updateViewedState(index, options = { pushToStack: true }) {
        if (options.pushToStack) {
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

        this.elements.twitterShareLink.href = `https://twitter.com/intent/tweet?text=${encodedHeadline}&url=${encodedUrl}&hashtags=Neckass`;
        this.elements.facebookShareLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedHeadline}`;
        this.elements.redditShareLink.href = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedHeadline}`;
    }

    updateHeadlineCounter() {
        this.elements.counter.textContent = this.state.uniqueHeadlines.size;
    }

    updateNavigationAvailability() {
        this.elements.previousButton.disabled = this.state.navigationStack.length <= 1;
    }

    handleDirectionalNavigation(event) {
        const ignoredTags = ['INPUT', 'TEXTAREA', 'BUTTON', 'A', 'SELECT', 'OPTION'];
        if (ignoredTags.includes(event.target.tagName)) return;

        const forwardKeys = ['ArrowRight', 'ArrowDown'];
        const backwardKeys = ['ArrowLeft', 'ArrowUp'];

        if (forwardKeys.includes(event.key)) {
            this.handleNext();
        } else if (backwardKeys.includes(event.key)) {
            this.handlePrevious();
        } else if (event.key === 'Enter' || event.key === ' ') {
            this.handleNext();
        }
    }

    applyUrlHeadlineSelection() {
        const identifier = this.getHeadlineIdentifierFromUrl();
        const index = this.identifierToIndex(identifier);

        if (isValidHeadlineIndex(index, this.headlines.length)) {
            this.state.navigationStack = [index];
            this.state.uniqueHeadlines.add(index);
            this.state.currentIndex = index;
            this.persistState();
            this.updateHeadlineCounter();
            this.updateNavigationAvailability();
            this.updateHistoryState(index, { replace: true });
        } else if (identifier !== null) {
            this.updateHistoryState(-1, { replace: true });
        }
    }

    getHeadlineIdentifierFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const queryIdentifier = params.get('headline');
        if (queryIdentifier) return queryIdentifier;

        const hashMatch = window.location.hash.match(/headline-([^&]+)/i);
        return hashMatch ? hashMatch[1] : null;
    }

    identifierToIndex(identifier) {
        if (identifier === null || identifier === undefined) return null;
        const parsed = Number.parseInt(identifier, 10);
        return Number.isInteger(parsed) ? parsed : null;
    }

    indexToIdentifier(index) {
        return typeof index === 'number' && index >= 0 ? String(index) : '';
    }

    buildHeadlineUrl(index) {
        const url = new URL(window.location.href);
        url.hash = '';
        if (isValidHeadlineIndex(index, this.headlines.length)) {
            url.searchParams.set('headline', this.indexToIdentifier(index));
        } else {
            url.searchParams.delete('headline');
        }

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
            uniqueHeadlines: Array.from(this.state.uniqueHeadlines)
        };

        if (replace) {
            history.replaceState(state, '', url);
        } else {
            history.pushState(state, '', url);
        }
    }

    handlePopState(event) {
        const state = event.state || {};
        const urlIndex = this.identifierToIndex(this.getHeadlineIdentifierFromUrl());
        const stateIndex = this.identifierToIndex(state.headlineIndex);
        const targetIndex = isValidHeadlineIndex(stateIndex, this.headlines.length)
            ? stateIndex
            : (isValidHeadlineIndex(urlIndex, this.headlines.length) ? urlIndex : null);

        if (targetIndex === null) {
            this.handleNext();
            return;
        }

        const restoredStack = Array.isArray(state.navigationStack)
            ? state.navigationStack.filter((idx) => isValidHeadlineIndex(idx, this.headlines.length))
            : [];
        const restoredUnique = Array.isArray(state.uniqueHeadlines)
            ? state.uniqueHeadlines.filter((idx) => isValidHeadlineIndex(idx, this.headlines.length))
            : [];

        this.state.navigationStack = restoredStack.length > 0 ? restoredStack : [targetIndex];
        if (!this.state.navigationStack.includes(targetIndex)) {
            this.state.navigationStack.push(targetIndex);
        }

        this.state.uniqueHeadlines = new Set([...this.state.uniqueHeadlines, ...restoredUnique, targetIndex]);
        this.state.currentIndex = targetIndex;
        this.persistState();
        this.updateHeadlineCounter();
        this.updateNavigationAvailability();
        this.renderHeadline(targetIndex, { pushToStack: false, replaceState: true });
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

    toggleDarkMode() {
        this.state.darkModeEnabled = !this.state.darkModeEnabled;
        this.applyDarkMode(this.state.darkModeEnabled);
        this.persistState();
    }

    applyDarkMode(isEnabled) {
        const containers = Array.isArray(this.elements.containers)
            ? this.elements.containers
            : [];

        const targetNodes = [
            document.body,
            ...containers,
            this.elements.headlineSection,
            this.elements.controls,
            this.elements.socialShare,
            this.elements.copySection,
            this.elements.themeToggleSection,
            this.elements.loader,
            this.elements.mockFrame
        ].filter(Boolean);

        targetNodes.forEach(node => node.classList.toggle('dark-mode', isEnabled));
        document.querySelectorAll('button').forEach(button => {
            button.classList.toggle('dark-mode', isEnabled);
        });
    }

    copyHeadline() {
        const headlineText = this.elements.headline.innerText;

        if (!headlineText) {
            this.reportCopyStatus('No headline available to copy.', true);
            return;
        }

        if (this.canUseClipboardApi()) {
            this.copyWithClipboardApi(headlineText);
            return;
        }

        try {
            const success = this.copyWithFallback(headlineText);
            if (success) {
                this.reportCopyStatus('Headline copied to clipboard!');
            } else {
                this.reportCopyStatus('Copy failed. Please try again.', true);
            }
        } catch (error) {
            this.reportCopyStatus('Clipboard unavailable in this browser.', true);
            this.elements.copyButton.disabled = true;
        }
    }

    canUseClipboardApi() {
        return navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
    }

    copyWithClipboardApi(text) {
        navigator.clipboard.writeText(text)
            .then(() => this.reportCopyStatus('Headline copied to clipboard!'))
            .catch(() => this.reportCopyStatus('Unable to access clipboard.', true));
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

    reportCopyStatus(message, isError = false) {
        if (!this.elements.copyStatus) return;
        this.elements.copyStatus.textContent = message;
        this.elements.copyStatus.classList.toggle('error', isError);
    }

    toggleLoader(shouldShow) {
        this.elements.loader.style.display = shouldShow ? 'block' : 'none';
        this.elements.loader.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
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
            this.reportExportStatus('Export unavailable at the moment.', true);
            return;
        }

        this.reportExportStatus('Rendering front page...');

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
                return;
            }

            if (!navigator.clipboard || !navigator.clipboard.write) {
                this.reportExportStatus('Clipboard unavailable for images.', true);
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
        } catch (error) {
            this.reportExportStatus('Export failed. Please try again.', true);
        }
    }

    reportExportStatus(message, isError = false) {
        if (!this.elements.exportStatus) return;
        this.elements.exportStatus.textContent = message;
        this.elements.exportStatus.classList.toggle('error', isError);
    }

    getRandomIndex() {
        if (this.headlines.length <= 1) {
            return 0;
        }

        let randomIndex = Math.floor(Math.random() * this.headlines.length);
        while (randomIndex === this.state.currentIndex) {
            randomIndex = Math.floor(Math.random() * this.headlines.length);
        }

        return randomIndex;
    }

    persistState() {
        this.storage.persist({
            navigationStack: this.state.navigationStack,
            uniqueHeadlines: this.state.uniqueHeadlines,
            currentIndex: this.state.currentIndex,
            darkModeEnabled: this.state.darkModeEnabled
        });
    }
}

function mapElements() {
    return {
        headline: document.getElementById('headline'),
        loader: document.getElementById('loader'),
        nextButton: document.getElementById('next-btn'),
        previousButton: document.getElementById('prev-btn'),
        counter: document.getElementById('counter'),
        mastheadDate: document.getElementById('masthead-date'),
        featureDateline: document.getElementById('feature-date'),
        twitterShareLink: document.getElementById('twitter-share'),
        facebookShareLink: document.getElementById('facebook-share'),
        redditShareLink: document.getElementById('reddit-share'),
        darkModeToggle: document.getElementById('toggle-dark-mode'),
        copyButton: document.getElementById('copy-btn'),
        copyStatus: document.getElementById('copy-status'),
        downloadMockButton: document.getElementById('download-mock'),
        copyMockButton: document.getElementById('copy-mock'),
        exportStatus: document.getElementById('export-status'),
        mockFrame: document.getElementById('mock-front'),
        mockHeadline: document.getElementById('mock-headline'),
        mockDate: document.getElementById('mock-date'),
        containers: Array.from(document.querySelectorAll('.container')),
        headlineSection: document.querySelector('.headline-section'),
        controls: document.querySelector('.controls'),
        socialShare: document.querySelector('.social-share'),
        copySection: document.querySelector('.copy-headline'),
        themeToggleSection: document.querySelector('.theme-toggle')
    };
}

function createStorageAdapter() {
    return {
        restore(totalHeadlines) {
            const storedStack = parseJson(localStorage.getItem(STORAGE_KEYS.navigationStack), null);
            const legacyNavigationStack = parseJson(localStorage.getItem(STORAGE_KEYS.navigationStackLegacy), null);
            const viewedListLegacy = parseJson(localStorage.getItem(STORAGE_KEYS.viewedList), []);
            const uniqueHeadlinesLegacy = parseJson(localStorage.getItem(STORAGE_KEYS.uniqueHeadlines), null);
            const darkModeEnabled = localStorage.getItem(STORAGE_KEYS.darkMode) === 'true';

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
                darkModeEnabled
            };
        },

        persist(state) {
            localStorage.setItem(STORAGE_KEYS.viewedCount, state.uniqueHeadlines.size);
            localStorage.setItem(STORAGE_KEYS.viewedList, JSON.stringify(state.navigationStack));
            localStorage.setItem(STORAGE_KEYS.navigationStack, JSON.stringify(state.navigationStack));
            localStorage.setItem(STORAGE_KEYS.navigationStackLegacy, JSON.stringify(state.navigationStack));
            localStorage.setItem(STORAGE_KEYS.uniqueHeadlines, JSON.stringify(Array.from(state.uniqueHeadlines)));
            localStorage.setItem(STORAGE_KEYS.darkMode, String(state.darkModeEnabled));
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

function selectReadableColor(isDarkMode) {
    const selectedColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
    const rgb = hexToRgb(selectedColor);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

    if (isDarkMode && brightness > BRIGHTNESS_THRESHOLD) {
        return darkenColor(selectedColor, 0.7);
    }

    return selectedColor;
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
