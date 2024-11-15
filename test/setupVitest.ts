import { beforeAll, vi, it } from 'vitest';
import './utils/addChaiAssertions';
import './utils/setupPickers';
import './utils/licenseRelease';
import { generateTestLicenseKey, setupTestLicenseKey } from './utils/testLicense';
import '@mui/internal-test-utils/setupVitest';

// @ts-ignore
globalThis.vi = vi;

// We override @mui/internal-test-utils/setupVitest `it` as it causes problems for us.
// @ts-ignore
globalThis.it = it;

let licenseKey: string = '';

beforeAll(() => {
  licenseKey = generateTestLicenseKey();
});

beforeEach(() => {
  setupTestLicenseKey(licenseKey);
});
