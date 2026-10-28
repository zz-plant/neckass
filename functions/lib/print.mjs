/**
 * Prints the front page's patches (modules/render.js) with an
 * HTMLRewriter: the Worker's, as it serves the page, and Bun's, for the
 * standing issue (scripts/standing.ts).
 */

// HTMLRewriter reads a handler's `text` property as a callback, so the
// patch is kept under another name.
class PartWriter {
    constructor(part) {
        this.part = part;
    }

    element(element) {
        const { html, text, attrs = {} } = this.part;
        if (html !== undefined) element.setInnerContent(html, { html: true });
        if (text !== undefined) element.setInnerContent(text);
        for (const [name, value] of Object.entries(attrs)) {
            if (value === null) element.removeAttribute(name);
            else element.setAttribute(name, value);
        }
    }
}

export function printParts(rewriter, parts) {
    for (const part of parts) rewriter.on(part.selector, new PartWriter(part));
    return rewriter;
}
