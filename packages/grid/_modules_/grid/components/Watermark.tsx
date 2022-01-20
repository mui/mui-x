import * as React from 'react';
import { useLicenseVerifier, LicenseStatus } from '@mui/x-license-pro';

function getLicenseErrorMessage(licenseStatus: LicenseStatus) {
  switch (licenseStatus) {
    case LicenseStatus.Expired:
      return 'MUI X License Expired';
    case LicenseStatus.Invalid:
      return 'MUI X Invalid License';
    case LicenseStatus.NotFound:
      return 'MUI X Unlicensed product';
    default:
      throw new Error('MUI: Unhandled license status.');
  }
}

export function Watermark() {
  const licenseStatus = useLicenseVerifier();
  if (licenseStatus === LicenseStatus.Valid) {
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
      {getLicenseErrorMessage(licenseStatus)}
    </div>
  );
}
