(() => {
    const Neckass = window.Neckass = window.Neckass || {};

    function canUseClipboardApi() {
        return Boolean(
            window.isSecureContext
            && navigator.clipboard
            && typeof navigator.clipboard.writeText === 'function'
        );
    }

    async function copyTextWithFeedback({ text, button, successMessage, onStatus, setButtonLoading }) {
        setButtonLoading(button, true);
        try {
            if (canUseClipboardApi()) {
                await navigator.clipboard.writeText(text);
                onStatus(successMessage, false);
                return;
            }

            const success = copyWithFallback(text);
            if (success) {
                onStatus(successMessage, false);
            } else {
                onStatus('Copy failed. Please try again.', true);
            }
        } catch (error) {
            try {
                const success = copyWithFallback(text);
                if (success) {
                    onStatus(successMessage, false);
                } else {
                    onStatus('Clipboard unavailable in this browser.', true);
                }
            } catch (fallbackError) {
                onStatus('Clipboard unavailable in this browser.', true);
            }
        } finally {
            setButtonLoading(button, false);
        }
    }

    function copyWithFallback(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);

        const selection = document.getSelection();
        const selectedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

        textarea.select();
        const successful = document.execCommand('copy');

        if (selectedRange) {
            selection.removeAllRanges();
            selection.addRange(selectedRange);
        }

        document.body.removeChild(textarea);
        return successful;
    }

    Neckass.canUseClipboardApi = canUseClipboardApi;
    Neckass.copyTextWithFeedback = copyTextWithFeedback;
})();
