import sinon from 'sinon';
import { LicenseInfo } from '@mui/x-license';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingDataGrid } from '@mui/x-data-grid';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingDataGridPro } from '@mui/x-data-grid-pro';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingTreeView } from '@mui/x-tree-view';
import { clearWarningsCache } from '@mui/x-data-grid/internals';

export function createXMochaHooks(coreMochaHooks = {}) {
  const mochaHooks = {
    beforeAll: [...(coreMochaHooks.beforeAll ?? [])],
    afterAll: [...(coreMochaHooks.afterAll ?? [])],
    beforeEach: [...(coreMochaHooks.beforeEach ?? [])],
    afterEach: [...(coreMochaHooks.afterEach ?? [])],
  };

  mochaHooks.beforeEach.push(function setLicenseKey() {
    // This license key is only valid for use with Material UI SAS's projects
    // See the terms: https://mui.com/r/x-license-eula
    LicenseInfo.setLicenseKey(
      'e43ff101678711136a9b81c18047cb69Tz1NVUktRG9jLEU9MTc0Njc4NzYxODIwMSxTPXByZW1pdW0sTE09c3Vic2NyaXB0aW9uLEtWPTI=',
    );
  });

  mochaHooks.afterEach.push(function resetCleanupTracking() {
    unstable_resetCleanupTrackingDataGrid();
    unstable_resetCleanupTrackingDataGridPro();
    unstable_resetCleanupTrackingTreeView();

    // Restore Sinon default sandbox to avoid memory leak
    // See https://github.com/sinonjs/sinon/issues/1866
    sinon.restore();
  });

  mochaHooks.afterEach.push(clearWarningsCache);

  return mochaHooks;
}
