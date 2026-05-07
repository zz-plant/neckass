(() => {
  const Neckass = window.Neckass = window.Neckass || {};
  class HeadlineController {
    constructor({ app, dependencies = {} }) { this.app = app; this.dependencies = dependencies; }
    handleNext() { return this.app._handleNextCore(); }
    handlePrevious() { return this.app._handlePreviousCore(); }
    renderHeadline(index, options) { return this.app._renderHeadlineCore(index, options); }
    renderInitialHeadline() { return this.app._renderInitialHeadlineCore(); }
    renderEmptyState() { return this.app._renderEmptyStateCore(); }
    handleDirectionalNavigation(event) { return this.app._handleDirectionalNavigationCore(event); }
    handlePopState(event) { return this.app._handlePopStateCore(event); }
    selectHeadline(index) { return this.app._selectHeadlineCore(index); }
  }
  Neckass.HeadlineController = HeadlineController;
})();
