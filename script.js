document.addEventListener('DOMContentLoaded', () => {
    const neckass = window.Neckass || {};
    const {
        data,
        HeadlineApp,
        createStorageAdapter,
        mapElements,
        createAgentInterface,
    } = neckass;

    const fallbackHeadline = data?.HEADLINES?.[0] || 'No items on file.';
    const headlineEl = document.getElementById('headline');
    const clippingHeadlineEl = document.getElementById('clipping-headline');
    const loaderEl = document.getElementById('loader');
    const headlineQuickActionsEl = document.getElementById(
        'headline-quick-actions',
    );

    const showFallback = () => {
        if (headlineEl) {
            headlineEl.textContent = fallbackHeadline;
        }
        if (clippingHeadlineEl) {
            clippingHeadlineEl.textContent = fallbackHeadline;
        }
        if (loaderEl) {
            loaderEl.classList.remove('is-visible');
            loaderEl.setAttribute('aria-hidden', 'true');
        }
    };

    const revealSecondaryIntro = () => {
        if (headlineQuickActionsEl?.hasAttribute('hidden')) {
            headlineQuickActionsEl.removeAttribute('hidden');
        }
    };

    const revealOnFirstInteraction = () => {
        revealSecondaryIntro();
        ['click'].forEach((eventName) => {
            document.removeEventListener(
                eventName,
                revealOnFirstInteraction,
                true,
            );
        });
    };

    ['click'].forEach((eventName) => {
        document.addEventListener(eventName, revealOnFirstInteraction, true);
    });

    if (
        typeof HeadlineApp !== 'function' ||
        typeof createStorageAdapter !== 'function' ||
        typeof mapElements !== 'function'
    ) {
        console.error(
            'Aborting app initialization: One or more core modules are missing or invalid.',
        );
        showFallback();
        return;
    }

    try {
        const app = new HeadlineApp({
            headlines: data?.HEADLINES || [],
            elements: mapElements(),
            storage: createStorageAdapter(),
        });

        app.init();
        neckass.app = app;

        if (typeof createAgentInterface === 'function') {
            neckass.agent = createAgentInterface(app);
        }
    } catch (error) {
        console.error('App init error:', error);
        showFallback();
    }
});
