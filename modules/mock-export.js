(() => {
    const Neckass = window.Neckass = window.Neckass || {};

    async function exportMockFront({ mode, elements, reportStatus, setButtonLoading }) {
        if (!elements.mockFrame || !window.htmlToImage) {
            const fallbackMessage = mode === 'copy'
                ? 'Export unavailable right now. Try Download mock front page.'
                : 'Export unavailable right now.';
            reportStatus(fallbackMessage, true);
            return;
        }

        reportStatus('Preparing export...');
        const exportButton = mode === 'download' ? elements.downloadMockButton : elements.copyMockButton;
        setButtonLoading(exportButton, true);

        const bounds = elements.mockFrame.getBoundingClientRect();
        const options = {
            pixelRatio: Math.min(3, Math.max(2, (window.devicePixelRatio || 1) * 1.25)),
            backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg')?.trim() || undefined,
            cacheBust: true,
            width: Math.max(1, Math.round(bounds.width)),
            height: Math.max(1, Math.round(bounds.height))
        };

        const downloadImage = async (message) => {
            const dataUrl = await window.htmlToImage.toPng(elements.mockFrame, options);
            const link = document.createElement('a');
            link.download = 'neckass-front-page.png';
            link.href = dataUrl;
            link.click();
            reportStatus(message);
        };

        try {
            if (mode === 'download') {
                await downloadImage('Downloaded front page.');
                return;
            }

            if (!navigator.clipboard || !navigator.clipboard.write) {
                await downloadImage('Clipboard unavailable. Downloaded front page instead.');
                return;
            }

            const blob = await window.htmlToImage.toBlob(elements.mockFrame, options);
            if (!blob) {
                throw new Error('Failed to render image');
            }

            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        [blob.type]: blob
                    })
                ]);
                reportStatus('Copied front page to clipboard.');
            } catch (error) {
                await downloadImage('Clipboard unavailable. Downloaded front page instead.');
            }
        } catch (error) {
            reportStatus('Export failed. Please try again.', true);
        } finally {
            setButtonLoading(exportButton, false);
        }
    }

    Neckass.exportMockFront = exportMockFront;
})();
