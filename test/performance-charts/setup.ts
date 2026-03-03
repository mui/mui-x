import { beforeAll } from 'vitest';
import { LicenseInfo } from '@mui/x-license';
import { TEST_LICENSE_KEY_PRO } from '@mui/x-license/test-keys';

beforeAll(() => {
  LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PRO);
});
