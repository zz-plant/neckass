(function () {
    const SVG_NS = 'http://www.w3.org/2000/svg';

    function cloneWithStyles(node) {
        const clone = node.cloneNode(true);
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
        const cloneWalker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT);

        while (walker.nextNode() && cloneWalker.nextNode()) {
            const source = walker.currentNode;
            const target = cloneWalker.currentNode;
            const computed = window.getComputedStyle(source);
            target.style.cssText = computed.cssText || Array.from(computed)
                .map((property) => `${property}:${computed.getPropertyValue(property)};`)
                .join('');
        }

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
