(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;

    const getById = (id) => document.getElementById(id);

    function mapElements() {
        const idMap = {
            headline: 'headline',
            loader: 'loader',
            nextButton: 'next-btn',
            previousButton: 'prev-btn',
            mastheadDate: 'masthead-date',
            twitterShareLink: 'twitter-share',
            facebookShareLink: 'facebook-share',
            redditShareLink: 'reddit-share',
            copyButton: 'copy-btn',
            nativeShareButton: 'native-share',
            downloadClippingButton: 'download-clipping',
            copyClippingButton: 'copy-clipping',
            // Copy, share and export all report into the one line under the
            // action row.
            itemStatus: 'item-status',
            globalToast: 'global-toast',
            clippingFrame: 'clipping-front',
            clippingHeadline: 'clipping-headline',
            clippingDate: 'clipping-date',
            historyCount: 'history-count',
            headlineList: 'headline-list',
        };
        const elements = Object.fromEntries(
            Object.entries(idMap).map(([key, id]) => [key, getById(id)]),
        );

        return elements;
    }

    function setButtonLoading(button, shouldShow) {
        if (!button) return;
        button.classList.toggle('is-loading', shouldShow);
        button.disabled = shouldShow;
        button.setAttribute('aria-busy', shouldShow ? 'true' : 'false');
    }

    Neckass.mapElements = mapElements;
    Neckass.setButtonLoading = setButtonLoading;
})();
