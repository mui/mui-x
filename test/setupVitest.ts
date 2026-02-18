import { beforeAll, beforeEach, afterEach } from 'vitest';
import 'test/utils/addChaiAssertions';
import 'test/utils/licenseRelease';
import { generateTestLicenseKey, setupTestLicenseKey } from 'test/utils/testLicense';
import { config } from 'react-transition-group';
import sinon from 'sinon';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingDataGrid } from '@mui/x-data-grid';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingDataGridPro } from '@mui/x-data-grid-pro';
import { clearWarningsCache } from '@mui/x-internals/warning';
import setupVitest from '@mui/internal-test-utils/setupVitest';
import { configure, isJsdom } from '@mui/internal-test-utils';

(globalThis as any).MUI_TEST_ENV = true;

setupVitest({ emotion: true });

configure({
  // JSDOM logs errors otherwise on `getComputedStyle(element, pseudoElement)` calls.
  computedStyleSupportsPseudoElements: !isJsdom(),
});

let licenseKey: string = '';

beforeAll(async () => {
  licenseKey = generateTestLicenseKey();

  if (!isJsdom()) {
    const { server } = await import('vitest/browser');
    await server.commands.setupCrashHandler();
  }
});

beforeEach(() => {
  clearWarningsCache();
  setupTestLicenseKey(licenseKey);
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
