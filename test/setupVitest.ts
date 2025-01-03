import { beforeAll, vi, afterAll } from 'vitest';
import 'test/utils/addChaiAssertions';
import 'test/utils/setupPickers';
import 'test/utils/licenseRelease';
import { generateTestLicenseKey, setupTestLicenseKey } from 'test/utils/testLicense';
import * as testingLibrary from '@testing-library/dom';
// Core's setupVitest is causing issues with the test setup
// import '@mui/internal-test-utils/setupVitest';

// @ts-ignore
globalThis.vi = vi;

let licenseKey: string = '';

beforeAll(() => {
  licenseKey = generateTestLicenseKey();
});

beforeEach(() => {
  setupTestLicenseKey(licenseKey);
});

// checking if an element is hidden is quite expensive
// this is only done in CI as a fail safe. It can still explicitly be checked
// in the test files which helps documenting what is part of the DOM but hidden
// from assistive technology
const defaultHidden = !process.env.CI;

testingLibrary.configure({
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
