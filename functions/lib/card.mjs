/**
 * The social card's layout, shared by the edge (functions/card.png.js, one
 * card per issue) and scripts/generate-og.ts (the still cards for the
 * entry, the back issues and the standards).
 *
 * A card is read the way a bumper sticker is: at a glance, at about a
 * quarter of its size in a group chat, by someone who has not heard of the
 * paper and did not ask. So it carries only what reads there. Anything that
 * would be set under about 28px comes out, and the date, the motto and the
 * address went that way: the chat prints the link's domain and description
 * under the card. What is left, in order of size: the headline, which is
 * the reason to click; the man it is about, in the file cut, posed for the
 * lead as the page poses it; the paper's name; and a block in the rubric
 * (CORRECTION TO FOLLOW, or a landmark's tag).
 *
 * A headline that ends on a short sentence is already built like a sticker:
 * a setup, a full stop, and a turn. The card sets the setup in the text cut
 * and the turn as large as it goes (“He is at home.”). Any other headline
 * is set whole, as large as its lines allow. The still cards keep their
 * decks and name their page where an issue's card has the block.
 *
 * It closes on a heavy rule with a hairline inside it, the display ad's
 * box, in place of the desk: the box is what marks the edge of the card
 * against a chat's white ground, and it costs less room than the desk did.
 *
 * It speaks in the page's two voices: the paper's sentences in Fraunces,
 * the wire's lines in the teletype's monospace, Bitstream Vera Sans Mono,
 * the face Menlo was drawn from.
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
import { CUT_HEIGHT, CUT_WIDTH, cutSrc, PAD } from './cut.mjs';

export const WIDTH = 1200;
export const HEIGHT = 630;

// The page's own tokens: the sheet, the ink, and the rubric, which the page
// keeps for its corrections.
const SHEET = '#e8e5dc';
const INK = '#1c1a19';
const RUBRIC = '#a3311f';

// The headline's column, beside the cut, and the height it has above the
// foot. The set widths are estimates of Fraunces Bold (a mean character, in
// ems), wrapped at nine tenths of the measure.
const MEASURE = 790;
const COLUMN_HEIGHT = 450;
const SETUP_SIZE = 44;
const SETUP_LINE = 50;
const SETUP_WIDTH = 0.5;
const TURN_WIDTH = 0.45;
const HEADLINE_WIDTH = 0.55;

/** Past this a last sentence is a second thought, not a turn. */
const LONGEST_TURN = 27;

const lines = (length, em, size) =>
    Math.ceil((length * em * size) / (MEASURE * 0.9));

/**
 * The headline as a setup and a turn, if it ends on a short sentence of its
 * own: “… since 2019.” / “He is at home.” Otherwise null, and it is set
 * whole. A sentence starts on a capital, so a quote that closes mid-sentence
 * (“really?” to her) does not count as a full stop.
 */
export function headlineTurn(headline) {
    const match = headline.match(/^(.*[.?!]”?)\s+(\p{Lu}[^.?!]*[.?!]”?)$/su);
    if (!match || match[2].length > LONGEST_TURN) return null;
    return { setup: match[1], turn: match[2] };
}

/** The largest size at which the turn's lines clear the setup's. */
export function turnSize({ setup, turn }) {
    const setupHeight =
        lines(setup.length, SETUP_WIDTH, SETUP_SIZE) * SETUP_LINE;
    for (const size of [132, 118, 104, 92]) {
        const height = lines(turn.length, TURN_WIDTH, size) * size;
        if (setupHeight + height <= COLUMN_HEIGHT - 24) return size;
    }
    return 80;
}

/**
 * A whole headline's size. With a deck it takes the sizes the still cards'
 * copy was written to. Without one it takes the largest whose lines stack
 * in the column, 104px down to 64px over the leads' 48 to 105 characters.
 */
