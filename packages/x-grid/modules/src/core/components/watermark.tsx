import React from 'react';
import { LicenseStatus } from '@material-ui/x-license';

export interface WatermarkProps {
  licenseStatus: LicenseStatus;
}

function getLicenseErrorMessage(licenseStatus: LicenseStatus) {
  switch (licenseStatus) {
    case LicenseStatus.Expired:
      return 'Material-UI X License Expired';
    case LicenseStatus.Invalid:
      return 'Material-UI X Invalid License';
    case LicenseStatus.NotFound:
      return 'Material-UI X Unlicensed product';
    default:
      return '';
  }
}

export const Watermark: React.FC<WatermarkProps> = ({ licenseStatus }) => {
  if (licenseStatus === LicenseStatus.Valid) {
    return null;
  }

  return <div className={'watermark'}> {getLicenseErrorMessage(licenseStatus)} </div>;
};
