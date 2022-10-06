import * as React from 'react';
import { verifyLicense } from '../verifyLicense/verifyLicense';
import { LicenseInfo } from '../utils/licenseInfo';
import {
  showExpiredLicenseError,
  showInvalidLicenseError,
  showNotFoundLicenseError,
  showOutOfScopeLicenseError,
} from '../utils/licenseErrorMessageUtils';
import { LicenseStatus } from '../utils/licenseStatus';
import { LicenseScope } from '../utils/licenseScope';

export type MuiCommercialPackageName =
  | 'x-data-grid-pro'
  | 'x-data-grid-premium'
  | 'x-date-pickers-pro';

export const sharedLicenseStatuses: {
  [packageName in MuiCommercialPackageName]?: { key: string | undefined; status: LicenseStatus };
} = {};

export function useLicenseVerifier(
  packageName: MuiCommercialPackageName,
  releaseInfo: string,
): LicenseStatus {
  return React.useMemo(() => {
    const licenseKey = LicenseInfo.getLicenseKey();
    if (
      sharedLicenseStatuses[packageName] &&
      sharedLicenseStatuses[packageName]!.key === licenseKey
    ) {
      return sharedLicenseStatuses[packageName]!.status;
    }

    const acceptedScopes: LicenseScope[] = packageName.includes('premium')
      ? ['premium']
      : ['pro', 'premium'];

    const plan = packageName.includes('premium') ? 'Premium' : 'Pro';
    const licenseStatus = verifyLicense({
      releaseInfo,
      licenseKey,
      acceptedScopes,
      isProduction: process.env.NODE_ENV === 'production',
    });

    sharedLicenseStatuses[packageName] = { key: licenseKey, status: licenseStatus };

    if (licenseStatus === LicenseStatus.Invalid) {
      showInvalidLicenseError();
    } else if (licenseStatus === LicenseStatus.OutOfScope) {
      showOutOfScopeLicenseError();
    } else if (licenseStatus === LicenseStatus.NotFound) {
      showNotFoundLicenseError({ plan, packageName: `@mui/${packageName}` });
    } else if (licenseStatus === LicenseStatus.Expired) {
      showExpiredLicenseError();
    }

    return licenseStatus;
  }, [packageName, releaseInfo]);
}
