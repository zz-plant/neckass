/**
 * The social card's layout, shared by the edge (functions/card.png.js, one
 * card per issue) and scripts/generate-og.ts (the still cards for the
 * entry, the back issues and the standards).
 *
 * A card is read at thumbnail size, in a feed or a group chat, beside a
 * dozen others, by someone who has not heard of the paper. So an issue's
 * card carries, in order of size: the headline, which is the reason to
 * click; the man it is about, in the file cut, posed for the lead as the
 * page poses it, so the card is recognisably his at a glance; a stamp in
 * the rubric (CORRECTION TO FOLLOW, or a landmark's tag); who wrote in
 * about it, by the letter's signature ("A friend, $40 down"), which is the
 * story's second beat in four words and changes every day; the paper's
 * name; and, at the foot, what the paper is, in one line. The deck reads
 * at a quarter of the card's size no better than the motto does, so an
 * issue's card leaves it to the link's description, which the chat prints
 * under the card. The still cards keep theirs, set in the ink.
 *
 * It speaks in the page's two voices: the paper's sentences in Fraunces,
 * the wire's lines (the date and number, the motto, the address) in the
 * teletype's monospace, Bitstream Vera Sans Mono, the face Menlo was drawn
 * from. The name closes on the page's thick-and-thin.
 *
 * Satori takes an element tree rather than an HTML string, whose parser
 * splits text at entities and then objects to a heading with "two
 * children", so the tree is built directly. The same renderCardPng serves
 * the edge (functions/card.png.js) and the still cards
 * (scripts/generate-og.ts); the engines are loaded once per runtime by
 * initCardRenderer, from whatever source the runtime can read.
 */

import { initWasm, Resvg } from '@resvg/resvg-wasm';
import satori, { init as satoriInit } from 'satori/wasm';
import initYoga from 'yoga-wasm-web';
import { POSES } from '../../data/poses.js';
import { AP_MONTHS } from '../../modules/issue.js';
import { CUT_HEIGHT, CUT_WIDTH, cutSrc, PAD } from './cut.mjs';

export const WIDTH = 1200;
export const HEIGHT = 630;

// The page's own tokens: the desk, the sheet, the ink, the muted ink, and
// the ledger teal that carries the cutoff rule.
const DESK = '#212b28';
const SHEET = '#e8e5dc';
const INK = '#1c1a19';
const MUTED = '#4e4a42';
const RULE = '#175049';
// The rubric, which the page keeps for its corrections.
const RUBRIC = '#a3311f';

export const MOTTO = 'One man, reported daily since Sept. 29, 2024.';

const WEEKDAYS = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
];

/** "WEDNESDAY, SEPT. 23, 2026 · NO. 725" */
export function issueFolio(date, number) {
    const day = WEEKDAYS[date.getUTCDay()];
    const month = AP_MONTHS[date.getUTCMonth()].toUpperCase();
    return `${day}, ${month} ${date.getUTCDate()}, ${date.getUTCFullYear()} · NO. ${number}`;
}

// Long leads take a smaller size so a four-line headline still clears the
// deck beside the cut. The breakpoints follow the character counts of the
// leads (41 to 105 characters). A card with no deck gives the headline the
// deck's room, and sets it larger: in a group chat the card is shown at a
// quarter of its size, and the headline is what has to read there.
function headlineSize(text, { deck }) {
    const length = text.length;
    if (deck) {
        if (length > 84) return 56;
        if (length > 68) return 64;
        if (length > 44) return 70;
        return 80;
    }
    // Without a deck the size is the largest whose lines, by an estimate
    // of Fraunces Bold's set width (0.55em a character, wrapped at nine
    // tenths of the 760px measure), stack under 320px, the height the
    // headline has above the letters line.
    for (const size of [98, 88, 78, 70, 64, 58]) {
        const lines = Math.ceil((length * 0.55 * size) / (760 * 0.9));
        if (lines * size <= 320) return size;
    }
    return 54;
}

const el = (type, style, ...children) => ({
    type,
    props: { style, children: children.length === 1 ? children[0] : children },
});

// The layout engine (yoga, which satori drives) and the rasterizer
// (resvg) are WebAssembly, and each runtime loads them differently: the
// edge imports the compiled modules, the build script reads the files.
// Either way, once per isolate.
let rendererReady = null;
export function initCardRenderer({ yogaWasm, resvgWasm }) {
    if (!rendererReady) {
        rendererReady = (async () => {
            satoriInit(await initYoga(yogaWasm));
            await initWasm(resvgWasm);
        })().catch((error) => {
            rendererReady = null;
            throw error;
        });
    }
    return rendererReady;
}

/** Render a card element to PNG bytes. */
export async function renderCardPng(element, { width, height, fonts }) {
    const svg = await satori(element, { width, height, fonts });
    return new Resvg(svg, { fitTo: { mode: 'width', value: width } })
        .render()
        .asPng();
}

/**
 * The stamp across an issue's card, in the rubric, which the page keeps for
 * its corrections and its red-letter issues: a landmark's tag ("He was
 * right"), and on every other day CORRECTION TO FOLLOW, which is true of
 * every lead, since its correction runs the next morning.
 */
export function issueStamp(edition) {
    return (edition?.tag || 'Correction to follow').toUpperCase();
}

/**
 * The line an issue's card carries under its headline in place of the
 * deck: who wrote in about it. Every lead carries a letter from the person
 * it happened to, and its signature is the story's second beat in four
 * words ("A friend, $40 down", "His mother, avoidant").
 */
