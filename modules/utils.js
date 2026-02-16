(() => {
    const Neckass = window.Neckass = window.Neckass || {};

    const BRIGHTNESS_THRESHOLD = 130;
    const MIN_CONTRAST_RATIO = 4.5;
    const COLOR_PALETTE = [
    '#6b2f1b', '#7a3b22', '#5f2a44', '#4f356f',
    '#5b3f1f', '#6d2f3e', '#2f4a73', '#66462a',
    '#5b2737', '#3f3a6b', '#734236', '#4a3d2a'
];
    const BASE_BACKGROUND_COLOR = getComputedStyle(document.documentElement)
        .getPropertyValue('--bg')
        ?.trim()
        || '#0e1116';

    function isValidHeadlineIndex(index, totalHeadlines) {
        return Number.isInteger(index) && index >= 0 && index < totalHeadlines;
    }

    function normalizeHeadlineText(text) {
        if (typeof text !== 'string') return '';
        return text.trim();
    }

    function slugifyHeadline(headlineText) {
        if (!headlineText) return '';
        return headlineText
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 60);
    }

    function selectReadableColor() {
        const selectedColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
        const rgb = hexToRgb(selectedColor);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        const background = parseColor(BASE_BACKGROUND_COLOR);

        let adjustedColor = selectedColor;
        if (brightness > BRIGHTNESS_THRESHOLD) {
            adjustedColor = darkenColor(selectedColor, 0.7);
        }

        const adjustedRgb = parseColor(adjustedColor);
        if (adjustedRgb && background) {
            const contrast = contrastRatio(adjustedRgb, background);
            if (contrast < MIN_CONTRAST_RATIO) {
                const improved = boostContrast(adjustedRgb, background);
                return rgbToString(improved);
            }
        }

        return adjustedColor;
    }

function hexToRgb(hex) {
    const numeric = parseInt(hex.replace('#', ''), 16);
    return {
        r: (numeric >> 16) & 255,
        g: (numeric >> 8) & 255,
        b: numeric & 255
    };
}

function darkenColor(hex, factor) {
    const rgb = hexToRgb(hex);
    return `rgb(${Math.floor(rgb.r * factor)}, ${Math.floor(rgb.g * factor)}, ${Math.floor(rgb.b * factor)})`;
}

function parseColor(value) {
    if (!value) return null;
    if (value.startsWith('#')) {
        return hexToRgb(value);
    }
    const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) return null;
    return {
        r: Number.parseInt(match[1], 10),
        g: Number.parseInt(match[2], 10),
        b: Number.parseInt(match[3], 10)
    };
}

function relativeLuminance({ r, g, b }) {
    const normalize = (channel) => {
        const srgb = channel / 255;
        return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
    };
    const rLin = normalize(r);
    const gLin = normalize(g);
    const bLin = normalize(b);
    return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

function contrastRatio(foreground, background) {
    const lum1 = relativeLuminance(foreground);
    const lum2 = relativeLuminance(background);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}

function blendColors(color, target, amount) {
    const blendChannel = (c, t) => Math.round(c + (t - c) * amount);
    return {
        r: blendChannel(color.r, target.r),
        g: blendChannel(color.g, target.g),
        b: blendChannel(color.b, target.b)
    };
}

function boostContrast(color, background) {
    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };
    const whiteContrast = contrastRatio(white, background);
    const blackContrast = contrastRatio(black, background);
    const target = whiteContrast >= blackContrast ? white : black;

    let bestColor = color;
    let bestContrast = contrastRatio(color, background);

    for (let step = 1; step <= 10; step += 1) {
        const candidate = blendColors(color, target, step / 10);
        const candidateContrast = contrastRatio(candidate, background);
        if (candidateContrast > bestContrast) {
            bestContrast = candidateContrast;
            bestColor = candidate;
        }
        if (candidateContrast >= MIN_CONTRAST_RATIO) {
            return candidate;
        }
    }

    return bestColor;
}

function rgbToString({ r, g, b }) {
    return `rgb(${r}, ${g}, ${b})`;
}

function cloneStateSnapshot(value) {
    if (typeof structuredClone === 'function') {
        try {
            return structuredClone(value);
        } catch (error) {
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

    if (window.scheduler && typeof window.scheduler.postTask === 'function') {
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

    const prefersReducedMotion = window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof document.startViewTransition !== 'function') {
        updateDom();
        return;
    }

    document.startViewTransition(() => {
        updateDom();
    });
}

    Neckass.isValidHeadlineIndex = isValidHeadlineIndex;
    Neckass.normalizeHeadlineText = normalizeHeadlineText;
    Neckass.slugifyHeadline = slugifyHeadline;
    Neckass.selectReadableColor = selectReadableColor;
    Neckass.cloneStateSnapshot = cloneStateSnapshot;
    Neckass.scheduleBackgroundTask = scheduleBackgroundTask;
    Neckass.runViewTransition = runViewTransition;
})();
