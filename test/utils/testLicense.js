import { LicenseInfo } from '@mui/x-license';
import { TEST_LICENSE_KEY_PREMIUM } from '@mui/x-license/test-keys';

export function setupTestLicenseKey() {
  LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PREMIUM);
}
