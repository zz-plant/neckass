(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;
    const {
        copyTextWithFeedback,
        setButtonLoading,
        isValidHeadlineIndex,
        triggerHapticFeedback,
    } = Neckass;

    /**
     * Per-headline thumbs up/down capture and the exportable log it
     * accumulates in local storage.
     *
     * Mixed into HeadlineApp.prototype by app.js, so `this` is the app
     * instance exactly as it was when these lived in the class body.
     */
    Neckass.feedbackMethods = {
        normalizeFeedbackLog(feedbackLog) {
            if (!Array.isArray(feedbackLog)) return [];

            return feedbackLog
                .filter((entry) => entry && typeof entry === 'object')
                .map((entry) => ({
                    headline:
                        typeof entry.headline === 'string'
                            ? entry.headline.trim()
                            : '',
                    preference: entry.preference === 'up' ? 'up' : 'down',
                    source:
                        entry.source === 'generated' ? 'generated' : 'curated',
                    timestamp:
                        typeof entry.timestamp === 'string'
                            ? entry.timestamp
                            : new Date().toISOString(),
                }))
                .filter((entry) => entry.headline);
        },

        captureHeadlineFeedback(preference) {
            const index = this.state.currentIndex;
            if (!isValidHeadlineIndex(index, this.headlines.length)) {
                this.reportFeedbackStatus(
                    'No headline available to rate.',
                    true,
                );
                return;
            }

            const headline = this.headlines[index];
            const source =
                index >= this.baseHeadlineCount ? 'generated' : 'curated';
            const existingEntryIndex = this.feedbackLog.findIndex(
                (entry) => entry.headline === headline,
            );
            const nextEntry = {
                headline,
                preference: preference === 'up' ? 'up' : 'down',
                source,
                timestamp: new Date().toISOString(),
            };

            if (existingEntryIndex >= 0) {
                this.feedbackLog[existingEntryIndex] = nextEntry;
                this.reportFeedbackStatus(
                    'Updated your rating for this headline.',
                );
            } else {
                this.feedbackLog.push(nextEntry);
                this.reportFeedbackStatus(
                    'Saved your rating for this headline.',
                );
            }
            triggerHapticFeedback('light');

            this.feedbackLog = this.feedbackLog.slice(-300);
            this.state.feedbackLog = this.feedbackLog;
            this.updateFeedbackCount();
            this.persistState();
        },

        async copyFeedbackLog() {
            if (!this.feedbackLog.length) {
                this.reportFeedbackStatus(
                    'Rate a few headlines first, then copy your feedback history.',
                    true,
                );
                return;
            }

            const payload = this.feedbackLog
                .map((entry) =>
                    JSON.stringify({
                        prompt: 'Generate a satirical, absurd news-style headline.',
                        completion: entry.headline,
                        preference: entry.preference,
                        source: entry.source,
                        timestamp: entry.timestamp,
                    }),
                )
                .join('\n');

            await copyTextWithFeedback({
                text: payload,
                button: this.elements.feedbackExportButton,
                successMessage: 'Feedback history copied to clipboard.',
                onStatus: (message, isError) =>
                    this.reportFeedbackStatus(message, isError),
                setButtonLoading,
            });
        },

        updateFeedbackCount() {
            if (!this.elements.feedbackCount) return;
            this.elements.feedbackCount.textContent = String(
                this.feedbackLog.length,
            );
        },

        reportFeedbackStatus(message, isError = false) {
            if (!this.elements.feedbackStatus) return;
            this.elements.feedbackStatus.textContent = message;
            this.elements.feedbackStatus.classList.toggle('error', isError);
            if (!isError && message) {
                this.showToast(message);
            }
        },

        clearFeedbackStatus() {
            if (!this.elements.feedbackStatus) return;
            this.elements.feedbackStatus.textContent = '';
            this.elements.feedbackStatus.classList.remove('error');
        },
    };
})();
