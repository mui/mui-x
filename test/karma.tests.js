/* eslint-env mocha */
import '@mui/monorepo/test/utils/setupKarma';

import './utils/init';
import { createXMochaHooks } from './utils/mochaHooks';

const mochaHooks = createXMochaHooks();

beforeEach(function beforeEachHook() {
  mochaHooks.beforeEach.forEach((mochaHook) => {
    mochaHook.call(this);
  });
});

afterEach(function beforeEachHook() {
  mochaHooks.afterEach.forEach((mochaHook) => {
    mochaHook.call(this);
  });
});

const packagesContext = require.context('../packages', true, /\.test\.tsx$/);
packagesContext.keys().forEach(packagesContext);
