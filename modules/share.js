(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;

    function updateSocialShareLinks(elements, headline, canonicalUrl) {
        const encodedHeadline = encodeURIComponent(headline);
        const encodedUrl = encodeURIComponent(canonicalUrl);

        if (elements.twitterShareLink) {
            elements.twitterShareLink.href = `https://x.com/intent/post?text=${encodedHeadline}&url=${encodedUrl}&hashtags=Neckass`;
        }
        if (elements.facebookShareLink) {
            elements.facebookShareLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedHeadline}`;
        }
        if (elements.redditShareLink) {
            elements.redditShareLink.href = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedHeadline}`;
        }
    }

    Neckass.updateSocialShareLinks = updateSocialShareLinks;
})();
