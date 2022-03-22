import * as React from 'react';
import { verifyLicense } from '../verifyLicense/verifyLicense';
import { LicenseInfo } from '../utils/licenseInfo';
import {
  showExpiredLicenseError,
  showInvalidLicenseError,
  showNotFoundLicenseError,
} from '../utils/licenseErrorMessageUtils';
import { LicenseStatus } from '../utils/licenseStatus';

export type MuiCommercialPackageName =
  | 'x-data-grid-pro'
  | 'x-data-grid-premium'
  | 'x-date-pickers-pro';

const sharedLicenseStatuses: {
  [packageName in MuiCommercialPackageName]?: { key: string; status: LicenseStatus };
} = {};

export function useLicenseVerifier(
  packageName: MuiCommercialPackageName,
  releaseInfo: string,
): LicenseStatus {
  return React.useMemo(() => {
    const licenseKey = LicenseInfo.getLicenseKey();
    if (licenseKey && sharedLicenseStatuses[packageName]?.key === licenseKey) {
      return sharedLicenseStatuses[packageName]!.status;
    }

    const licenseStatus = verifyLicense(releaseInfo, licenseKey);

    sharedLicenseStatuses[packageName] = { key: licenseStatus, status: licenseStatus };

    if (licenseStatus === LicenseStatus.Invalid) {
      showInvalidLicenseError();
    } else if (licenseStatus === LicenseStatus.NotFound) {
      showNotFoundLicenseError();
    } else if (licenseStatus === LicenseStatus.Expired) {
      showExpiredLicenseError();
    }

    return licenseStatus;
  }, [packageName, releaseInfo]);
}
