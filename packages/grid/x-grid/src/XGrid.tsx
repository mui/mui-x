import * as React from 'react';
import { LicenseInfo, useLicenseVerifier } from '@material-ui/x-license';
import { ponyfillGlobal } from '@material-ui/utils';
import { GridComponent, GridComponentProps, classnames } from '../../_modules_/grid';

// This is the package release date. Each package version should update this const
// automatically when a new version is published on npm.
let RELEASE_INFO = '__RELEASE_INFO__';

// eslint-disable-next-line no-useless-concat
if (process.env.NODE_ENV !== 'production' && RELEASE_INFO === '__RELEASE' + '_INFO__') {
  // eslint-disable-next-line no-underscore-dangle
  RELEASE_INFO = ponyfillGlobal.__MUI_RELEASE_INFO__;
}

LicenseInfo.setReleaseInfo(RELEASE_INFO);

export type XGridProps = Omit<GridComponentProps, 'licenseStatus'>;

export const XGrid = React.memo(
  React.forwardRef<HTMLDivElement, XGridProps>(function XGrid(props, ref) {
    const { className, ...other } = props;
    const licenseStatus = useLicenseVerifier();

    return (
      <GridComponent
        ref={ref}
        className={classnames('MuiXGrid-root', className)}
        {...other}
        licenseStatus={licenseStatus.toString()}
      />
    );
  }),
);
