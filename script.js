const STORAGE_KEYS = {
    viewedCount: 'headlinesViewed',
    viewedList: 'viewedHeadlines',
    navigationStack: 'viewedStack',
    uniqueHeadlines: 'uniqueHeadlines',
    darkMode: 'darkMode'
};

const ANIMATION_DELAY_MS = 500;

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
    "BREAKING: Neckass Declares He Can Fly—Claims It’s ‘Too Dangerous’ to Prove in Public"
];

document.addEventListener('DOMContentLoaded', () => {
    const elements = mapElements();
    const state = restoreState();

    applyDarkMode(state.darkModeEnabled, elements);
    updateHeadlineCounter(elements.counter, state.uniqueHeadlines.size);

    elements.nextButton.addEventListener('click', () => handleNextHeadline(state, elements));
    elements.previousButton.addEventListener('click', () => handlePreviousHeadline(state, elements));
    elements.darkModeToggle.addEventListener('click', () => toggleDarkMode(state, elements));
    elements.copyButton.addEventListener('click', () => copyHeadline(elements));

    displayInitialHeadline(state, elements);
});

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
        container: document.querySelector('.container'),
        headlineSection: document.querySelector('.headline-section'),
        controls: document.querySelector('.controls'),
        socialShare: document.querySelector('.social-share'),
        copySection: document.querySelector('.copy-headline'),
        themeToggleSection: document.querySelector('.theme-toggle')
    };
}

function restoreState() {
    const storedStack = JSON.parse(localStorage.getItem(STORAGE_KEYS.navigationStack) || 'null');
    const viewedListLegacy = JSON.parse(localStorage.getItem(STORAGE_KEYS.viewedList) || '[]');
    const uniqueHeadlinesLegacy = JSON.parse(localStorage.getItem(STORAGE_KEYS.uniqueHeadlines) || 'null');
    const darkModeEnabled = localStorage.getItem(STORAGE_KEYS.darkMode) === 'true';

    const rawStack = Array.isArray(storedStack)
        ? storedStack
        : (Array.isArray(viewedListLegacy) ? viewedListLegacy : []);

    const sanitizedStack = rawStack.filter(index => index >= 0 && index < headlines.length);
    const uniqueHeadlines = new Set(
        Array.isArray(uniqueHeadlinesLegacy) && uniqueHeadlinesLegacy.length > 0
            ? uniqueHeadlinesLegacy.filter(index => index >= 0 && index < headlines.length)
            : sanitizedStack
    );

    return {
        navigationStack: sanitizedStack,
        uniqueHeadlines,
        currentIndex: sanitizedStack[sanitizedStack.length - 1] ?? -1,
        darkModeEnabled
    };
}

function handleNextHeadline(state, elements) {
    const nextIndex = getRandomIndex(state.currentIndex);
    state.currentIndex = nextIndex;
    renderHeadline(nextIndex, state, elements);
}

function handlePreviousHeadline(state, elements) {
    if (state.navigationStack.length <= 1) {
        return;
    }

    const removedIndex = state.navigationStack.pop();
    const stillExists = state.navigationStack.includes(removedIndex);

    if (!stillExists) {
        state.uniqueHeadlines.delete(removedIndex);
    }

    state.currentIndex = state.navigationStack[state.navigationStack.length - 1];
    persistState(state);
    updateHeadlineCounter(elements.counter, state.uniqueHeadlines.size);
    renderHeadline(state.currentIndex, state, elements, { pushToStack: false });
}

function renderHeadline(index, state, elements, options = { pushToStack: true }) {
    showLoader(elements.loader, true);
    elements.headline.classList.remove('show');

    setTimeout(() => {
        elements.headline.textContent = headlines[index];
        elements.headline.style.color = getReadableColor();
        elements.headline.classList.add('show');
        showLoader(elements.loader, false);

        updateViewedState(index, state, elements, options);
        updateSocialShareLinks(headlines[index], elements);
    }, ANIMATION_DELAY_MS);
}

