import { beforeAll } from 'vitest';
import { LicenseInfo } from '@mui/x-license';
import { TEST_LICENSE_KEY_PREMIUM } from 'test/utils/licenseKeys';

beforeAll(() => {
  LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PREMIUM);
});
