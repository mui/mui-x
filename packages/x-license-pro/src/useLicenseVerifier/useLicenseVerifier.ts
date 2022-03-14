import * as React from 'react';
import { verifyLicense } from '../verifyLicense/verifyLicense';
import { LicenseInfo } from '../utils/licenseInfo';
import {
  showExpiredLicenseError,
  showInvalidLicenseError,
  showNotFoundLicenseError,
} from '../utils/licenseErrorMessageUtils';
import { LicenseStatus } from '../utils/licenseStatus';

const sharedLicenseStatuses: { [key: string]: LicenseStatus | undefined } = {};

export function useLicenseVerifier(): LicenseStatus {
  return React.useMemo(() => {
    const licenseKey = LicenseInfo.getKey();
    if (sharedLicenseStatuses[licenseKey] !== undefined) {
      return sharedLicenseStatuses[licenseKey]!;
    }

    const licenseStatus = verifyLicense(LicenseInfo.getReleaseInfo(), licenseKey);

    sharedLicenseStatuses[licenseKey] = licenseStatus;

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
