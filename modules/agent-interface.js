(() => {
    const Neckass = window.Neckass = window.Neckass || {};

    function createAgentInterface(app) {
        if (!app) {
            throw new Error('Agent interface requires an app instance.');
        }

        const tools = {
            async get_state() {
                return app.getAgentSnapshot();
            },
            async shuffle() {
                await app.handleNext();
                return app.getAgentSnapshot();
            },
            async previous() {
                app.handlePrevious();
                return app.getAgentSnapshot();
            },
            async generate() {
                await app.handleGenerate();
                return app.getAgentSnapshot();
            },
            async set_filters(args = {}) {
                return app.setFiltersForAgent(args);
            },
            async clear_filters() {
                app.clearAllFilters();
                return app.getAgentSnapshot();
            },
            async select_headline(args = {}) {
                const snapshot = app.selectHeadlineByIdentifier(args.identifier);
                if (!snapshot) {
                    throw new Error('Headline was not found or did not match active filters.');
                }
                return snapshot;
            },
            async list_headlines(args = {}) {
                return {
                    items: app.listHeadlinesForAgent(args),
                    snapshot: app.getAgentSnapshot()
                };
            }
        };

        return {
            version: '1.0.0',
            listTools() {
                return Object.keys(tools);
            },
            async call(toolName, args = {}) {
                const tool = tools[toolName];
                if (typeof tool !== 'function') {
                    throw new Error(`Unknown tool: ${toolName}`);
                }
                return tool(args);
            }
        };
    }

    Neckass.createAgentInterface = createAgentInterface;
})();
