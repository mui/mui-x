import { beforeAll, beforeEach, afterEach } from 'vitest';
import 'test/utils/addChaiAssertions';
import 'test/utils/licenseRelease';
import { config } from 'react-transition-group';
import sinon from 'sinon';
import { clearWarningsCache } from '@mui/x-internals/warning';
import setupVitest from '@mui/internal-test-utils/setupVitest';
import { isJsdom } from '@mui/internal-test-utils/env';
import { LicenseInfo } from '@mui/x-license/utils/licenseInfo';
import { TEST_LICENSE_KEY_PREMIUM } from './utils/licenseKeys';
import { setupCrashHandlerOnce } from './utils/setupCrashHandler';

(globalThis as any).MUI_TEST_ENV = true;

// `setupVitest` forwards its extra options to `configure`, so the options can be passed
// here instead of importing `configure` from the package root. The root re-exports
// `createRenderer` (and with it `react-dom/server`), which the shared setup pulls into
// every browser page, including the projects that never render anything.
setupVitest({
  emotion: true,
  // JSDOM logs errors otherwise on `getComputedStyle(element, pseudoElement)` calls.
  computedStyleSupportsPseudoElements: !isJsdom(),
});

beforeAll(async () => {
  if (!isJsdom()) {
    // Attaches a `page.on('crash')` listener, so it must only happen once per page.
    await setupCrashHandlerOnce();
    // Not a listener: this must run for every file to reset the pointer position.
    const { server } = await import('vitest/browser');
    await server.commands.resetMousePosition();
  }
});

beforeEach(() => {
  clearWarningsCache();
  LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PREMIUM);
  config.disabled = true;
});

afterEach(() => {
  // Restore Sinon default sandbox to avoid memory leak
  // See https://github.com/sinonjs/sinon/issues/1866
  sinon.restore();
  config.disabled = false;
});