export function headlineSize(text, { deck }) {
    const length = text.length;
    if (deck) {
        if (length > 84) return 56;
        if (length > 68) return 64;
        if (length > 44) return 70;
        return 80;
    }
    for (const size of [104, 96, 88, 80, 72]) {
        if (lines(length, HEADLINE_WIDTH, size) * size <= COLUMN_HEIGHT) {
            return size;
        }
    }
    return 64;
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
 * The block on an issue's card, in the rubric, which the page keeps for its
 * corrections and its red-letter issues: a landmark's tag ("He was right"),
 * and on every other day CORRECTION TO FOLLOW, which is true of every lead,
 * since its correction runs the next morning.
 */
export function issueStamp(edition) {
    return (edition?.tag || 'Correction to follow').toUpperCase();
}

/** A headline set whole, and the deck under it if the card keeps one. */
function wholeHeadline(headline, deck) {
    const size = headlineSize(headline, { deck });
    return el(
        'div',
        {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
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
                      fontSize: 28,
                      lineHeight: 1.32,
                      marginTop: 20,
                  },
                  deck,
              )
            : null,
    );
}

/** The setup at the top of the column and the turn under it, in the room. */
function setupAndTurn(parts) {
    const size = turnSize(parts);
    return el(
        'div',
        {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'space-between',
            paddingBottom: 18,
        },
        el(
            'div',
            {
                fontFamily: 'Fraunces Text',
                fontSize: SETUP_SIZE,
                lineHeight: SETUP_LINE / SETUP_SIZE,
            },
            parts.setup,
        ),
        el(
            'div',
            {
                fontFamily: 'Fraunces',
                fontSize: size,
                lineHeight: 0.98,
                letterSpacing: -size / 40,
                textWrap: 'balance',
            },
            parts.turn,
        ),
    );
}

/**
 * @param {{ folio?: string, headline: string, deck?: string, stamp?: string, pose?: object, scene?: string[] }} card
 *   folio: a still card's page, at the foot. deck: the headline's second
 *   beat, set under it; an issue's card leaves it to the link's description
 *   and sets the headline larger. stamp: the block in the rubric at the
 *   foot, in place of the folio. pose: an entry of data/poses.js; the house
 *   pose if none. scene: keys of data/scenes.js the cut is drawn among; none
 *   if none.
 */
export function cardElement({
    folio = '',
    headline,
    deck = '',
    stamp = '',
    pose = POSES.explaining,
    scene = [],
}) {
    const parts = deck ? null : headlineTurn(headline);
    // The cut is set so the man is the same width whatever his pose. Its
    // image carries PAD around him for a thrown limb or a prop, and sits
    // flush in the box's corner, so neither crosses the rule.
    const scale = (deck ? 190 : 250) / CUT_WIDTH;
    const cutWidth = Math.round((CUT_WIDTH + PAD.left + PAD.right) * scale);
    const cutHeight = Math.round((CUT_HEIGHT + PAD.top + PAD.bottom) * scale);
    const wire = { fontFamily: 'Wire', fontSize: 30 };
    return el(
        'div',
        {
            display: 'flex',
            width: WIDTH,
            height: HEIGHT,
            background: SHEET,
            padding: 14,
            color: INK,
        },
        el(
            'div',
            {
                display: 'flex',
                flex: 1,
                border: `6px solid ${INK}`,
                padding: 5,
            },
            el(
                'div',
                {
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    border: `2px solid ${INK}`,
                    padding: '26px 30px 20px',
                },
                el(
                    'div',
                    { display: 'flex', flex: 1, maxWidth: MEASURE },
                    parts ? setupAndTurn(parts) : wholeHeadline(headline, deck),
                ),
                // The foot: the paper, and what it stamped on this one. The
                // block sits against the name so it stays clear of whatever
                // the cut is drawn among.
                el(
                    'div',
                    { display: 'flex', alignItems: 'center' },
                    el(
                        'span',
                        {
                            fontFamily: 'Fraunces',
                            fontSize: 40,
                            letterSpacing: -1,
                            marginRight: 28,
                        },
                        'The Gazette',
                    ),
                    stamp
                        ? el(
                              'span',
                              {
                                  ...wire,
                                  background: RUBRIC,
                                  color: SHEET,
                                  padding: '6px 14px',
                              },
                              stamp,
                          )
                        : el('span', wire, folio),
                ),
                el(
                    'div',
                    {
                        display: 'flex',
                        position: 'absolute',
                        right: 0,
                        bottom: 4,
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
        ),
    );
}
