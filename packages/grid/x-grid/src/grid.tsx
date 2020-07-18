import * as React from 'react';
import clsx from 'clsx';
import { LicenseInfo, useLicenseVerifier } from '@material-ui/x-license';
import { GridComponent, GridComponentProps } from '@material-ui/x-grid-modules';

// This is the grid release date
// each grid version should update this const automatically when a new version of the grid is published to NPM
const RELEASE_INFO = '__RELEASE_INFO__';
LicenseInfo.setReleaseInfo(RELEASE_INFO);
export type XGridProps = Omit<GridComponentProps, 'licenseStatus'>;

export const XGrid: React.FC<XGridProps> = React.memo<XGridProps>(function XGrid(
  props: XGridProps,
) {
  const { className, ...other } = props;
  const licenseStatus = useLicenseVerifier();

  return (
    <GridComponent
      {...other}
      licenseStatus={licenseStatus.toString()}
      className={clsx('MuiXGrid-root', className)}
    />
  );
});
