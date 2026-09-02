(() => {
    window.Neckass = window.Neckass || {};
    const Neckass = window.Neckass;

    async function exportMockFront({
        mode,
        elements,
        reportStatus,
        setButtonLoading,
    }) {
        if (!elements.mockFrame || !window.htmlToImage) {
            const fallbackMessage =
                mode === 'copy'
                    ? 'Export unavailable. Reload, then try Download mock front page.'
                    : 'Export unavailable. Reload and try again.';
            reportStatus(fallbackMessage, true);
            return;
        }

        reportStatus('Preparing export...');
        const exportButton =
            mode === 'download'
                ? elements.downloadMockButton
                : elements.copyMockButton;
        setButtonLoading(exportButton, true);

        const bounds = elements.mockFrame.getBoundingClientRect();
        const options = {
            // html-to-image sizes the canvas by pixelRatio but rasterises the
            // clone at the device ratio, so the old fractional value
            // (dpr * 1.25) drew the artwork at ~0.8 scale inside a full-size
            // canvas, leaving the right edge short. A whole number fixes that.
            // A blank band along the bottom remains: the clone also loses the
            // card's padding and grid row-gap, which neither explicit
            // width/height nor a `style` override restores.
            pixelRatio: Math.min(
                3,
                Math.max(2, Math.round(window.devicePixelRatio || 1)),
            ),
            backgroundColor:
                getComputedStyle(document.body)
                    .getPropertyValue('--bg')
                    ?.trim() || undefined,
            cacheBust: true,
            width: Math.max(1, Math.round(bounds.width)),
            height: Math.max(1, Math.round(bounds.height)),
        };

        const downloadImage = async (message) => {
            const dataUrl = await window.htmlToImage.toPng(
                elements.mockFrame,
                options,
            );
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

            if (!navigator.clipboard?.write) {
                await downloadImage(
                    'Clipboard unavailable. Downloaded front page.',
                );
                return;
            }

            const blob = await window.htmlToImage.toBlob(
                elements.mockFrame,
                options,
            );
            if (!blob) {
                throw new Error('Failed to render image');
            }

            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        [blob.type]: blob,
                    }),
                ]);
                reportStatus('Copied front page to clipboard.');
            } catch {
                await downloadImage(
                    'Clipboard unavailable. Downloaded front page.',
                );
            }
        } catch {
            reportStatus('Export failed. Please try again.', true);
        } finally {
            setButtonLoading(exportButton, false);
        }
    }

    Neckass.exportMockFront = exportMockFront;
})();
