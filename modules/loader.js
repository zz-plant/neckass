(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;
    const { setButtonLoading } = Neckass;

    /**
     * The wire's loading affordances: the loader line, the busy state on the
     * item list, and whether Previous/Next can be pressed.
     *
     * Mixed into HeadlineApp.prototype by app.js, following the same pattern
     * as status.js, so `this` is the app instance exactly as it was when
     * these lived in the class body.
     */
    Neckass.loaderMethods = {
        updateNavigationAvailability() {
            const hasEligible = this.headlines.length > 0;
            this.elements.previousButton.disabled =
                this.state.isLoading || this.state.navigationStack.length <= 1;
            this.elements.nextButton.disabled =
                this.state.isLoading || !hasEligible;
            this.updateNextButtonLabel();
        },

        setNextButtonLabel(label) {
            if (!this.elements.nextButton) {
                return;
            }

            const labelElement =
                this.elements.nextButton.querySelector('.button-label') ||
                this.elements.nextButton.querySelector('span');
            if (labelElement) {
                labelElement.textContent = label;
                return;
            }

            this.elements.nextButton.textContent = label;
        },

        updateNextButtonLabel() {
            if (!this.elements.nextButton || this.state.isLoading) {
                return;
            }
            this.setNextButtonLabel('Next');
        },

        toggleLoader(shouldShow, message = null) {
            if (message && this.elements.loader) {
                this.elements.loader.textContent = message;
            }
            if (this.elements.loader) {
                this.elements.loader.classList.toggle('is-visible', shouldShow);
                this.elements.loader.setAttribute(
                    'aria-hidden',
                    shouldShow ? 'false' : 'true',
                );
            }
            this.setNavigationLoading(shouldShow);
        },

        setNavigationLoading(shouldShow) {
            this.state.isLoading = shouldShow;
            this.updateNavigationAvailability();
            if (this.activeButton) {
                setButtonLoading(this.activeButton, shouldShow);
            }
            if (this.elements.headlineList) {
                this.elements.headlineList.setAttribute(
                    'aria-busy',
                    shouldShow ? 'true' : 'false',
                );
                this.elements.headlineList
                    .querySelectorAll('button[data-index]')
                    .forEach((button) => {
                        button.disabled = shouldShow;
                    });
            }
        },

        updateLoaderMessage(message) {
            if (this.elements.loader) {
                this.elements.loader.textContent = message;
            }
        },
    };
})();
