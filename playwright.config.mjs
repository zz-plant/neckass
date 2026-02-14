import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:8001/',
    headless: true
  },
  webServer: {
    command: 'python -m http.server 8001 --directory .',
    url: 'http://127.0.0.1:8001/',
    reuseExistingServer: true,
    timeout: 10_000
  }
});
