/* eslint-env mocha */
import './utils/init';
import '@mui/monorepo/test/utils/setupKarma';
import { unstable_resetCleanupTracking } from '@mui/x-data-grid';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingPro } from '@mui/x-data-grid-pro';

const packagesContext = require.context('../packages', true, /\.test\.tsx$/);
packagesContext.keys().forEach(packagesContext);

afterEach(function afterEach() {
  unstable_resetCleanupTracking();
  unstable_resetCleanupTrackingPro();
});
