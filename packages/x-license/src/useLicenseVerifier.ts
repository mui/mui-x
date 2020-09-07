import * as React from 'react';
import { verifyLicense } from './verifyLicense';
import { LicenseInfo } from './licenseInfo';
import {
  showExpiredLicenseError,
  showInvalidLicenseError,
  showNotFoundLicenseError,
} from './licenseErrorMessageUtils';
import { LicenseStatus } from './licenseStatus';

export function useLicenseVerifier() {
  const [licenseStatus, setLicenseStatus] = React.useState(LicenseStatus.Invalid);

  React.useEffect(() => {
    const newLicenseStatus = verifyLicense(LicenseInfo.releaseInfo, LicenseInfo.key);
    setLicenseStatus(newLicenseStatus);
    if (newLicenseStatus === LicenseStatus.Invalid) {
      showInvalidLicenseError();
    } else if (newLicenseStatus === LicenseStatus.NotFound) {
      showNotFoundLicenseError();
    } else if (newLicenseStatus === LicenseStatus.Expired) {
      showExpiredLicenseError();
    }
  }, [setLicenseStatus]);

  return licenseStatus;
}
