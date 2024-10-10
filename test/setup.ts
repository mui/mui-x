import { beforeAll, afterAll, vi } from 'vitest';
import 'test/utils/addChaiAssertions';
import 'test/utils/setupPickers';
import 'test/utils/licenseRelease';
import { generateTestLicenseKey, setupTestLicenseKey } from 'test/utils/testLicense';

// @ts-ignore
globalThis.before = beforeAll;
// @ts-ignore
globalThis.after = afterAll;

// @ts-ignore
globalThis.vi = vi;

const isVitestJsdom = process.env.MUI_JSDOM === 'true';

let licenseKey: string = '';

beforeAll(() => {
  licenseKey = generateTestLicenseKey();
});

beforeEach(() => {
  setupTestLicenseKey(licenseKey);
});

// Only necessary when not in browser mode.
if (isVitestJsdom) {
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
