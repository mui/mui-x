import { beforeAll, beforeEach, afterEach, vi } from 'vitest';
import 'test/utils/addChaiAssertions';
import 'test/utils/licenseRelease';
import { config } from 'react-transition-group';
import sinon from 'sinon';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingDataGrid } from '@mui/x-data-grid';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingDataGridPro } from '@mui/x-data-grid-pro';
import { clearWarningsCache } from '@mui/x-internals/warning';
import setupVitest from '@mui/internal-test-utils/setupVitest';
import { configure, isJsdom } from '@mui/internal-test-utils';
import { LicenseInfo } from '@mui/x-license';
import { TEST_LICENSE_KEY_PREMIUM } from '@mui/x-license/internals';

// Disable React StrictMode in browser tests. StrictMode under React 19
// double-mounts the test tree and double-fires effects, which adds ~25%
// to browser test wallclock. jsdom is much faster and keeps StrictMode
// for catch coverage. Override via vi.mock so every createRenderer call
// site picks it up without any per-file changes.
vi.mock('@mui/internal-test-utils', async (importActual) => {
  const actual: any = await importActual();
  if (actual.isJsdom?.()) {
    return actual;
  }
  return {
    ...actual,
    createRenderer: (options: any = {}) => actual.createRenderer({ strict: false, ...options }),
  };
});

(globalThis as any).MUI_TEST_ENV = true;

// Diagnostics for the intermittent silent worker exits we have been seeing in CI:
// when a Promise rejects or an exception escapes a teardown step, the worker
// bails without printing a useful trace. Surface what actually killed the
// process so the next failing run carries a stack we can act on.
//
// jsdom mode runs in Node (process events), browser mode runs in the page
// (window events) — only one side fires depending on environment, so register
// both with appropriate guards.
if (typeof process !== 'undefined' && typeof process.on === 'function') {
  process.on('unhandledRejection', (reason) => {
    console.error('[setupVitest] (node) unhandledRejection:', reason);
  });
  process.on('uncaughtException', (err) => {
    console.error('[setupVitest] (node) uncaughtException:', err);
  });
}
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[setupVitest] (browser) unhandledrejection:', event.reason);
  });
  window.addEventListener('error', (event) => {
    console.error('[setupVitest] (browser) error:', event.error || event.message);
  });
}

setupVitest({ emotion: true });

configure({
  // JSDOM logs errors otherwise on `getComputedStyle(element, pseudoElement)` calls.
  computedStyleSupportsPseudoElements: !isJsdom(),
});

beforeAll(async () => {
  if (!isJsdom()) {
    const { server } = await import('vitest/browser');
    await server.commands.setupCrashHandler();
  }
});

beforeEach(() => {
  clearWarningsCache();
  LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PREMIUM);
  config.disabled = true;
});

afterEach(() => {
  unstable_resetCleanupTrackingDataGrid();
  unstable_resetCleanupTrackingDataGridPro();

  // Restore Sinon default sandbox to avoid memory leak
  // See https://github.com/sinonjs/sinon/issues/1866
  sinon.restore();
  config.disabled = false;
});
