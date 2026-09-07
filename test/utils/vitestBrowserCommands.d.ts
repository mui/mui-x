import 'vitest/browser';

// Custom commands registered in `vitest.shared.mts` under `test.browser.commands`.
declare module 'vitest/browser' {
  interface BrowserCommands {
    resetMousePosition: () => Promise<void>;
    setupCrashHandler: () => Promise<void>;
  }
}
