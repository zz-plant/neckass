import { HEADLINES } from './data/headlines.js';
import { HeadlineApp } from './modules/app.js';
import { createStorageAdapter } from './modules/storage.js';
import { mapElements } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = new HeadlineApp({
        headlines: HEADLINES,
        elements: mapElements(),
        storage: createStorageAdapter()
    });

    app.init();
});
