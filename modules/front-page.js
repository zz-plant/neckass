/**
 * The front page ships in the markup as a complete, readable issue, so the
 * site works with no JavaScript and crawlers see the paper rather than an
 * empty shell. This module replaces that standing issue with the one for
 * today's date — or for ?issue=YYYY-MM-DD, if the reader came from the
 * archive.
 */

import {
    composeIssue,
    issueNumber,
    parseIssueDate,
    recentIssues,
} from './issue.js';

function textInto(selector, value) {
    const node = document.querySelector(selector);
    if (node && typeof value === 'string') node.textContent = value;
}

// The folio line is two units, the date and the volume, either side of
// a middot. Each goes in its own span so that where the line has to
// break — a phone — it breaks at the middot rather than leaving "717"
// on a line of its own.
function mastheadInto(selector, line) {
    const node = document.querySelector(selector);
    if (!node || typeof line !== 'string') return;
    const parts = line.split(' · ');
    if (parts.length !== 2) {
        node.textContent = line;
        return;
    }
    const separator = document.createElement('span');
    separator.className = 'masthead__sep';
    separator.textContent = ' · ';
    node.replaceChildren(
        ...parts.flatMap((part, index) => {
            const span = document.createElement('span');
            span.textContent = part;
            return index === 0 ? [span, separator] : [span];
        }),
    );
}

function listInto(selector, items, render) {
    const list = document.querySelector(selector);
    if (!list || !Array.isArray(items) || !items.length) return;
    list.replaceChildren(
        ...items.map((item) => {
            const li = document.createElement('li');
            render(li, item);
            return li;
        }),
    );
}

// The weather cut is one drawing with four switches. The forecast lines in
// WEATHER all open on the sky — "Sunny", "Drizzle", "Fog" — so the first
// word is enough to set them. Anything unrecognised gets sun and cloud,
// which is true of most days here.
const SKIES = {
    sun: ['sunny', 'clear', 'bright', 'hot', 'warm', 'fine'],
    cloud: ['overcast', 'cold', 'grey', 'gray', 'dull'],
    sunCloud: ['mild', 'cool', 'humid', 'unsettled', 'changeable', 'close'],
    rain: ['rain', 'drizzle', 'storms', 'snow', 'showers', 'sleet', 'wet'],
    wind: ['wind', 'windy', 'breezy', 'gusts', 'fog', 'mist', 'haze'],
};

function weatherLayers(line) {
    const word =
        String(line)
            .toLowerCase()
            .match(/[a-z]+/)?.[0] || '';
    const inGroup = (group) => SKIES[group].includes(word);
    if (inGroup('sun')) return { sun: 1, cloud: 0, rain: 0, wind: 0 };
    if (inGroup('cloud')) return { sun: 0, cloud: 1, rain: 0, wind: 0 };
    if (inGroup('rain')) return { sun: 0, cloud: 1, rain: 1, wind: 0 };
    if (inGroup('wind')) return { sun: 0, cloud: 1, rain: 0, wind: 1 };
    return { sun: 1, cloud: 1, rain: 0, wind: 0 };
}

function setWeatherCut(line) {
    const cut = document.getElementById('weather-cut');
    if (!cut || typeof line !== 'string') return;

    for (const [layer, value] of Object.entries(weatherLayers(line))) {
        cut.style.setProperty(`--${layer}`, String(value));
    }
}

// The file cut is the rig from assets/cuts/neckass.svg, inlined; each joint
// turns on a custom property. The lead names the pose (data/poses.js), and
// the cutline and the alt text say what it is.
const JOINTS = {
    tilt: '--tilt',
    armNear: '--arm-near',
    forearmNear: '--forearm-near',
    armFar: '--arm-far',
    forearmFar: '--forearm-far',
    legNear: '--leg-near',
    legFar: '--leg-far',
};

function setCutPose(pose) {
    const cut = document.getElementById('cut-figure');
    if (!cut || !pose) return;

    for (const [joint, angle] of Object.entries(pose.joints)) {
        if (JOINTS[joint]) cut.style.setProperty(JOINTS[joint], `${angle}deg`);
    }
    cut.setAttribute('aria-label', pose.alt);
    textInto('#cut-caption', pose.caption);
}

