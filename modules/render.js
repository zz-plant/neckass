/**
 * The front page's sections, from a composed issue, as a list of patches:
 * an element, by selector, and the text, markup or attributes it gets.
 *
 * One renderer, three printers. The edge applies the patches to the page
 * as it serves it (functions/_middleware.js), so the reader, the crawler
 * and the reader without JavaScript all get the day's whole paper. The
 * browser applies the same patches when it has to compose an issue the
 * edge did not (modules/front-page.js), and `bun run standing` applies
 * them to index.html for the standing issue. None of them can drift from
 * the others.
 */

import { SCENES } from '../data/scenes.js';
import { realSourceOf, recentIssues, splitFact } from './issue.js';

export const escapeHtml = (text) =>
    String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

// The folio line is two units, the date and the volume, either side of
// a middot. Each goes in its own span so that where the line has to
// break — a phone — it breaks at the middot rather than leaving "717"
// on a line of its own.
function mastheadHtml(line) {
    const parts = line.split(' · ');
    if (parts.length !== 2) return escapeHtml(line);
    return `<span>${escapeHtml(parts[0])}</span><span class="masthead__sep"> · </span><span>${escapeHtml(parts[1])}</span>`;
}

// An ad opens on its keyword (FOR SALE, LOST, CARD OF THANKS), which a
// classifieds page sets apart from the ad; the stylesheet sets it in the
// wire's face.
const AD_KEY = /^([A-Z][A-Z ]*[A-Z]):\s/;

function adHtml(ad) {
    const key = AD_KEY.exec(ad);
    if (!key) return escapeHtml(ad);
    return `<b class="classified__key">${escapeHtml(key[1])}:</b> ${escapeHtml(ad.slice(key[0].length))}`;
}

// The lead's own ad is bought by the person the lead happened to, and is
// set as a display ad, boxed, over the line ads; the rest are line ads.
function adsHtml(ads, leadAd) {
    return ads
        .map((ad) =>
            ad === leadAd
                ? `<li class="classified classified--display">${adHtml(ad)}</li>`
                : `<li class="classified">${adHtml(ad)}</li>`,
        )
        .join('');
}

// The forecast's figures come off the wire as one line. The high and the
// low are set as the box's figures and the rest as the wire line under
// them; the words between are kept, hidden, so the line reads the same.
const FORECAST = /^(High) (-?\d+°), (low) (-?\d+°)\. (.+)$/;

function forecastHtml(line) {
    const parts = FORECAST.exec(line);
    if (!parts) return escapeHtml(line);
    const [, high, highTemp, low, lowTemp, rest] = parts.map(escapeHtml);
    const figure = (label, temp) =>
        `<span class="forecast__figure"><span class="forecast__label">${label}</span> <span class="forecast__temp">${temp}</span></span>`;
    return `<span class="forecast__figures">${figure(high, highTemp)}<span class="forecast__joint">, </span>${figure(low, lowTemp)}<span class="forecast__joint">. </span></span><span class="forecast__wire">${rest}</span>`;
}

const items = (list, render) =>
    list.map((item) => `<li>${render(item)}</li>`).join('');

