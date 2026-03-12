(() => {
    const Neckass = window.Neckass = window.Neckass || {};

    const metaTagCache = new Map();
    let canonicalLinkCache = null;

    function getMetaTag(attribute, name) {
        const cacheKey = `${attribute}:${name}`;
        if (metaTagCache.has(cacheKey)) {
            return metaTagCache.get(cacheKey);
        }

        let tag = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attribute, name);
            document.head.appendChild(tag);
        }

        metaTagCache.set(cacheKey, tag);
        return tag;
    }

    function setMetaTag(attribute, name, content) {
        const tag = getMetaTag(attribute, name);
        tag.setAttribute('content', content);
    }

    function setCanonicalLink(url) {
        if (!canonicalLinkCache) {
            canonicalLinkCache = document.querySelector('link[rel="canonical"]');
            if (!canonicalLinkCache) {
                canonicalLinkCache = document.createElement('link');
                canonicalLinkCache.setAttribute('rel', 'canonical');
                document.head.appendChild(canonicalLinkCache);
            }
        }
        canonicalLinkCache.setAttribute('href', url);
    }

    function updateDocumentMetadata({ headline, index, headlinesLength, isValidHeadlineIndex, getCanonicalUrl }) {
        const baseTitle = 'Neckass Headlines';
        const hasHeadline = typeof headline === 'string'
            && headline.trim().length > 0
            && isValidHeadlineIndex(index, headlinesLength);
        const title = hasHeadline ? `${headline} | ${baseTitle}` : baseTitle;
        const description = hasHeadline
            ? headline
            : 'Explore a feed of inventive headlines where every shuffle serves up a fresh take ready to share.';
        const canonicalUrl = getCanonicalUrl(index);

        document.title = title;
        setMetaTag('name', 'description', description);
        setMetaTag('property', 'og:title', title);
        setMetaTag('property', 'og:description', description);
        setMetaTag('property', 'og:url', canonicalUrl);
        setMetaTag('name', 'twitter:title', title);
        setMetaTag('name', 'twitter:description', description);
        setMetaTag('name', 'twitter:url', canonicalUrl);
        setCanonicalLink(canonicalUrl);
    }

    Neckass.setMetaTag = setMetaTag;
    Neckass.setCanonicalLink = setCanonicalLink;
    Neckass.updateDocumentMetadata = updateDocumentMetadata;
})();
