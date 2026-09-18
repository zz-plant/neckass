/**
 * /card.png?issue=YYYY-MM-DD — the day's front page as a social card.
 *
 * Every share of neckass.com used to preview with the same still image
 * whatever the day's lead was. This draws the card on request: the folio
 * line, the cutoff rule, and the lead of the issue asked for (today's, if
 * none is), set in Fraunces on the same newsprint the page is printed on.
 * The middleware points og:image here, so a shared link previews with the
 * headline that is actually running.
 *
 * Rendering is Satori and resvg (via workers-og); no browser. The two static
 * cuts of Fraunces it needs are served from /fonts/ like the rest of the
 * site and fetched through the ASSETS binding once per isolate.
 */

import { ImageResponse } from 'workers-og';
import { issueNumber, parseIssueDate, selectLead } from './lib/issue.mjs';

const WIDTH = 1200;
const HEIGHT = 630;

// The page's own tokens: the desk, the sheet, the ink, the muted ink, and
// the ledger teal that carries the cutoff rule.
const DESK = '#212b28';
const SHEET = '#efeae0';
const INK = '#1c1a19';
const MUTED = '#4e4a42';
const RULE = '#175049';

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
});

// Long leads take a smaller size so a four-line headline still clears the
// deck. The breakpoints follow the character counts in data/formats.js.
function headlineSize(text) {
    const length = text.length;
    if (length > 88) return 52;
    if (length > 64) return 60;
    return 68;
}

function volumeLabel(number) {
    const numerals = [
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
        'X',
    ];
    const volume = Math.floor((number - 1) / 365) + 1;
    return numerals[volume - 1] || String(volume);
}

// Satori takes an element tree; workers-og would also parse an HTML
// string, but its parser splits text at entities and then objects to a
// heading with "two children", so the tree is built directly.
const el = (type, style, ...children) => ({
    type,
    props: { style, children: children.length === 1 ? children[0] : children },
});

export function cardElement({ number, date, lead }) {
    const dateLabel = DATE_FORMAT.format(date).toUpperCase();
    const small = {
        fontFamily: 'Fraunces Text',
        fontSize: 19,
        letterSpacing: 3,
        color: MUTED,
    };
    return el(
        'div',
        {
            display: 'flex',
            width: WIDTH,
            height: HEIGHT,
            background: DESK,
            padding: '36px 40px',
        },
        el(
            'div',
            {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                background: SHEET,
                padding: '40px 56px 36px',
                color: INK,
            },
            // The folio line, closed by the cutoff rule.
            el(
                'div',
                {
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    paddingBottom: 16,
                    borderBottom: `5px solid ${RULE}`,
                },
                el(
                    'div',
                    { display: 'flex', alignItems: 'baseline' },
                    el('span', small, 'CORBIN FALLS'),
                    el(
                        'span',
                        {
                            fontFamily: 'Fraunces',
                            fontSize: 30,
                            marginLeft: 22,
                        },
                        'The Gazette',
                    ),
                ),
                el(
                    'span',
                    small,
                    `${dateLabel} · VOL. ${volumeLabel(number)}, NO. ${number}`,
                ),
            ),
            // The lead.
            el(
                'div',
                {
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'center',
                    padding: '20px 0',
                },
                el(
                    'div',
                    {
                        fontFamily: 'Fraunces',
                        fontSize: headlineSize(lead.headline),
                        lineHeight: 1.1,
                        letterSpacing: -1,
                        maxWidth: 1020,
                    },
                    lead.headline,
                ),
                el(
                    'div',
                    {
                        fontFamily: 'Fraunces Text',
                        fontSize: 27,
                        lineHeight: 1.4,
                        color: MUTED,
                        marginTop: 26,
                        maxWidth: 900,
                    },
                    lead.deck,
                ),
            ),
            // The foot.
            el(
                'div',
                {
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: 14,
                    borderTop: '1.5px solid rgba(28,26,25,0.3)',
                },
                el(
                    'span',
                    { ...small, fontSize: 18 },
                    'THE CORBIN FALLS GAZETTE',
                ),
                el('span', { ...small, fontSize: 18 }, 'NECKASS.COM'),
            ),
        ),
    );
}

let fontsPromise = null;
function loadFonts(env, request) {
    if (fontsPromise) return fontsPromise;
    const fetchFont = async (path) => {
        const url = new URL(path, request.url);
        const response = await env.ASSETS.fetch(url);
        if (!response.ok) throw new Error(`font not served: ${path}`);
        return response.arrayBuffer();
    };
    fontsPromise = Promise.all([
        fetchFont('/fonts/fraunces-72pt-bold.ttf'),
        fetchFont('/fonts/fraunces-9pt-regular.ttf'),
    ])
        .then(([display, text]) => [
            { name: 'Fraunces', data: display, weight: 700, style: 'normal' },
            { name: 'Fraunces Text', data: text, weight: 400, style: 'normal' },
        ])
        .catch((error) => {
            fontsPromise = null;
            throw error;
        });
    return fontsPromise;
}

export async function onRequestGet({ request, env }) {
    const url = new URL(request.url);
    const date = parseIssueDate(url.searchParams.get('issue')) || new Date();
    const number = issueNumber(date);
    const lead = number >= 1 ? selectLead(number) : null;
    if (!lead) return new Response('No such issue', { status: 404 });

    const fonts = await loadFonts(env, request);
    const image = new ImageResponse(cardElement({ number, date, lead }), {
        width: WIDTH,
        height: HEIGHT,
        fonts,
    });
    // The card for a given issue only changes when the copy does. A day is
    // long enough to absorb the crawlers and short enough to pick up an
    // edit.
    image.headers.set('cache-control', 'public, max-age=86400');
    return image;
}
