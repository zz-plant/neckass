(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;
    const { triggerHapticFeedback } = Neckass;

    /**
     * Transient user feedback: the one status line under the action row, the
     * copied-button flash, and the toast.
     *
     * Mixed into HeadlineApp.prototype by app.js, so `this` is the app
     * instance exactly as it was when these lived in the class body.
     */
    Neckass.statusMethods = {
        reportCopyStatus(message, isError = false) {
            if (!this.elements.itemStatus) return;
            this.elements.itemStatus.textContent = message;
            this.elements.itemStatus.classList.toggle('error', isError);
            if (isError && message) {
                triggerHapticFeedback('error');
            }
            if (!isError && message) {
                this.showToast(message);
            }
        },

        flashCopiedButtonLabel(button) {
            if (!button || button.dataset.copyLabelTimeout === 'active') return;

            const label =
                button.querySelector('span:last-child') ||
                button.querySelector('span');
            const originalLabel = label
                ? label.textContent
                : button.textContent;
            button.dataset.copyLabelTimeout = 'active';

            if (label) {
                label.textContent = 'Copied';
            } else {
                button.textContent = 'Copied';
            }

            window.setTimeout(() => {
                if (label) {
                    label.textContent = originalLabel;
                } else {
                    button.textContent = originalLabel;
                }
                delete button.dataset.copyLabelTimeout;
            }, 1400);
        },

        clearItemStatus() {
            if (!this.elements.itemStatus) return;
            this.elements.itemStatus.textContent = '';
            this.elements.itemStatus.classList.remove('error');
        },

        reportShareStatus(message, isError = false) {
            if (!this.elements.itemStatus) return;
            this.elements.itemStatus.textContent = message;
            this.elements.itemStatus.classList.toggle('error', isError);
            if (isError && message) {
                triggerHapticFeedback('error');
            }
            if (!isError && message) {
                this.showToast(message);
            }
        },

        reportExportStatus(message, isError = false) {
            if (!this.elements.itemStatus) return;
            this.elements.itemStatus.textContent = message;
            this.elements.itemStatus.classList.toggle('error', isError);
            if (isError && message) {
                triggerHapticFeedback('error');
            }
            if (!isError && message) {
                this.showToast(message);
                if (
                    message.includes('Downloaded') ||
                    message.includes('Copied front page')
                ) {
                    triggerHapticFeedback('success');
                }
            }
        },

        showToast(message) {
            if (!this.elements.globalToast || !message) return;
            if (this.toastTimer) {
                window.clearTimeout(this.toastTimer);
            }
            this.elements.globalToast.textContent = message;
            this.elements.globalToast.classList.add('is-visible');
            this.elements.globalToast.setAttribute('aria-hidden', 'false');

            this.toastTimer = window.setTimeout(() => {
                this.elements.globalToast.classList.remove('is-visible');
                this.elements.globalToast.setAttribute('aria-hidden', 'true');
            }, 1800);
        },
    };
})();
