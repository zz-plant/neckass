(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;

    function isValidHeadlineIndex(index, totalHeadlines) {
        return Number.isInteger(index) && index >= 0 && index < totalHeadlines;
    }

    function normalizeHeadlineText(text) {
        if (typeof text !== 'string') return '';

        return (
            text
                // biome-ignore lint/suspicious/noControlCharactersInRegex: stripping control characters is the intent here
                .replace(/[\u0000-\u001F\u007F]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
        );
    }

    function slugifyHeadline(headlineText) {
        if (!headlineText) return '';
        return headlineText
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 60);
    }

    function safeJsonParse(raw, fallback) {
        try {
            const parsed = JSON.parse(raw);
            return parsed ?? fallback;
        } catch {
            return fallback;
        }
    }

    function cloneStateSnapshot(value) {
        if (typeof structuredClone === 'function') {
            try {
                return structuredClone(value);
            } catch {
                // Fall through to shallow fallback.
            }
        }

        if (Array.isArray(value)) {
            return value.slice();
        }

        if (value && typeof value === 'object') {
            return { ...value };
        }

        return value;
    }

    function scheduleBackgroundTask(task) {
        if (typeof task !== 'function') {
            return;
        }

        if (
            window.scheduler &&
            typeof window.scheduler.postTask === 'function'
        ) {
            window.scheduler.postTask(task, { priority: 'background' });
            return;
        }

        if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(() => task(), { timeout: 180 });
            return;
        }

        window.setTimeout(task, 0);
    }

    function runViewTransition(updateDom) {
        if (typeof updateDom !== 'function') {
            return;
        }

        const prefersReducedMotion = window.matchMedia?.(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        if (
            prefersReducedMotion ||
            typeof document.startViewTransition !== 'function'
        ) {
            updateDom();
            return;
        }

        document.startViewTransition(() => {
            updateDom();
        });
    }

    function triggerHapticFeedback(type = 'light') {
        if (!navigator || typeof navigator.vibrate !== 'function') {
            return false;
        }

        const prefersReducedMotion = window.matchMedia?.(
            '(prefers-reduced-motion: reduce)',
        ).matches;
        if (prefersReducedMotion) {
            return false;
        }

        const patterns = {
            light: 8,
            selection: 10,
            success: [14, 22, 18],
            error: [22, 36, 22],
        };
        const pattern = patterns[type] || patterns.light;

        try {
            return navigator.vibrate(pattern);
        } catch {
            return false;
        }
    }

    Neckass.isValidHeadlineIndex = isValidHeadlineIndex;
    Neckass.normalizeHeadlineText = normalizeHeadlineText;
    Neckass.slugifyHeadline = slugifyHeadline;
    Neckass.safeJsonParse = safeJsonParse;
    Neckass.cloneStateSnapshot = cloneStateSnapshot;
    Neckass.scheduleBackgroundTask = scheduleBackgroundTask;
    Neckass.runViewTransition = runViewTransition;
    Neckass.triggerHapticFeedback = triggerHapticFeedback;
})();
