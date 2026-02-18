(() => {
    const Neckass = window.Neckass = window.Neckass || {};

    const METRICS_KEY = 'neckassGrowthMetricsV1';
    const MAX_RECENT_EVENTS = 200;

    function createMetricsTracker() {
        const metrics = loadMetrics();

        function track(eventName, details = {}) {
            if (!eventName) return;
            const timestamp = new Date().toISOString();
            metrics.totals[eventName] = (metrics.totals[eventName] || 0) + 1;
            metrics.recentEvents.push({
                event: eventName,
                timestamp,
                details: sanitizeDetails(details)
            });
            if (metrics.recentEvents.length > MAX_RECENT_EVENTS) {
                metrics.recentEvents = metrics.recentEvents.slice(-MAX_RECENT_EVENTS);
            }
            metrics.lastUpdated = timestamp;
            saveMetrics(metrics);
        }

        function getSummary() {
            return {
                sessions: metrics.totals.session_start || 0,
                shuffles: metrics.totals.shuffle || 0,
                shares: metrics.totals.share_success || 0,
                copies: metrics.totals.copy_success || 0,
                exports: metrics.totals.export_success || 0,
                agentCalls: metrics.totals.agent_call || 0
            };
        }

        function exportSnapshot(context = {}) {
            return {
                generatedAt: new Date().toISOString(),
                totals: { ...metrics.totals },
                recentEvents: [...metrics.recentEvents],
                context: sanitizeDetails(context)
            };
        }

        return {
            track,
            getSummary,
            exportSnapshot
        };
    }

    function loadMetrics() {
        try {
            const parsed = JSON.parse(localStorage.getItem(METRICS_KEY) || '{}');
            return {
                totals: parsed && typeof parsed.totals === 'object' && parsed.totals !== null ? parsed.totals : {},
                recentEvents: Array.isArray(parsed?.recentEvents) ? parsed.recentEvents : [],
                lastUpdated: typeof parsed?.lastUpdated === 'string' ? parsed.lastUpdated : null
            };
        } catch (error) {
            return { totals: {}, recentEvents: [], lastUpdated: null };
        }
    }

    function saveMetrics(metrics) {
        try {
            localStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
        } catch (error) {
            return;
        }
    }

    function sanitizeDetails(details) {
        if (!details || typeof details !== 'object') {
            return {};
        }
        return Object.fromEntries(
            Object.entries(details)
                .filter(([key, value]) => typeof key === 'string' && value !== undefined)
                .map(([key, value]) => {
                    if (typeof value === 'string') {
                        return [key, value.slice(0, 180)];
                    }
                    if (typeof value === 'number' || typeof value === 'boolean') {
                        return [key, value];
                    }
                    return [key, String(value).slice(0, 180)];
                })
        );
    }

    Neckass.createMetricsTracker = createMetricsTracker;
})();
