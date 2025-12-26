const STORAGE_KEYS = {
    viewedCount: 'headlinesViewed',
    viewedList: 'viewedHeadlines',
    navigationStack: 'navigationStack',
    navigationStackLegacy: 'viewedStack',
    uniqueHeadlines: 'uniqueHeadlines',
    darkMode: 'darkMode',
    credits: 'credits',
    combo: 'combo',
    hype: 'hype',
    autoPrinterLevel: 'autoPrinterLevel',
    lastActiveAt: 'lastActiveAt',
    lastInteractionAt: 'lastInteractionAt'
};

const ANIMATION_DELAY_MS = 500;
const BRIGHTNESS_THRESHOLD = 130;
const BASE_CREDIT_REWARD = 12;
const COMBO_WINDOW_MS = 6000;
const COMBO_STEP_BONUS = 0.06;
const HYPE_STEP = 8;
const HYPE_MAX = 100;
const HYPE_BONUS_MULTIPLIER = 0.4;
const HYPE_DECAY_RATE = 2;
const HYPE_DECAY_INTERVAL_MS = 2000;
const AUTO_PRINTER_BASE_RATE = 1.5;
const AUTO_UPGRADE_BASE_COST = 120;
const AUTO_TICK_MS = 1000;
const COLOR_PALETTE = [
    '#FF5733', '#33FF57', '#3357FF', '#F333FF',
    '#FF33A8', '#FF8F33', '#33FFF5', '#338FFF',
    '#FF33F6', '#FF4500', '#33FFBD', '#FFB533',
    '#FFA833', '#5A5AFF', '#FF33C4', '#FF4444',
    '#44FF88'
];