export function lettersLine(lead) {
    const signature = lead?.letter?.signature;
    return signature ? `LETTERS: ${signature.toUpperCase()}` : '';
}

/**
 * @param {{ folio: string, headline: string, deck?: string, stamp?: string, footnote?: string, pose?: object, scene?: string[] }} card
 *   folio: the right of the top line — the issue's date and number, or the
 *   page's name. deck: the headline's second beat, set under it; an
 *   issue's card leaves it to the link's description and sets the
 *   headline larger. stamp: a line struck across the corner in the rubric
 *   (an issue's card: CORRECTION TO FOLLOW, which is true of every lead).
 *   footnote: a wire line under a headline that has no deck. pose: an
 *   entry of data/poses.js; the house pose if none. scene: keys of
 *   data/scenes.js the cut is drawn among; none if none.
 */
export function cardElement({
    folio,
    headline,
    deck = '',
    stamp = '',
    footnote = '',
    pose = POSES.explaining,
    scene = [],
}) {
    const size = headlineSize(headline, { deck });
    // The wire's lines: monospace capitals, as the folio line sets them.
    const wire = {
        fontFamily: 'Wire',
        fontSize: 17,
        letterSpacing: 0.8,
        color: MUTED,
    };
    // The cut is set so the man is 184px wide whatever his pose. Its image
    // carries PAD around him for a thrown limb, and the negative margins
    // give that room back, so he stands where the house pose stands and
    // an arm pointing out reaches into the sheet's margin.
    const scale = (deck ? 184 : 236) / CUT_WIDTH;
    const cutWidth = Math.round((CUT_WIDTH + PAD.left + PAD.right) * scale);
    const cutHeight = Math.round((CUT_HEIGHT + PAD.top + PAD.bottom) * scale);
    return el(
        'div',
        {
            display: 'flex',
            width: WIDTH,
            height: HEIGHT,
            background: DESK,
            padding: '28px 32px',
        },
        el(
            'div',
            {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                position: 'relative',
                background: SHEET,
                padding: '30px 48px 26px',
                color: INK,
            },
            // The nameplate and the folio, closed by the cutoff rule: the
            // page's thick-and-thin, a heavy rule over a hairline.
            el(
                'div',
                {
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    paddingBottom: 14,
                    borderBottom: `5px solid ${RULE}`,
                },
                el(
                    'span',
                    {
                        fontFamily: 'Fraunces',
                        fontSize: 42,
                        letterSpacing: -1.3,
                    },
                    'The Gazette',
                ),
                el('span', wire, folio),
            ),
            el('div', {
                display: 'flex',
                height: 2,
                background: RULE,
                marginTop: 4,
            }),
            // The lead, and the man it is about.
            el(
                'div',
                { display: 'flex', flex: 1, alignItems: 'stretch' },
                el(
                    'div',
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        justifyContent: 'center',
                        padding: '18px 0',
                    },
                    el(
                        'div',
                        {
                            fontFamily: 'Fraunces',
                            fontSize: size,
                            lineHeight: deck ? 1.04 : 1.0,
                            // -0.025em, the page's headline tracking.
                            letterSpacing: -size / 40,
                            textWrap: 'balance',
                        },
                        headline,
                    ),
                    deck
                        ? el(
                              'div',
                              {
                                  fontFamily: 'Fraunces Text',
                                  fontSize: 26,
                                  lineHeight: 1.38,
                                  color: INK,
                                  marginTop: 20,
                                  maxWidth: 820,
                              },
                              deck,
                          )
                        : el(
                              'div',
                              {
                                  ...wire,
                                  fontSize: 21,
                                  color: INK,
                                  marginTop: 26,
                              },
                              footnote,
                          ),
                ),
                el(
                    'div',
                    {
                        display: 'flex',
                        alignItems: 'flex-end',
                        marginLeft: 36 - Math.round(PAD.left * scale),
                        marginRight: -Math.round(PAD.right * scale),
                        paddingBottom: 12,
                    },
                    {
                        type: 'img',
                        props: {
                            src: cutSrc(pose.joints, scene),
                            width: cutWidth,
                            height: cutHeight,
                        },
                    },
                ),
            ),
            // The foot: what the paper is, and where.
            el(
                'div',
                {
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: 12,
                    borderTop: '1.5px solid rgba(28,26,25,0.3)',
                },
                el('span', wire, MOTTO.toUpperCase()),
                el('span', { ...wire, color: INK }, 'NECKASS.COM'),
            ),
            // The stamp, struck across the corner over the cutoff rule
            // the way an editor stamps a proof: a rule inside a rule, in
            // the rubric.
            stamp
                ? el(
                      'div',
                      {
                          display: 'flex',
                          position: 'absolute',
                          top: 70,
                          left: 400,
                          transform: 'rotate(-5deg)',
                          padding: 4,
                          border: `3px solid ${RUBRIC}`,
                          background: SHEET,
                      },
                      el(
                          'div',
                          {
                              display: 'flex',
                              padding: '6px 12px 5px',
                              border: `1.5px solid ${RUBRIC}`,
                              fontFamily: 'Wire',
                              fontSize: 19,
                              letterSpacing: 2,
                              color: RUBRIC,
                          },
                          stamp,
                      ),
                  )
                : null,
        ),
    );
}
