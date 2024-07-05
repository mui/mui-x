import * as React from 'react';
import { useLicenseVerifier } from '../useLicenseVerifier';
import { LICENSE_STATUS, LicenseStatus } from '../utils/licenseStatus';
import { MuiCommercialPackageName } from '../utils/commercialPackages';

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
    case LICENSE_STATUS.NotAvailableInInitialProPlan:
      return 'MUI X Product not covered by plan';
    case LICENSE_STATUS.NotFound:
      return 'MUI X Missing license key';
    default:
      throw new Error('Unhandled MUI X license status.');
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
        color: '#8282829e',
        zIndex: 100000,
        width: '100%',
        textAlign: 'center',
        bottom: '50%',
        right: 0,
        letterSpacing: 5,
        fontSize: 24,
      }}
    >
      {getLicenseErrorMessage(licenseStatus.status)}
    </div>
  );
}
