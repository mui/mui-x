import '@vitest/browser';

declare module '@vitest/browser/context' {
  interface BrowserCommands {
    /**
     * Playwright's `page.requestGC()` command to request garbage collection.
     * https://playwright.dev/docs/api/class-page#page-request-gc
     * @returns {Promise<void>} A promise that resolves when the garbage collection is requested.
     */
    requestGC: () => Promise<void>;
  }
}
