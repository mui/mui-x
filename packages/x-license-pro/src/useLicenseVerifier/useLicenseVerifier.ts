import * as React from 'react';
import { verifyLicense } from '../verifyLicense/verifyLicense';
import { LicenseInfo } from '../utils/licenseInfo';
import {
  showExpiredLicenseError,
  showInvalidLicenseError,
  showNotFoundLicenseError,
} from '../utils/licenseErrorMessageUtils';
import { LicenseStatus } from '../utils/licenseStatus';

let sharedLicenseStatus: LicenseStatus | undefined;

export function useLicenseVerifier(): LicenseStatus {
  return React.useMemo(() => {
    if (sharedLicenseStatus !== undefined) {
      return sharedLicenseStatus;
    }

    const licenseStatus = verifyLicense(LicenseInfo.getReleaseInfo(), LicenseInfo.getKey());

    sharedLicenseStatus = licenseStatus;

    if (licenseStatus === LicenseStatus.Invalid) {
      showInvalidLicenseError();
    } else if (licenseStatus === LicenseStatus.NotFound) {
      showNotFoundLicenseError();
    } else if (licenseStatus === LicenseStatus.Expired) {
      showExpiredLicenseError();
    }

    return licenseStatus;
  }, []);
}
