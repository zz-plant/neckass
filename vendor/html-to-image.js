(function () {
    const SVG_NS = 'http://www.w3.org/2000/svg';

    function copyComputedStyle(source, target) {
        const computed = window.getComputedStyle(source);
        target.style.cssText = computed.cssText || Array.from(computed)
            .map((property) => `${property}:${computed.getPropertyValue(property)};`)
            .join('');
    }

    // cloneNode() cannot copy ::before / ::after, so any decorative rule drawn
    // that way is missing from the export. Re-create them as real absolutely
    // positioned elements carrying the pseudo-element's computed style.
    function inlinePseudoElements(source, target) {
        ['::before', '::after'].forEach((pseudo) => {
            const computed = window.getComputedStyle(source, pseudo);
            const content = computed.getPropertyValue('content');
            if (!content || content === 'none' || content === 'normal') return;

            const element = document.createElement('span');
            element.style.cssText = Array.from(computed)
                .map((property) => `${property}:${computed.getPropertyValue(property)};`)
                .join('');
            // `content` is inert on a real element; render its text instead.
            element.style.removeProperty('content');
            const text = content.replace(/^["'](.*)["']$/, '$1');
            if (text) element.textContent = text;

            if (pseudo === '::before') target.insertBefore(element, target.firstChild);
            else target.appendChild(element);
        });
    }

    function cloneWithStyles(node) {
        const clone = node.cloneNode(true);

        // A TreeWalker starts with currentNode at the root, so the first
        // nextNode() call returns the root's first child and the root itself
        // is never visited. That left the cloned element with none of its own
        // computed style — no padding, no display:grid, no row-gap — so
        // exported cards rendered with their content bunched into the top-left
        // corner of an otherwise blank canvas. Copy the root explicitly.
        copyComputedStyle(node, clone);

        const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
        const cloneWalker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT);

        const pairs = [[node, clone]];
        while (walker.nextNode() && cloneWalker.nextNode()) {
            copyComputedStyle(walker.currentNode, cloneWalker.currentNode);
            pairs.push([walker.currentNode, cloneWalker.currentNode]);
        }

        // Done after the walk so the injected spans are not themselves walked.
        pairs.forEach(([source, target]) => inlinePseudoElements(source, target));

        return clone;
    }

    function nodeToSvg(node, options = {}) {
        const rect = node.getBoundingClientRect();
        const width = options.width || rect.width;
        const height = options.height || rect.height;
        const clonedNode = cloneWithStyles(node);
        clonedNode.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

        const foreignObject = document.createElementNS(SVG_NS, 'foreignObject');
        foreignObject.setAttribute('width', '100%');
        foreignObject.setAttribute('height', '100%');
        foreignObject.appendChild(clonedNode);

        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('xmlns', SVG_NS);
        svg.setAttribute('width', String(width));
        svg.setAttribute('height', String(height));
        svg.appendChild(foreignObject);

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        return { svgString, width, height };
    }

    function svgToDataUrl(svgString) {
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    }

    function renderSvgToCanvas(svgString, width, height, options = {}) {
        return new Promise((resolve, reject) => {
            const pixelRatio = options.pixelRatio || 1;
            const canvas = document.createElement('canvas');
            canvas.width = Math.ceil(width * pixelRatio);
            canvas.height = Math.ceil(height * pixelRatio);
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas unsupported'));
                return;
            }

            if (options.backgroundColor) {
                ctx.fillStyle = options.backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            const img = new Image();
            img.onload = () => {
                ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas);
            };
            img.onerror = (error) => reject(error);
            img.src = svgToDataUrl(svgString);
        });
    }

    function toPng(node, options = {}) {
        const { svgString, width, height } = nodeToSvg(node, options);
        return renderSvgToCanvas(svgString, width, height, options).then((canvas) => canvas.toDataURL('image/png'));
    }

    function toBlob(node, options = {}) {
        const { svgString, width, height } = nodeToSvg(node, options);
        return renderSvgToCanvas(svgString, width, height, options).then((canvas) => new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), 'image/png');
        }));
    }

    window.htmlToImage = {
        toPng,
        toBlob
    };
})();
