(() => {
    const Neckass = window.Neckass = window.Neckass || {};

    async function exportMockFront({ mode, elements, reportStatus, setButtonLoading }) {
        if (!elements.mockFrame || !window.htmlToImage) {
            const fallbackMessage = mode === 'copy'
                ? 'Export unavailable. Image renderer did not load. Try Download mock front page.'
                : 'Export unavailable. Image renderer did not load.';
            reportStatus(fallbackMessage, true);
            return;
        }

        reportStatus('Rendering front page...');
        const exportButton = mode === 'download' ? elements.downloadMockButton : elements.copyMockButton;
        setButtonLoading(exportButton, true);

        const options = {
            pixelRatio: window.devicePixelRatio || 2,
            backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg')?.trim() || undefined
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
                await downloadImage('Mock front page downloaded.');
                return;
            }

            if (!navigator.clipboard || !navigator.clipboard.write) {
                await downloadImage('Clipboard unavailable, downloaded instead.');
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
                reportStatus('Image copied to clipboard.');
            } catch (error) {
                await downloadImage('Clipboard unavailable, downloaded instead.');
            }
        } catch (error) {
            reportStatus('Export failed. Please try again.', true);
        } finally {
            setButtonLoading(exportButton, false);
        }
    }

    Neckass.exportMockFront = exportMockFront;
})();
