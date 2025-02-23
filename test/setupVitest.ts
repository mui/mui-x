import { beforeAll, vi, afterAll } from 'vitest';
import 'test/utils/addChaiAssertions';
import 'test/utils/setupPickers';
import 'test/utils/licenseRelease';
import { generateTestLicenseKey, setupTestLicenseKey } from 'test/utils/testLicense';
import { configure } from '@mui/internal-test-utils';
import { config } from 'react-transition-group';

import sinon from 'sinon';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingDataGrid } from '@mui/x-data-grid';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingDataGridPro } from '@mui/x-data-grid-pro';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingTreeView } from '@mui/x-tree-view';
import { unstable_cleanupDOM as unstable_cleanupDOMCharts } from '@mui/x-charts/internals';

// Core's setupVitest is causing issues with the test setup
// import '@mui/internal-test-utils/setupVitest';

// @ts-ignore
globalThis.vi = vi;

// Enable missing act warnings: https://github.com/reactwg/react-18/discussions/102
(globalThis as any).jest = null;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

let licenseKey: string = '';

beforeAll(() => {
  licenseKey = generateTestLicenseKey();
});

beforeEach(() => {
  setupTestLicenseKey(licenseKey);
  config.disabled = true;
});

afterEach(() => {
  unstable_resetCleanupTrackingDataGrid();
  unstable_resetCleanupTrackingDataGridPro();
  unstable_resetCleanupTrackingTreeView();
  unstable_cleanupDOMCharts();

  // Restore Sinon default sandbox to avoid memory leak
  // See https://github.com/sinonjs/sinon/issues/1866
  sinon.restore();
  config.disabled = false;
});

// checking if an element is hidden is quite expensive
// this is only done in CI as a fail safe. It can still explicitly be checked
// in the test files which helps documenting what is part of the DOM but hidden
// from assistive technology
const defaultHidden = !process.env.CI;

configure({
  // JSDOM logs errors otherwise on `getComputedStyle(element, pseudoElement)` calls.
  computedStyleSupportsPseudoElements: false,
  defaultHidden,
});

if (!globalThis.before) {
  (globalThis as any).before = beforeAll;
}
if (!globalThis.after) {
  (globalThis as any).after = afterAll;
}

const isJsdom = typeof window !== 'undefined' && window.navigator.userAgent.includes('jsdom');

// Only necessary when not in browser mode.
if (isJsdom) {
  class Touch {
    instance: any;

    constructor(instance: any) {
      this.instance = instance;
    }

    get identifier() {
      return this.instance.identifier;
    }

    get pageX() {
      return this.instance.pageX;
    }

    get pageY() {
      return this.instance.pageY;
    }

    get clientX() {
      return this.instance.clientX;
    }

    get clientY() {
      return this.instance.clientY;
    }
  }
  // @ts-expect-error
  globalThis.window.Touch = Touch;
}
