import sinon from 'sinon';
import { LicenseInfo } from '@mui/x-license-pro';
import { unstable_resetCleanupTracking } from '@mui/x-data-grid';
import { unstable_resetCleanupTracking as unstable_resetCleanupTrackingPro } from '@mui/x-data-grid-pro';

export function createXMochaHooks(coreMochaHooks = {}) {
  const mochaHooks = {
    beforeAll: [...(coreMochaHooks.beforeAll ?? [])],
    afterAll: [...(coreMochaHooks.afterAll ?? [])],
    beforeEach: [...(coreMochaHooks.beforeEach ?? [])],
    afterEach: [...(coreMochaHooks.afterEach ?? [])],
  };

  mochaHooks.beforeEach.push(function setLicenseKey() {
    // This license key is only valid for use with Material UI SAS's projects
    // See the terms: https://mui.com/r/x-license-eula
    LicenseInfo.setLicenseKey(
      'd483a722e0dc68f4d483487da0ccac45Tz1NVUktRG9jLEU9MTcxNTE2MzgwOTMwNyxTPXByZW1pdW0sTE09c3Vic2NyaXB0aW9uLEtWPTI=',
    );
  });

  mochaHooks.afterEach.push(function resetCleanupTracking() {
    unstable_resetCleanupTracking();
    unstable_resetCleanupTrackingPro();

    // Restore Sinon default sandbox to avoid memory leak
    // See https://github.com/sinonjs/sinon/issues/1866
    sinon.restore();
  });

  return mochaHooks;
}