const headlines = [
    "Neckass Starts Petition to Ban Calculators, Claims They 'Steal Human Creativity'—Still Can’t Do Basic Math",
    "Local Neckass Declares Himself a Sovereign Citizen, Instantly Gets Kicked Out of Walmart for Loitering",
    "Neckass Publishes Self-Help Book Titled 'How to Be Better Than Everyone'—It’s Just Blank Pages",
    "BREAKING: Neckass Refuses to Believe in Wind, Says ‘If I Can’t See It, It Doesn’t Exist’",
    "Neckass Declares War on Gravity: 'It’s Holding Me Down in Life—Literally'",
    "Local Neckass Claims He 'Single-Handedly Solved the Internet' by Closing His Laptop",
    "Neckass Refuses to Eat Vegetables, Claims 'I Run on Pure Genius Fuel—No Broccoli Required'",
    "BREAKING: Neckass Starts Debate Club, Bans Everyone Who Disagrees With Him by Round Two",
    "Neckass Announces New Law of Physics: 'Everything I Do Is Right Because I Said So'",
    "Local Neckass Convinced He Can Time Travel by Sleeping In Late—Calls It ‘Chrono-Hacking’",
    "BREAKING: Neckass Sues Sun for ‘Infringing on His Brilliance’",
    "Neckass Declares the Earth Is Flat—Only on Weekends Though",
    "Local Neckass Invents Conspiracy Theory That 'Shoelaces Are Government Mind Control Devices'",
    "BREAKING: Neckass Publishes Essay Claiming Air Conditioning Is a Government Plot to ‘Make Us Weak’",
    "Neckass Launches Masterclass on 'How to Be the Smartest Person in the Room'—It’s 3 Hours of Him Talking About Himself",
    "Local Neckass Claims He Doesn't Need Sleep Because His Brain 'Runs on Pure Ego'",
    "BREAKING: Neckass Tries to Patent the Concept of Breathing, Calls It His 'Original Idea'",
    "Neckass Launches Cryptocurrency Called 'SuperiorityCoin'—Currently Valued at 0¢",
    "Local Neckass Thinks He Discovered a New Species—It’s Just His Own Reflection in a Window",
    "BREAKING: Neckass Declares He’s Smarter Than Einstein, Still Can’t Figure Out How to Open a PDF",
    "Neckass Announces He’s Immortal—But ‘Only When People Aren’t Looking’",
    "Local Neckass Tries to Hack NASA—Accidentally Deletes His Own Email",
    "BREAKING: Neckass Thinks He Solved Climate Change—'Just Turn Off the Sun for a While'",
    "Neckass Launches Academy for 'Elite Minds'—Only Requirement Is 'Liking My Tweets'",
    "Local Neckass Claims He Invented Fire, Insists Cavemen Are 'Overrated'",
    "BREAKING: Neckass Claims He Can Control the Weather with His 'Extremely Strong Vibes'",
    "Neckass Refuses to Use Maps, Says 'My Mind Is Its Own GPS—It Just Needs to Recharge Sometimes'",
    "Local Neckass Declares Himself 'Lord of the Internet' After Correctly Guessing His Own Password",
    "BREAKING: Neckass Refuses Vaccines, Claims His Ego Is '99% Germ-Free'",
    "Neckass Starts New Religion Based on His Own Tweets—No One Joins, But He’s ‘Totally Fine with It’",
    "Local Neckass Declares War on Mathematics: 'Numbers Are Just a Tool of the Oppressors'",
    "BREAKING: Neckass Thinks He Discovered Telepathy After Guessing What He Was About to Say",
    "Neckass Declares Himself 'King of Logic' After Winning Argument With a Parrot",
    "Local Neckass Writes Open Letter to the World—It’s Just 1,000 Pages of 'You’re Welcome'",
    "BREAKING: Neckass Proclaims Himself ‘Master of Time’ After Setting His Clock 5 Minutes Fast",
    "Neckass Tries to Launch a Podcast About Genius Thoughts—It’s Just 3 Hours of White Noise",
    "Local Neckass Declares He Can Cure Any Disease With ‘Sheer Willpower’—No Science Needed",
    "BREAKING: Neckass Demands Statues Be Built in His Honor for 'Solving All Problems by Ignoring Them'",
    "Neckass Declares All Scientists Are 'Overrated' After Successfully Heating Ramen in a Microwave",
    "Local Neckass Refuses to Believe in Dinosaurs, Claims ‘They’re Just Hollywood Propaganda’",
    "BREAKING: Neckass Declares the Moon Is ‘Just a Projection’—Calls for Its ‘Immediate Takedown’",
    "Neckass Refuses to Pay Taxes, Claims 'My Contributions to Society Are Payment Enough'",
    "Local Neckass Invents New Language—It’s Just Pig Latin but ‘Cooler’",
    "BREAKING: Neckass Launches New 'Self-Improvement Course'—Main Lesson: 'Be More Like Me'",
    "Neckass Declares Himself ‘Too Good for Sleep,’ Passes Out Mid-Sentence Anyway",
    "Local Neckass Attempts to Prove Airplanes Aren’t Real, Calls Them 'Flying Illusions'",
    "BREAKING: Neckass Claims He Invented Water by Drinking It—Demands Credit",
    "Neckass Refuses to Believe in Electricity, Insists 'Power Comes From His Inner Brilliance'",
    "Local Neckass Declares His Thoughts Should Be Taught in Schools—Writes Curriculum, It’s Just His Twitter Feed",
    "BREAKING: Neckass Declares He Can Fly—Claims It’s ‘Too Dangerous’ to Prove in Public",
    "Neckass Opens Wellness Retreat Where The Only Treatment Is Listening to His Motivational Rants",
    "Local Neckass Tries Meal Prepping Once, Immediately Announces Cookbook Deal",
    "Neckass Applies for Shark Tank With Idea to Sell Air—Demands 90% Equity",
    "BREAKING: Neckass Invents New Productivity Hack: Doing Nothing and Calling It Visionary Rest",
    "Neckass Launches City-Wide Rebrand Without Telling the City, Hands Out New Flags Anyway",
    "Local Neckass Claims He’s Living Off the Grid—From His Condo’s Balcony",
    "Neckass Unveils Fitness Plan: Pace Around Complaining About Gyms",
    "BREAKING: Neckass Starts Neighborhood Watch to Make Sure Everyone Notices Him",
    "Neckass Hosts TEDx Talk in His Living Room; Audience of Three Gives Standing Ovation",
    "Local Neckass Says He’s ‘Going Minimalist’—Keeps Only Things That Have His Name On Them",
    "BREAKING: Neckass Opens Museum Dedicated to Himself—Tours Offered Every Hour by Him, Featuring Him",
    "Neckass Patents the Phrase ‘You’re Welcome’—Demands Royalties for Basic Manners",
    "Local Neckass Tries to Summon Thunder by Clapping—Claims It Worked Because It Rained Tomorrow",
    "BREAKING: Neckass Declares Email ‘Too Corporate’—Insists All Messages Be Sent Via Carrier Pigeon",
    "Neckass Attempts to Invent Square Wheels to ‘Disrupt Transportation’—Blames Physics for Failure",
    "Local Neckass Hosts Silent Disco Alone—Says It’s ‘An Exclusive Invitation to His Inner Genius’",
    "BREAKING: Neckass Starts Pyramid Scheme Shaped Like a Circle—Says It’s ‘Geometrically Innovative’",
    "Neckass Claims He Doesn’t Need Alarm Clocks Because Time Bows to His Schedule",
    "Local Neckass Creates Motivational Posters Featuring Only His Signature",
    "BREAKING: Neckass Applies for Trademark on the Word ‘Innovation’—Cites His Mirror as Proof",
    "Neckass Declares Wi-Fi a ‘Government Mirage’—Installs Ethernet Cables in His Backyard Garden",
    "Local Neckass Attempts to Crowdsource a Statue of Himself—Offers Exposure as Payment",
    "BREAKING: Neckass Tries to Cancel Mondays—Threatens Legal Action Against the Calendar",
    "Neckass Opens Pop-Up Store Selling Invisible Merchandise—Claims It Sold Out Instantly",
    "Local Neckass Writes Think Piece on Why Gravity Is ‘Just a Suggestion for the Weak’",
    "BREAKING: Neckass Announces Reality TV Show Where He Judges People for Not Being Him",
    "Neckass Refuses to Update His Phone—Says Software Should Adapt to His Aura Instead",
    "Local Neckass Offers Masterclass in Breathing—Charges Extra for Exhaling Techniques",
    "BREAKING: Neckass Declares He Invented Silence—Asks Everyone to Stop Using It Without Permission",
    "Neckass Launches Wellness App That Sends Hourly Reminders to Admire Him",
    "Local Neckass Says He Invented Multi-Tasking by Chewing Gum While Standing Still",
    "BREAKING: Neckass Starts Sustainability Initiative—Recycles Only Compliments",
    "Neckass Claims He Can Speak to Wi-Fi Routers, Demands They Respect His Bandwidth",
    "Local Neckass Opens Pop-Up Planetarium in His Basement Using Flashlights",
    "BREAKING: Neckass Launches Weather Hotline Where He Guesses the Sky’s Mood",
    "Neckass Announces New Currency Backed by His Ego, Calls It the Gold-ish Standard",
    "Local Neckass Refuses to Use Laptops on Tuesdays—Says It’s a Personal Tech Sabbath",
    "BREAKING: Neckass Leads Protest Against Clouds for Blocking His Spotlight",
    "Neckass Hosts Book Club Where Only His Journal Is Assigned Reading",
    "Local Neckass Applies for Space Force, Lists 'Cosmic Swagger' as Primary Skill",
    "BREAKING: Neckass Claims He Discovered a Shortcut to Success—Skipping Everyone Else’s Lines",
    "Neckass Builds DIY Standing Desk from Stacked Pizza Boxes, Calls It Ergonomic Art",
    "Local Neckass Uses VR Headset to Tour His Own Imagination",
    "BREAKING: Neckass Declares He’ll Only Answer Questions in Riddles—Immediately Forgets Them",
    "Neckass Starts Fitness Challenge: Count How Many Compliments He Can Lift Daily",
    "Local Neckass Installs Mirror on Ceiling to ‘Improve Morning Productivity’",
    "BREAKING: Neckass Demands a National Holiday for the Day He First Went Viral in His Head",
    "Neckass Introduces Noise-Canceling Hat to Block Out ‘Mediocre Ideas’",
    "Local Neckass Hosts Meditation Retreat Focused on Manifesting More Neckass",
    "BREAKING: Neckass Designs Smart Toaster That Only Accepts Bread He Approves",
    "Neckass Publishes Map of ‘Places Worth His Presence’—It’s Just His Apartment",
    "Local Neckass Claims He Invented the Weekend by Requesting Two Days Off Once",
    "BREAKING: Neckass Tries Silent Treatment on the Internet, Forgets to Announce It",
    "Neckass Builds Spreadsheet of People Who ‘Need to Thank Him’—Sends Monthly Reminders",
    "Local Neckass Says He’s Off the Grid but Livestreams It",
    "BREAKING: Neckass Drafts Peace Treaty with Mondays, Demands More Sleep as Reparations",
    "Neckass Creates Vision Board Featuring Only Photos of Himself in Different Lighting",
    "Local Neckass Patents High-Five Technique, Issues Cease-and-Desist to Everyone",
    "BREAKING: Neckass Claims He Can Taste Colors, Rates Blue as ‘Overrated’",
    "Neckass Launches Art Exhibit of Unsent Texts, Charges Admission Per Emoji",
    "Local Neckass Develops Productivity System Called ‘Staring at the Wall with Intention’",
    "BREAKING: Neckass Announces Time Management Course with One Tip: Do Things When He Feels Like It",
    "Neckass Builds DIY Drone from Paper Clips, Calls It ‘Aerospace Adjacent’",
    "Local Neckass Declares He’s Fluent in ‘Future’, Refuses to Translate",
    "BREAKING: Neckass Starts Neighborhood Wi-Fi Rating Service, Gives Only His Network Five Stars",
    "Neckass Claims His Aura Is Biodegradable, Encourages Others to Compost Compliments",
    "Local Neckass Attempts to Trademark His Signature Eye Roll",
    "BREAKING: Neckass Applies to Be Ambassador to Mars, Lists ‘Can Do a Mean Moonwalk’ as Experience",
    "Neckass Hosts Networking Event Where Only He Can Talk"
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
        this.intervals = [];
    }

    init() {
        this.applyDarkMode(this.state.darkModeEnabled);
        this.updateHeadlineCounter();
        this.updateNavigationAvailability();
        this.updateMockDate();
        this.applyPassiveGains();
        this.updateProgressionUI();
        this.startAutoPrinter();
        this.startHypeDecay();
        this.bindEvents();
        this.renderInitialHeadline();
    }

    bindEvents() {
        this.elements.nextButton.addEventListener('click', () => this.handleNext());
        this.elements.previousButton.addEventListener('click', () => this.handlePrevious());
        this.elements.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        this.elements.copyButton.addEventListener('click', () => this.copyHeadline());
        this.elements.downloadMockButton?.addEventListener('click', () => this.exportMockFront('download'));
        this.elements.copyMockButton?.addEventListener('click', () => this.exportMockFront('copy'));
        this.elements.upgradePrinterButton?.addEventListener('click', () => this.upgradeAutoPrinter());
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
        this.renderHeadline(previousIndex, { pushToStack: false });
    }

    renderHeadline(index, options = { pushToStack: true }) {
        this.toggleLoader(true);
        this.elements.headline.classList.remove('show');

        setTimeout(() => {
            this.elements.headline.textContent = this.headlines[index];
            this.elements.headline.style.color = selectReadableColor(this.state.darkModeEnabled);
            this.elements.headline.classList.add('show');
            this.toggleLoader(false);

            this.updateViewedState(index, options);
            this.updateSocialShareLinks(this.headlines[index]);
            this.updateMockHeadline(this.headlines[index]);
            if (options.pushToStack) {
                this.grantHeadlineRewards();
            } else {
                this.updateProgressionUI();
            }
        }, ANIMATION_DELAY_MS);
    }

    renderInitialHeadline() {
        if (this.state.navigationStack.length > 0 && isValidHeadlineIndex(this.state.currentIndex, this.headlines.length)) {
            this.renderHeadline(this.state.currentIndex, { pushToStack: false });
            return;
        }

        this.handleNext();
    }

    renderEmptyState() {
        this.elements.headline.textContent = 'No headlines available.';
        this.elements.headline.style.color = '';
        this.updateSocialShareLinks('');
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

    updateSocialShareLinks(headline) {
        const encodedHeadline = encodeURIComponent(headline);
        const pageUrl = encodeURIComponent(window.location.href);

        this.elements.twitterShareLink.href = `https://twitter.com/intent/tweet?text=${encodedHeadline}&url=${pageUrl}&hashtags=Neckass`;
        this.elements.facebookShareLink.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${encodedHeadline}`;
        this.elements.redditShareLink.href = `https://www.reddit.com/submit?url=${pageUrl}&title=${encodedHeadline}`;
    }

    updateHeadlineCounter() {
        this.elements.counter.textContent = this.state.uniqueHeadlines.size;
    }

    updateNavigationAvailability() {
        this.elements.previousButton.disabled = this.state.navigationStack.length <= 1;
    }

    grantHeadlineRewards() {
        const now = Date.now();
        const withinComboWindow = now - this.state.lastInteractionAt <= COMBO_WINDOW_MS;
        this.state.comboCount = withinComboWindow ? this.state.comboCount + 1 : 1;
        this.state.lastInteractionAt = now;

        const comboBonus = 1 + (this.state.comboCount - 1) * COMBO_STEP_BONUS;
        const hypeIncrement = Math.min(HYPE_MAX, this.state.hype + HYPE_STEP + (this.state.comboCount - 1));
        this.state.hype = hypeIncrement;

        const hypeBonus = 1 + (this.state.hype / 100) * HYPE_BONUS_MULTIPLIER;
        const payout = Math.round(BASE_CREDIT_REWARD * comboBonus * hypeBonus);
        this.state.credits += payout;

        this.flashPill();
        this.updateProgressionUI();
        this.persistState();
    }

    updateProgressionUI() {
        if (this.elements.creditBalance) {
            this.elements.creditBalance.textContent = Math.floor(this.state.credits).toLocaleString();
        }

        if (this.elements.comboCount) {
            this.elements.comboCount.textContent = `x${this.state.comboCount}`;
        }

        if (this.elements.hypeBonus) {
            const hypeBonusPercent = Math.round((this.state.hype / 100) * HYPE_BONUS_MULTIPLIER * 100);
            this.elements.hypeBonus.textContent = `+${hypeBonusPercent}%`;
        }

        if (this.elements.hypeFill) {
            this.elements.hypeFill.style.width = `${Math.min(this.state.hype, HYPE_MAX)}%`;
        }

        if (this.elements.hypePercent) {
            this.elements.hypePercent.textContent = `${Math.round(Math.min(this.state.hype, HYPE_MAX))}%`;
            this.elements.hypeMeter?.setAttribute('aria-valuenow', `${Math.round(Math.min(this.state.hype, HYPE_MAX))}`);
        }

        const autoRate = this.getAutoPrinterRate();
        if (this.elements.printerRate) {
            this.elements.printerRate.textContent = `${autoRate.toFixed(1)}/s`;
        }

        if (this.elements.printerLevel) {
            this.elements.printerLevel.textContent = `Lv. ${this.state.autoPrinterLevel}`;
        }

        if (this.elements.upgradeCost) {
            this.elements.upgradeCost.textContent = this.getUpgradeCost().toLocaleString();
        }
    }

    flashPill() {
        if (!this.elements.creditsPill) return;
        this.elements.creditsPill.classList.remove('pulse');
        void this.elements.creditsPill.offsetWidth;
        this.elements.creditsPill.classList.add('pulse');
    }

    applyPassiveGains() {
        const now = Date.now();
        const elapsedSeconds = this.state.lastActiveAt ? Math.max(0, Math.floor((now - this.state.lastActiveAt) / 1000)) : 0;
        const passiveGain = elapsedSeconds * this.getAutoPrinterRate();

        if (passiveGain > 0) {
            this.state.credits += passiveGain;
            if (this.elements.passiveNote) {
                this.elements.passiveNote.textContent = `Banked ${Math.floor(passiveGain)} credits while you were away.`;
            }
        }

        this.state.lastActiveAt = now;
        this.persistState();
    }

    startAutoPrinter() {
        const interval = setInterval(() => this.tickAutoPrinter(), AUTO_TICK_MS);
        this.intervals.push(interval);
    }

    tickAutoPrinter() {
        const gain = this.getAutoPrinterRate();
        this.state.credits += gain;
        this.updateProgressionUI();
        this.persistState();
    }

    startHypeDecay() {
        const interval = setInterval(() => this.decayHype(), HYPE_DECAY_INTERVAL_MS);
        this.intervals.push(interval);
    }

    decayHype() {
        if (this.state.hype <= 0) return;
        this.state.hype = Math.max(0, this.state.hype - HYPE_DECAY_RATE);
        if (Date.now() - this.state.lastInteractionAt > COMBO_WINDOW_MS) {
            this.state.comboCount = 1;
        }
        this.updateProgressionUI();
        this.persistState();
    }

    upgradeAutoPrinter() {
        const cost = this.getUpgradeCost();
        if (this.state.credits < cost) {
            if (this.elements.passiveNote) {
                this.elements.passiveNote.textContent = 'Not enough credits to upgrade yet.';
            }
            return;
        }

        this.state.credits -= cost;
        this.state.autoPrinterLevel += 1;
        this.updateProgressionUI();
        this.persistState();
        if (this.elements.passiveNote) {
            this.elements.passiveNote.textContent = 'Press upgraded! Auto-gains boosted.';
        }
    }

    getAutoPrinterRate() {
        return AUTO_PRINTER_BASE_RATE * this.state.autoPrinterLevel;
    }

    getUpgradeCost() {
        return Math.ceil(AUTO_UPGRADE_BASE_COST * Math.pow(1.35, this.state.autoPrinterLevel - 1));
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
            this.elements.mockFrame,
            this.elements.progression,
            this.elements.autoPrinter
        ].filter(Boolean);

        targetNodes.forEach(node => node.classList.toggle('dark-mode', isEnabled));
        document.querySelectorAll('button').forEach(button => {
            button.classList.toggle('dark-mode', isEnabled);
        });
    }

    copyHeadline() {
        const headlineText = this.elements.headline.innerText;
        const clipboardAvailable = navigator.clipboard && typeof navigator.clipboard.writeText === 'function';

        const reportStatus = (message, isError = false) => {
            if (!this.elements.copyStatus) return;
            this.elements.copyStatus.textContent = message;
            this.elements.copyStatus.classList.toggle('error', isError);
        };

        const handleSuccess = () => reportStatus('Headline copied to clipboard!');
        const handleFailure = (errorMessage) => reportStatus(errorMessage, true);

        const copyWithClipboardAPI = () =>
            navigator.clipboard.writeText(headlineText)
                .then(handleSuccess)
                .catch(() => handleFailure('Unable to access clipboard.'));

        const copyWithFallback = () => {
            const textarea = document.createElement('textarea');
            textarea.value = headlineText;
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

            if (successful) {
                handleSuccess();
            } else {
                handleFailure('Copy failed. Please try again.');
            }
        };

        if (!clipboardAvailable) {
            try {
                copyWithFallback();
            } catch (error) {
                handleFailure('Clipboard unavailable in this browser.');
                this.elements.copyButton.disabled = true;
            }
            return;
        }

        copyWithClipboardAPI();
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
        if (!this.elements.mockDate) return;
        const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        this.elements.mockDate.textContent = formatter.format(new Date());
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
            darkModeEnabled: this.state.darkModeEnabled,
            credits: this.state.credits,
            comboCount: this.state.comboCount,
            hype: this.state.hype,
            autoPrinterLevel: this.state.autoPrinterLevel,
            lastActiveAt: Date.now(),
            lastInteractionAt: this.state.lastInteractionAt
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
        creditBalance: document.getElementById('credit-balance'),
        comboCount: document.getElementById('combo-count'),
        hypeBonus: document.getElementById('hype-bonus'),
        printerRate: document.getElementById('printer-rate'),
        printerLevel: document.getElementById('printer-level'),
        upgradeCost: document.getElementById('upgrade-cost'),
        creditsPill: document.getElementById('credits-pill'),
        hypeFill: document.getElementById('hype-fill'),
        hypePercent: document.getElementById('hype-percent'),
        hypeMeter: document.querySelector('.hype-meter__bar'),
        passiveNote: document.getElementById('passive-note'),
        upgradePrinterButton: document.getElementById('upgrade-printer'),
        progression: document.querySelector('.progression'),
        autoPrinter: document.querySelector('.auto-printer'),
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
            const storedCredits = Number(localStorage.getItem(STORAGE_KEYS.credits));
            const storedCombo = Number(localStorage.getItem(STORAGE_KEYS.combo));
            const storedHype = Number(localStorage.getItem(STORAGE_KEYS.hype));
            const storedPrinterLevel = Number(localStorage.getItem(STORAGE_KEYS.autoPrinterLevel));
            const lastActiveAt = Number(localStorage.getItem(STORAGE_KEYS.lastActiveAt)) || Date.now();
            const lastInteractionAt = Number(localStorage.getItem(STORAGE_KEYS.lastInteractionAt)) || Date.now();

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
                darkModeEnabled,
                credits: Number.isFinite(storedCredits) ? storedCredits : 0,
                comboCount: Number.isFinite(storedCombo) && storedCombo > 0 ? storedCombo : 1,
                hype: Number.isFinite(storedHype) && storedHype > 0 ? Math.min(storedHype, HYPE_MAX) : 0,
                autoPrinterLevel: Number.isFinite(storedPrinterLevel) && storedPrinterLevel > 0 ? storedPrinterLevel : 1,
                lastActiveAt,
                lastInteractionAt
            };
        },

        persist(state) {
            localStorage.setItem(STORAGE_KEYS.viewedCount, state.uniqueHeadlines.size);
            localStorage.setItem(STORAGE_KEYS.viewedList, JSON.stringify(state.navigationStack));
            localStorage.setItem(STORAGE_KEYS.navigationStack, JSON.stringify(state.navigationStack));
            localStorage.setItem(STORAGE_KEYS.navigationStackLegacy, JSON.stringify(state.navigationStack));
            localStorage.setItem(STORAGE_KEYS.uniqueHeadlines, JSON.stringify(Array.from(state.uniqueHeadlines)));
            localStorage.setItem(STORAGE_KEYS.darkMode, String(state.darkModeEnabled));
            localStorage.setItem(STORAGE_KEYS.credits, String(state.credits));
            localStorage.setItem(STORAGE_KEYS.combo, String(state.comboCount));
            localStorage.setItem(STORAGE_KEYS.hype, String(state.hype));
            localStorage.setItem(STORAGE_KEYS.autoPrinterLevel, String(state.autoPrinterLevel));
            localStorage.setItem(STORAGE_KEYS.lastActiveAt, String(state.lastActiveAt));
            localStorage.setItem(STORAGE_KEYS.lastInteractionAt, String(state.lastInteractionAt));
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
