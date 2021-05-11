import * as React from 'react';
import PropTypes from 'prop-types';
import { LicenseInfo, useLicenseVerifier } from '@material-ui/x-license';
import { ponyfillGlobal } from '@material-ui/utils';
import { GridComponent, GridComponentProps, classnames, useThemeProps } from '../../_modules_/grid';

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

const XGridRaw = React.forwardRef<HTMLDivElement, XGridProps>(function XGrid(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiDataGrid' });
  const { className, classes, ...other } = props;
  const licenseStatus = useLicenseVerifier();

  return (
    <GridComponent
      ref={ref}
      className={classnames('MuiDataGrid-root', classes?.root, className)}
      {...other}
      licenseStatus={licenseStatus.toString()}
    />
  );
});

export const XGrid = React.memo(XGridRaw);

// @ts-ignore
XGridRaw.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
} as any;
