import './licenseRelease';
import './licenseKey';
import { unstable_resetCleanupTracking } from '@mui/x-data-grid';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingPro } from '@mui/x-data-grid-pro';

export * from '@mui/monorepo/test/utils/init';

const mochaHooks = {
  beforeEach: [],
  afterEach: [],
};

mochaHooks.afterEach.push(function resetCleanupTracking() {
  unstable_resetCleanupTracking();
  unstable_resetCleanupTrackingPro();
});

export { mochaHooks };
