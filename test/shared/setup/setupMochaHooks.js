import sinon from 'sinon';

import { generateTestLicenseKey, setupTestLicenseKey } from '../license/testLicense';

export function createSharedMochaHooks(coreMochaHooks = {}) {
  const mochaHooks = {
    beforeAll: [...(coreMochaHooks.beforeAll ?? [])],
    afterAll: [...(coreMochaHooks.afterAll ?? [])],
    beforeEach: [...(coreMochaHooks.beforeEach ?? [])],
    afterEach: [...(coreMochaHooks.afterEach ?? [])],
  };

  let licenseKey;

  mochaHooks.beforeAll.push(function func() {
    licenseKey = generateTestLicenseKey();
  });

  mochaHooks.beforeEach.push(function setupLicenseKey() {
    setupTestLicenseKey(licenseKey);
  });

  mochaHooks.afterEach.push(function resetCleanupTracking() {
    // Restore Sinon default sandbox to avoid memory leak
    // See https://github.com/sinonjs/sinon/issues/1866
    sinon.restore();
  });

  return mochaHooks;
}
