import * as React from 'react';
import { MuiCommercialPackageName, useLicenseVerifier } from '../useLicenseVerifier';
import { LICENSE_STATUS, LicenseStatus } from '../utils/licenseStatus';

function getLicenseErrorMessage(licenseStatus: LicenseStatus) {
  switch (licenseStatus) {
    case LICENSE_STATUS.ExpiredAnnualGrace:
    case LICENSE_STATUS.ExpiredAnnual:
      return 'MUI X Expired license key';
    case LICENSE_STATUS.ExpiredVersion:
      return 'MUI X Expired package version';
    case LICENSE_STATUS.Invalid:
      return 'MUI X Invalid license key';
    case LICENSE_STATUS.OutOfScope:
      return 'MUI X License key plan mismatch';
    case LICENSE_STATUS.NotFound:
      return 'MUI X Missing license key';
    default:
      throw new Error('MUI: Unhandled MUI X license status.');
  }
}

interface WatermarkProps {
  packageName: MuiCommercialPackageName;
  releaseInfo: string;
}

export function Watermark(props: WatermarkProps) {
  const { packageName, releaseInfo } = props;
  const licenseStatus = useLicenseVerifier(packageName, releaseInfo);

  if (licenseStatus.status === LICENSE_STATUS.Valid) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 100000,
        width: '100%',
        textAlign: 'center',
        letterSpacing: 5,
      }}
      ref={(el) => {
        if (el) {
          el.style.setProperty('color', '#8282829e', 'important');
          el.style.setProperty('bottom', '50%', 'important');
          el.style.setProperty('right', '0', 'important');
          el.style.setProperty('fontSize', '24px', 'important');
        }
      }}
    >
      {getLicenseErrorMessage(licenseStatus.status)}
    </div>
  );
}
