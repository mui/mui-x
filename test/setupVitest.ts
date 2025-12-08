import { beforeAll, beforeEach, afterEach } from 'vitest';
import 'test/utils/addChaiAssertions';
import 'test/utils/licenseRelease';
import { generateTestLicenseKey, setupTestLicenseKey } from 'test/utils/testLicense';
import { configure } from '@mui/internal-test-utils';
import { config } from 'react-transition-group';
import sinon from 'sinon';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingDataGrid } from '@mui/x-data-grid';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingDataGridPro } from '@mui/x-data-grid-pro';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingTreeView } from '@mui/x-tree-view';
import { clearWarningsCache } from '@mui/x-internals/warning';

import '@mui/internal-test-utils/setupVitest';

let licenseKey: string = '';

beforeAll(() => {
  licenseKey = generateTestLicenseKey();
});

beforeEach(() => {
  clearWarningsCache();
  setupTestLicenseKey(licenseKey);
  config.disabled = true;
});

afterEach(() => {
  unstable_resetCleanupTrackingDataGrid();
  unstable_resetCleanupTrackingDataGridPro();
  unstable_resetCleanupTrackingTreeView();

  // Restore Sinon default sandbox to avoid memory leak
  // See https://github.com/sinonjs/sinon/issues/1866
  sinon.restore();
  config.disabled = false;
});

configure({
  emotion: true,
});

if (typeof window !== 'undefined') {
  // Only necessary when in browser mode.
  await import('@mui/internal-test-utils/setupVitestBrowser');
}
