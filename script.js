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

let currentIndex = -1;
let headlinesViewed = 0;
let viewedHeadlines = [];

// Retrieve saved data from localStorage
if (localStorage.getItem('headlinesViewed')) {
    headlinesViewed = parseInt(localStorage.getItem('headlinesViewed'));
    viewedHeadlines = JSON.parse(localStorage.getItem('viewedHeadlines'));
    document.getElementById('counter').textContent = headlinesViewed;
}

const headlineElement = document.getElementById('headline');
const counterElement = document.getElementById('counter');
const loaderElement = document.getElementById('loader');
const twitterShareLink = document.getElementById('twitter-share');
const facebookShareLink = document.getElementById('facebook-share');
const redditShareLink = document.getElementById('reddit-share');

// Function to display a headline
function displayHeadline(index) {
    headlineElement.classList.remove('show');
    loaderElement.style.display = 'block';

    setTimeout(() => {
        headlineElement.textContent = headlines[index];
        headlineElement.classList.add('show');
        loaderElement.style.display = 'none';

        // Change headline color to a random, readable color
        headlineElement.style.color = getRandomColor();

        // Update counter and viewed headlines list
        if (!viewedHeadlines.includes(index)) {
            headlinesViewed++;
            viewedHeadlines.push(index);
            counterElement.textContent = headlinesViewed;

            // Save to localStorage
            localStorage.setItem('headlinesViewed', headlinesViewed);
            localStorage.setItem('viewedHeadlines', JSON.stringify(viewedHeadlines));
        }

        // Update social share links
        updateSocialShareLinks(headlines[index]);
    }, 500);
}

// Function to get a random index
function getRandomIndex() {
    let randomIndex = Math.floor(Math.random() * headlines.length);
    // Ensure we don't repeat the same headline consecutively
    while (randomIndex === currentIndex) {
        randomIndex = Math.floor(Math.random() * headlines.length);
    }
    return randomIndex;
}

// Event listeners for buttons
document.getElementById('next-btn').addEventListener('click', () => {
    currentIndex = getRandomIndex();
    displayHeadline(currentIndex);
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (viewedHeadlines.length > 1) {
        // Remove the last viewed headline
        viewedHeadlines.pop();
        // Get the previous headline
        currentIndex = viewedHeadlines[viewedHeadlines.length - 1];
        headlinesViewed--;
        counterElement.textContent = headlinesViewed;

        // Save to localStorage
        localStorage.setItem('headlinesViewed', headlinesViewed);
        localStorage.setItem('viewedHeadlines', JSON.stringify(viewedHeadlines));

        displayHeadline(currentIndex);
    }
});

// Dark mode toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.container').classList.toggle('dark-mode');
    document.querySelectorAll('button').forEach(button => {
        button.classList.toggle('dark-mode');
    });
});

// Function to update social share links
function updateSocialShareLinks(headline) {
    const encodedHeadline = encodeURIComponent(headline);
    const pageUrl = encodeURIComponent(window.location.href);

    // Twitter
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedHeadline}&url=${pageUrl}&hashtags=Neckass`;
    twitterShareLink.href = twitterUrl;

    // Facebook
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${encodedHeadline}`;
    facebookShareLink.href = facebookUrl;

    // Reddit
    const redditUrl = `https://www.reddit.com/submit?url=${pageUrl}&title=${encodedHeadline}`;
    redditShareLink.href = redditUrl;
}

// Function to get a random readable color
function getRandomColor() {
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
    const bigint = parseInt(hex.replace('#', ''), 16);
    return { 
        r: (bigint >> 16) & 255, 
        g: (bigint >> 8) & 255, 
        b: bigint & 255 
    };
}

function darkenColor(hex, factor) {
    const rgb = hexToRgb(hex);
    return `rgb(${Math.floor(rgb.r * factor)}, ${Math.floor(rgb.g * factor)}, ${Math.floor(rgb.b * factor)})`;
}

// Initial headline display
if (viewedHeadlines.length > 0) {
    currentIndex = viewedHeadlines[viewedHeadlines.length - 1];
    displayHeadline(currentIndex);
} else {
    document.getElementById('next-btn').click();
}
