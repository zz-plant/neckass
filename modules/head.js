(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;

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
            canonicalLinkCache = document.querySelector(
                'link[rel="canonical"]',
            );
            if (!canonicalLinkCache) {
                canonicalLinkCache = document.createElement('link');
                canonicalLinkCache.setAttribute('rel', 'canonical');
                document.head.appendChild(canonicalLinkCache);
            }
        }
        canonicalLinkCache.setAttribute('href', url);
    }

    function updateDocumentMetadata({
        headline,
        index,
        headlinesLength,
        isValidHeadlineIndex,
        getCanonicalUrl,
        claimsIdentity = true,
    }) {
        // The page is a newspaper first. A wire item takes over the document's
        // identity only when the reader put it there — by shuffling, or by
        // arriving at a link that names it. `claimsIdentity` carries that
        // intent from the render call; reading it back off the URL instead
        // would lag a shuffle behind, since the address is written after this
        // runs. On a bare visit the metadata describes the issue, so sharing
        // the homepage shares the paper and not whichever item was showing.
        const issue = Neckass.currentIssue;
        const baseTitle = issue
            ? `Neckass | Digital Gazette · No. ${issue.number}`
            : 'Neckass | Digital Gazette';
        const baseDescription = issue
            ? `The Digital Gazette, No. ${issue.number}, ${issue.dateLabel}. Reporting on the activities of a Neckass.`
            : 'A daily paper reporting on the activities of a Neckass.';
        const hasHeadline =
            claimsIdentity &&
            typeof headline === 'string' &&
            headline.trim().length > 0 &&
            isValidHeadlineIndex(index, headlinesLength);
        const title = hasHeadline
            ? `${headline} | Neckass Digital Gazette`
            : baseTitle;
        const description = hasHeadline ? headline : baseDescription;
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