function renderIssue(issue) {
    if (!issue) return;

    mastheadInto('#masthead-date', issue.mastheadLine);
    document.title = `The Gazette · No. ${issue.number}`;

    if (issue.lead) {
        textInto('#lead-link', issue.lead.headline);
        // The headline is the issue's permalink: "/" is a different
        // paper tomorrow, and this one is what the reader meant to send.
        const link = document.querySelector('#lead-link');
        if (link) link.href = `/?issue=${issue.issueParam}`;
        textInto('#lead-deck', issue.lead.deck);
        textInto('#lead-byline', issue.lead.byline);
    }

    const editorial = document.querySelector('#editorial');
    if (editorial) {
        editorial.hidden = !issue.editorial;
        if (issue.editorial) {
            textInto('#editorial-head', issue.editorial.head);
            const body = document.querySelector('#editorial-body');
            body?.replaceChildren(
                ...issue.editorial.body.map((text) => {
                    const p = document.createElement('p');
                    p.textContent = text;
                    return p;
                }),
            );
            textInto('#editorial-signature', `— ${issue.editorial.signature}`);
        }
    }

    listInto('#briefs-list', issue.briefs, (li, brief) => {
        li.textContent = brief;
    });
    setCutPose(issue.pose);

    // The correction that retracts yesterday's lead says which issue it
    // retracts, and links to it, so the reader can read what was wrong.
    const earlier = recentIssues(4, issue.date).slice(1);
    const yesterday = earlier[0];
    listInto('#corrections-list', issue.corrections, (li, correction) => {
        li.textContent = correction;
        if (yesterday && correction === yesterday.lead?.correction) {
            const link = document.createElement('a');
            link.href = `/?issue=${yesterday.issueParam}`;
            link.textContent = `No. ${yesterday.number}`;
            li.append(' See ', link, '.');
        }
    });

    listInto('#earlier-list', earlier, (li, back) => {
        const link = document.createElement('a');
        link.href = `/?issue=${back.issueParam}`;
        const folio = document.createElement('span');
        folio.className = 'earlier__folio';
        folio.textContent = `${back.dateLabel.split(',')[0]} · No. ${back.number}`;
        const head = document.createElement('span');
        head.className = 'earlier__head';
        head.textContent = back.lead?.headline || '';
        link.append(folio, head);
        li.append(link);
    });

    textInto('#weather-numbers', issue.weatherNumbers);
    textInto('#weather-line', issue.weather);
    setWeatherCut(issue.weather);

    listInto('#classifieds-list', issue.classifieds, (li, ad) => {
        li.textContent = ad;
    });

    listInto('#letters-list', issue.letters, (li, letter) => {
        const body = document.createElement('p');
        body.className = 'letter-body';
        body.textContent = letter.body;
        const signature = document.createElement('p');
        signature.className = 'letter-signature';
        signature.textContent = `— ${letter.signature}`;
        li.append(body, signature);
    });

    // The clipping is the issue's social card, drawn at the edge.
    const clipping = document.querySelector('#colophon-card');
    if (clipping) clipping.href = `/card.png?issue=${issue.issueParam}`;
}

function requestedIssueDate() {
    const requested = new URLSearchParams(window.location.search).get('issue');
    return parseIssueDate(requested);
}

function init() {
    if (!document.querySelector('#lead-headline')) return;

    const today = composeIssue(new Date());
    const requested = requestedIssueDate();
    // A date past today is an issue that has not gone to press. The
    // entry cites a few of those ahead of time; the reader gets today's
    // paper and a line saying when the one they asked for is due.
    const isFuture = requested && issueNumber(requested) > today.number;
    const issue = requested && !isFuture ? composeIssue(requested) : today;
    renderIssue(issue);
    window.Neckass = window.Neckass || {};
    window.Neckass.currentIssue = issue;

    // Back issues say so, and offer the way back to today.
    const banner = document.querySelector('#back-issue-notice');
    if (banner) {
        const isBackIssue = issue.number !== today.number;
        banner.hidden = !(isBackIssue || isFuture);
        if (isFuture) {
            const due = composeIssue(requested);
            textInto(
                '#back-issue-text',
                `No. ${due.number} goes to press ${due.dateLabel}. This is today's issue.`,
            );
            banner.querySelector('a').hidden = true;
        } else if (isBackIssue) {
            textInto(
                '#back-issue-text',
                `You are reading No. ${issue.number}, published ${issue.dateLabel}.`,
            );
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
    init();
}
