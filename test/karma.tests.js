/* eslint-env mocha */
import './utils/init';
import '@mui/monorepo/test/utils/setupKarma';
import sinon from 'sinon';
import { unstable_resetCleanupTracking } from '@mui/x-data-grid';
import { unstable_resetCreateSelectorCache } from '@mui/x-data-grid/internals';

const packagesContext = require.context('../packages', true, /\.test\.tsx$/);
packagesContext.keys().forEach(packagesContext);

afterEach(function afterEach() {
  unstable_resetCleanupTracking();
  unstable_resetCreateSelectorCache();

  // Restore Sinon default sandbox to avoid memory leak
  // See https://github.com/sinonjs/sinon/issues/1866
  sinon.restore();
});
