import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    // the deferred-script bootstrap can take a while on a loaded machine
    timeout: 60_000,
    expect: { timeout: 10_000 },
    retries: process.env.CI ? 2 : 0,
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:8001/',
        headless: true,
    },
    webServer: {
        command: 'python -m http.server 8001 --directory .',
        url: 'http://127.0.0.1:8001/',
        reuseExistingServer: true,
        timeout: 10_000,
    },
});
