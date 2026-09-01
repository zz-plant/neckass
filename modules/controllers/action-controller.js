(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;
    class ActionController {
        constructor({ app, dependencies = {} }) {
            this.app = app;
            this.dependencies = dependencies;
        }
        shareHeadline(triggerButton) {
            return this.app._shareHeadlineCore(triggerButton);
        }
        copyHeadlineLink() {
            return this.app._copyHeadlineLinkCore();
        }
        handleQuickShare() {
            return this.app._handleQuickShareCore();
        }
        handleQuickExport() {
            return this.app._handleQuickExportCore();
        }
        handleMockExport(mode) {
            return this.app._handleMockExportCore(mode);
        }
        copyHeadline(triggerButton) {
            return this.app._copyHeadlineCore(triggerButton);
        }
    }
    Neckass.ActionController = ActionController;
})();
