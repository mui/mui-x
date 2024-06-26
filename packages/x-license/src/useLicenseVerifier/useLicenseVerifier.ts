import * as React from 'react';
import { verifyLicense } from '../verifyLicense/verifyLicense';
import { LicenseInfo } from '../utils/licenseInfo';
import {
  showExpiredAnnualGraceLicenseKeyError,
  showExpiredAnnualLicenseKeyError,
  showInvalidLicenseKeyError,
  showMissingLicenseKeyError,
  showLicenseKeyPlanMismatchError,
  showExpiredPackageVersionError,
  showNotAvailableInInitialProPlanError,
} from '../utils/licenseErrorMessageUtils';
import { LICENSE_STATUS, LicenseStatus } from '../utils/licenseStatus';
import MuiLicenseInfoContext from '../Unstable_LicenseInfoProvider/MuiLicenseInfoContext';
import { MuiCommercialPackageName } from '../utils/commercialPackages';

export const sharedLicenseStatuses: {
  [packageName in MuiCommercialPackageName]?: {
    key: string | undefined;
    licenseVerifier: {
      status: LicenseStatus;
    };
  };
} = {};

export function useLicenseVerifier(
  packageName: MuiCommercialPackageName,
  releaseInfo: string,
): {
  status: LicenseStatus;
} {
  const { key: contextKey } = React.useContext(MuiLicenseInfoContext);
  return React.useMemo(() => {
    const licenseKey = contextKey ?? LicenseInfo.getLicenseKey();

    // Cache the response to not trigger the error twice.
    if (
      sharedLicenseStatuses[packageName] &&
      sharedLicenseStatuses[packageName]!.key === licenseKey
    ) {
      return sharedLicenseStatuses[packageName]!.licenseVerifier;
    }

    const plan = packageName.includes('premium') ? 'Premium' : 'Pro';
    const licenseStatus = verifyLicense({
      releaseInfo,
      licenseKey,
      packageName,
    });

    const fullPackageName = `@mui/${packageName}`;

    if (licenseStatus.status === LICENSE_STATUS.Valid) {
      // Skip
    } else if (licenseStatus.status === LICENSE_STATUS.Invalid) {
      showInvalidLicenseKeyError();
    } else if (licenseStatus.status === LICENSE_STATUS.NotAvailableInInitialProPlan) {
      showNotAvailableInInitialProPlanError();
    } else if (licenseStatus.status === LICENSE_STATUS.OutOfScope) {
      showLicenseKeyPlanMismatchError();
    } else if (licenseStatus.status === LICENSE_STATUS.NotFound) {
      showMissingLicenseKeyError({ plan, packageName: fullPackageName });
    } else if (licenseStatus.status === LICENSE_STATUS.ExpiredAnnualGrace) {
      showExpiredAnnualGraceLicenseKeyError({ plan, ...licenseStatus.meta });
    } else if (licenseStatus.status === LICENSE_STATUS.ExpiredAnnual) {
      showExpiredAnnualLicenseKeyError({ plan, ...licenseStatus.meta });
    } else if (licenseStatus.status === LICENSE_STATUS.ExpiredVersion) {
      showExpiredPackageVersionError({ packageName: fullPackageName });
    } else if (process.env.NODE_ENV !== 'production') {
      throw new Error('missing status handler');
    }

    sharedLicenseStatuses[packageName] = { key: licenseKey, licenseVerifier: licenseStatus };
    return licenseStatus;
  }, [packageName, releaseInfo, contextKey]);
}
