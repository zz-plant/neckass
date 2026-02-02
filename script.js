document.addEventListener('DOMContentLoaded', () => {
    const { data, HeadlineApp, createStorageAdapter, mapElements } = window.Neckass || {};
    const app = new HeadlineApp({
        headlines: data?.HEADLINES || [],
        elements: mapElements(),
        storage: createStorageAdapter()
    });

    app.init();
});
