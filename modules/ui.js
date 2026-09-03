(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;

    const getById = (id) => document.getElementById(id);
    const getAll = (selector) =>
        Array.from(document.querySelectorAll(selector));

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
            copyStatus: 'copy-status',
            nativeShareButton: 'native-share',
            shareStatus: 'share-status',
            downloadClippingButton: 'download-clipping',
            copyClippingButton: 'copy-clipping',
            exportStatus: 'export-status',
            globalToast: 'global-toast',
            clippingFrame: 'clipping-front',
            clippingHeadline: 'clipping-headline',
            clippingDate: 'clipping-date',
            historyCount: 'history-count',
            headlineList: 'headline-list',
            jumpCopyButton: 'jump-copy',
            jumpShareButton: 'jump-share',
            jumpExportButton: 'jump-export',
        };
        const elements = Object.fromEntries(
            Object.entries(idMap).map(([key, id]) => [key, getById(id)]),
        );

        return {
            ...elements,
            containers: getAll('.container'),
            headlineSection: document.querySelector('.headline-section'),
            controls: document.querySelector('.controls'),
            socialShare: document.querySelector('.social-share'),
            copySection: document.querySelector('.copy-headline'),
            exportSection: document.querySelector('#export-card'),
        };
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
