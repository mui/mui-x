import 'vitest/browser';

// Custom commands registered in `vitest.shared.mts` under `test.browser.commands`.
declare module 'vitest/browser' {
  interface BrowserCommands {
    deferPrintFont: () => Promise<string>;
    resolvePrintFont: (result: 'loaded' | 'error' | 'cleanup') => Promise<void>;
    resetMousePosition: () => Promise<void>;
    setTouchEmulation: (enabled: boolean) => Promise<void>;
    setupCrashHandler: () => Promise<void>;
  }
}
