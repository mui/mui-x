import React from 'react';

import { LicenseInfo, useLicenseVerifier } from '@material-ui/x-license';
import { Grid, GridProps } from '@material-ui/x-grid-modules';

const RELEASE_INFO = '__RELEASE_INFO__';
LicenseInfo.setReleaseInfo(RELEASE_INFO);

export const XGrid: React.FC<Omit<GridProps, 'licenseStatus'>> = React.memo(props => {
  const licenseStatus = useLicenseVerifier();

  return <Grid {...props} licenseStatus={licenseStatus.toString()} />;
});
XGrid.displayName = 'XGrid';
