(() => {
    const Neckass = window.Neckass = window.Neckass || {};

    function setMetaTag(attribute, name, content) {
        let tag = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attribute, name);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    }

    function setCanonicalLink(url) {
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', url);
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
