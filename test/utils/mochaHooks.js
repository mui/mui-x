import * as React from 'react';
import * as ReactTransitionGroup from 'react-transition-group';
import { stub, restore } from 'sinon';
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
  let transitionStub;
  let cssTransitionStub;

  mochaHooks.beforeAll.push(function func() {
    licenseKey = generateTestLicenseKey();

    // eslint-disable-next-line react/prop-types
    function FakeTransition({ children }) {
      return <React.Fragment>{children}</React.Fragment>;
    }

    function FakeCSSTransition(props) {
      // eslint-disable-next-line react/prop-types
      return props.in ? <FakeTransition>{props.children}</FakeTransition> : null;
    }

    transitionStub = stub(ReactTransitionGroup, 'Transition').callsFake(FakeTransition);
    cssTransitionStub = stub(ReactTransitionGroup, 'CSSTransition').callsFake(FakeCSSTransition);
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
    transitionStub.restore();
    cssTransitionStub.restore();
  });

  return mochaHooks;
}
