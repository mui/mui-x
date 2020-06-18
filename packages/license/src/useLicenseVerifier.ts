import { useEffect, useState } from 'react';
import { verifyLicense } from './verifyLicense';
import { LicenseInfo } from './licenseInfo';
import { showExpiredLicenseError, showInvalidLicenseError, showNotFoundLicenseError } from './licenseErrorMessageUtils';
import {LicenseStatus} from "./licenseStatus";

export const useLicenseVerifier = () => {
  const [licenseStatus, setLicenseStatus] = useState(LicenseStatus.Invalid);

  useEffect(() => {
    const licenseStatus = verifyLicense(LicenseInfo.releaseInfo, LicenseInfo.key);
    setLicenseStatus(licenseStatus);
    if (licenseStatus === LicenseStatus.Invalid) {
      showInvalidLicenseError();
    } else if (licenseStatus === LicenseStatus.NotFound) {
      showNotFoundLicenseError();
    } else if (licenseStatus === LicenseStatus.Expired) {
      showExpiredLicenseError();
    }
  }, [setLicenseStatus]);

  return licenseStatus;
};