function updateViewedState(index, state, elements, options = { pushToStack: true }) {
    if (options.pushToStack) {
        state.navigationStack.push(index);
    }

    state.uniqueHeadlines.add(index);
    state.currentIndex = index;

    persistState(state);
    updateHeadlineCounter(elements.counter, state.uniqueHeadlines.size);
}

function persistState(state) {
    localStorage.setItem(STORAGE_KEYS.viewedCount, state.uniqueHeadlines.size);
    localStorage.setItem(STORAGE_KEYS.viewedList, JSON.stringify(state.navigationStack));
    localStorage.setItem(STORAGE_KEYS.navigationStack, JSON.stringify(state.navigationStack));
    localStorage.setItem(STORAGE_KEYS.uniqueHeadlines, JSON.stringify(Array.from(state.uniqueHeadlines)));
    localStorage.setItem(STORAGE_KEYS.darkMode, String(state.darkModeEnabled));
}

function getRandomIndex(currentIndex) {
    if (headlines.length <= 1) {
        return 0;
    }

    let randomIndex = Math.floor(Math.random() * headlines.length);
    while (randomIndex === currentIndex) {
        randomIndex = Math.floor(Math.random() * headlines.length);
    }

    return randomIndex;
}

function updateSocialShareLinks(headline, elements) {
    const encodedHeadline = encodeURIComponent(headline);
    const pageUrl = encodeURIComponent(window.location.href);

    elements.twitterShareLink.href = `https://twitter.com/intent/tweet?text=${encodedHeadline}&url=${pageUrl}&hashtags=Neckass`;
    elements.facebookShareLink.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${encodedHeadline}`;
    elements.redditShareLink.href = `https://www.reddit.com/submit?url=${pageUrl}&title=${encodedHeadline}`;
}

function showLoader(loaderElement, shouldShow) {
    loaderElement.style.display = shouldShow ? 'block' : 'none';
    loaderElement.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
}

function updateHeadlineCounter(counterElement, value) {
    counterElement.textContent = value;
}

function getReadableColor() {
    const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#F333FF',
        '#FF33A8', '#FF8F33', '#33FFF5', '#338FFF',
        '#FF33F6', '#FF4500', '#33FFBD', '#FFB533',
        '#FFA833', '#5A5AFF', '#FF33C4', '#FF4444',
        '#44FF88'
    ];

    const selectedColor = colors[Math.floor(Math.random() * colors.length)];
    const brightnessThreshold = 130;
    const rgb = hexToRgb(selectedColor);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

    if (document.body.classList.contains('dark-mode') && brightness > brightnessThreshold) {
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

function toggleDarkMode(state, elements) {
    state.darkModeEnabled = !state.darkModeEnabled;
    applyDarkMode(state.darkModeEnabled, elements);
    persistState(state);
}

function applyDarkMode(isEnabled, elements) {
    const selectorTargets = [
        document.body,
        elements?.container,
        elements?.headlineSection,
        elements?.controls,
        elements?.socialShare,
        elements?.copySection,
        elements?.themeToggleSection,
        elements?.loader
    ].filter(Boolean);

    selectorTargets.forEach(node => node.classList.toggle('dark-mode', isEnabled));

    document.querySelectorAll('button').forEach(button => {
        button.classList.toggle('dark-mode', isEnabled);
    });
}

function copyHeadline(elements) {
    const headlineText = elements.headline.innerText;
    const clipboardAvailable = navigator.clipboard && typeof navigator.clipboard.writeText === 'function';

    const reportStatus = (message, isError = false) => {
        if (elements.copyStatus) {
            elements.copyStatus.textContent = message;
            elements.copyStatus.classList.toggle('error', isError);
        }
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
        const selectedRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

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
            elements.copyButton.disabled = true;
        }
        return;
    }

    copyWithClipboardAPI();
}

function displayInitialHeadline(state, elements) {
    if (state.navigationStack.length > 0) {
        state.currentIndex = state.navigationStack[state.navigationStack.length - 1];
        renderHeadline(state.currentIndex, state, elements, { pushToStack: false });
        return;
    }

    handleNextHeadline(state, elements);
}
