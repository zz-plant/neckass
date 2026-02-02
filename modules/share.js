(() => {
    const Neckass = window.Neckass = window.Neckass || {};

    function updateSocialShareLinks(elements, headline, canonicalUrl) {
        const encodedHeadline = encodeURIComponent(headline);
        const encodedUrl = encodeURIComponent(canonicalUrl);
        const combinedText = encodeURIComponent(`${headline} ${canonicalUrl}`.trim());

        if (elements.twitterShareLink) {
            elements.twitterShareLink.href = `https://twitter.com/intent/tweet?text=${encodedHeadline}&url=${encodedUrl}&hashtags=Neckass`;
        }
        if (elements.facebookShareLink) {
            elements.facebookShareLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedHeadline}`;
        }
        if (elements.redditShareLink) {
            elements.redditShareLink.href = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedHeadline}`;
        }
        if (elements.linkedinShareLink) {
            elements.linkedinShareLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        }
        if (elements.threadsShareLink) {
            elements.threadsShareLink.href = `https://www.threads.net/intent/post?text=${combinedText}`;
        }
        if (elements.blueskyShareLink) {
            elements.blueskyShareLink.href = `https://bsky.app/intent/compose?text=${combinedText}`;
        }
    }

    Neckass.updateSocialShareLinks = updateSocialShareLinks;
})();
