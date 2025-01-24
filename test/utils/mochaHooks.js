import { config } from 'react-transition-group';
import { restore } from 'sinon';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingDataGrid } from '@mui/x-data-grid';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingDataGridPro } from '@mui/x-data-grid-pro';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingTreeView } from '@mui/x-tree-view';
import { unstable_cleanupDOM as unstable_cleanupDOMCharts } from '@mui/x-charts/internals';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { generateTestLicenseKey, setupTestLicenseKey } from './testLicense';

export function createXMochaHooks(coreMochaHooks = {}) {
  const mochaHooks = {
    beforeAll: [...(coreMochaHooks.beforeAll ?? [])],
    afterAll: [...(coreMochaHooks.afterAll ?? [])],
    beforeEach: [...(coreMochaHooks.beforeEach ?? [])],
    afterEach: [...(coreMochaHooks.afterEach ?? [])],
  };

  let licenseKey;

  mochaHooks.beforeAll.push(function func() {
    // disable "react-transition-group" transitions
    // https://reactcommunity.org/react-transition-group/testing/
    config.disabled = true;
    licenseKey = generateTestLicenseKey();
  });

  mochaHooks.beforeEach.push(function setupLicenseKey() {
    setupTestLicenseKey(licenseKey);
  });

  mochaHooks.afterEach.push(function resetCleanupTracking() {
    unstable_resetCleanupTrackingDataGrid();
    unstable_resetCleanupTrackingDataGridPro();
    unstable_resetCleanupTrackingTreeView();
    unstable_cleanupDOMCharts();

    // Restore Sinon default sandbox to avoid memory leak
    // See https://github.com/sinonjs/sinon/issues/1866
    restore();
  });

  mochaHooks.afterEach.push(clearWarningsCache);

  mochaHooks.afterAll.push(function restoreTransition() {
    config.disabled = false;
  });

  return mochaHooks;
}