// The paper's sourcing is usually the joke, so an item that opens on
// something that happened takes a footnote: a mark where the fact ends, so
// the item reads straight through, and the source at the foot of the column.
//
// The column opens on yesterday's lead's follow-up, which is set as a
// story of its own, under a kicker naming the issue it follows; the rest
// run under it as a roundup.
function briefsWithNotes(briefs, yesterday) {
    const notes = [];
    const body = (brief) => {
        const source = realSourceOf(brief);
        if (!source) return escapeHtml(brief);
        const number = notes.length + 1;
        const mark = '*'.repeat(number);
        const [fact, rest] = splitFact(brief);
        notes.push(
            `<p id="brief-note-${number}"><span class="briefs__mark">${mark}</span> That sentence is true: <a href="${escapeHtml(source.url)}">${escapeHtml(source.cite)}</a>.</p>`,
        );
        return `${escapeHtml(fact)}<a class="briefs__mark" href="#brief-note-${number}" aria-label="Footnote ${number}">${mark}</a>${escapeHtml(rest)}`;
    };
    const html = briefs
        .map((brief, at) =>
            at === 0 && yesterday && brief === yesterday.lead?.followUp
                ? `<li class="brief brief--follow" data-follows="No. ${yesterday.number}">${body(brief)}</li>`
                : `<li class="brief">${body(brief)}</li>`,
        )
        .join('');
    return { html, notes: notes.join('') };
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

export function weatherLayers(line) {
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

// The file cut is the rig from assets/cuts/neckass.svg, inlined; each joint
// turns on a custom property. The lead names the pose (data/poses.js) and
// the scene (data/scenes.js), each prop a layer with a switch; the cutline
// and the alt text say what it is. data-pose picks the motion styles.css
// plays once when the page is drawn.
export const JOINTS = {
    tilt: '--tilt',
    lean: '--lean',
    armNear: '--arm-near',
    forearmNear: '--forearm-near',
    handNear: '--hand-near',
    armFar: '--arm-far',
    forearmFar: '--forearm-far',
    handFar: '--hand-far',
    legNear: '--leg-near',
    legFar: '--leg-far',
};

function cutStyle({ pose, scene = [] }) {
    const joints = Object.entries(pose.joints)
        .filter(([joint]) => JOINTS[joint])
        .map(([joint, angle]) => `${JOINTS[joint]}: ${angle}deg`);
    const props = Object.keys(SCENES).map(
        (prop) => `--${prop}: ${scene.includes(prop) ? 1 : 0}`,
    );
    return [...joints, ...props].join('; ');
}

/**
 * The patches that print `issue` on the front page. `today` is today's
 * issue by the press clock; `due` is the issue a reader asked for that has
 * not gone to press, if they did.
 */
export function issueParts(issue, { today, due = null } = {}) {
    const parts = [];
    const put = (selector, patch) => parts.push({ selector, ...patch });

    put('.front-page', { attrs: { 'data-issue': String(issue.number) } });
    put('#masthead-date', { html: mastheadHtml(issue.mastheadLine) });

    // The headline is the issue's permalink: "/" is a different paper
    // tomorrow, and this one is what the reader meant to send.
    put('#lead-link', {
        text: issue.lead.headline,
        attrs: { href: `/?issue=${issue.issueParam}` },
    });
    put('#lead-deck', { text: issue.lead.deck });
    put('#lead-byline', { text: issue.lead.byline });

    put('#cut-figure', {
        attrs: {
            style: cutStyle(issue),
            'data-pose': issue.poseName,
            'aria-label': issue.cutAlt || issue.pose.alt,
        },
    });
    put('#cut-caption', { text: issue.caption });

    // Back issues say so, and offer the way back to today; an issue not
    // yet printed is today's paper with a line saying when it is due.
    const isBackIssue = Boolean(today) && issue.number !== today.number;
    put('#back-issue-notice', {
        attrs: { hidden: isBackIssue || due ? null : '' },
    });
    put('#back-issue-text', {
        text: due
            ? `No. ${due.number} goes to press ${due.dateLabel}. This is today’s issue.`
            : isBackIssue
              ? `You are reading No. ${issue.number}, published ${issue.dateLabel}.`
              : '',
    });
    put('#back-issue-notice a', { attrs: { hidden: due ? '' : null } });

    const { editorial } = issue;
    put('#editorial', { attrs: { hidden: editorial ? null : '' } });
    if (editorial) {
        put('#editorial-head', { text: editorial.head });
        put('#editorial-body', {
            html: editorial.body.map((p) => `<p>${escapeHtml(p)}</p>`).join(''),
        });
        put('#editorial-signature', { text: `— ${editorial.signature}` });
    }

    const earlier = recentIssues(4, issue.date).slice(1);
    const yesterday = earlier[0];

    const briefs = briefsWithNotes(issue.briefs, yesterday);
    put('#briefs-list', { html: briefs.html });
    put('#briefs-notes', {
        html: briefs.notes,
        attrs: { hidden: briefs.notes ? null : '' },
    });

    // The correction that retracts yesterday's lead says which issue it
    // retracts, and links to it, so the reader can read what was wrong.
    put('#corrections-list', {
        html: items(issue.corrections, (correction) =>
            yesterday && correction === yesterday.lead?.correction
                ? `${escapeHtml(correction)} See <a href="/?issue=${yesterday.issueParam}">No. ${yesterday.number}</a>.`
                : escapeHtml(correction),
        ),
    });
    // The first edition has nothing earlier; the way to the archive stays.
    put('#earlier-list', {
        html: earlier.length
            ? items(
                  earlier,
                  (back) =>
                      `<a href="/?issue=${back.issueParam}"><span class="earlier__folio">${escapeHtml(back.dateLabel.split(',')[0])} · No. ${back.number}</span><span class="earlier__head">${escapeHtml(back.lead?.headline || '')}</span></a>`,
              )
            : '<li><a href="/archive"><span class="earlier__head">Back issues</span></a></li>',
    });

    put('#weather-numbers', { html: forecastHtml(issue.weatherNumbers) });
    put('#weather-line', { text: issue.weather });
    put('#weather-cut', {
        attrs: {
            style: Object.entries(weatherLayers(issue.weather))
                .map(([layer, value]) => `--${layer}: ${value}`)
                .join('; '),
        },
    });

    put('#classifieds-list', {
        html: adsHtml(issue.classifieds, issue.lead.classified),
    });
    // A letter opens on a drop cap, unless its first word is one letter:
    // a dropped "I" is read, and copied, run into the word after it.
    put('#letters-list', {
        html: items(issue.letters, (letter) => {
            const initial = /^\S{2}/.test(letter.body)
                ? ' letter-body--initial'
                : '';
            return `<p class="letter-body${initial}">${escapeHtml(letter.body)}</p><p class="letter-signature">— ${escapeHtml(letter.signature)}</p>`;
        }),
    });

    return parts;
}
