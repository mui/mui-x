import * as React from 'react';
import { verifyLicense } from './verifyLicense';
import { LicenseInfo } from './licenseInfo';
import {
  showExpiredLicenseError,
  showInvalidLicenseError,
  showNotFoundLicenseError,
} from './licenseErrorMessageUtils';
import { LicenseStatus } from './licenseStatus';

export function useLicenseVerifier(): LicenseStatus {
  return React.useMemo(() => {
    const newLicenseStatus = verifyLicense(LicenseInfo.getReleaseInfo(), LicenseInfo.getKey());
    if (newLicenseStatus === LicenseStatus.Invalid) {
      showInvalidLicenseError();
    } else if (newLicenseStatus === LicenseStatus.NotFound) {
      showNotFoundLicenseError();
    } else if (newLicenseStatus === LicenseStatus.Expired) {
      showExpiredLicenseError();
    }
    return newLicenseStatus;
  }, []);
}
