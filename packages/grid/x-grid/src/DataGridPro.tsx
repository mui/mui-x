import * as React from 'react';
import PropTypes from 'prop-types';
import { LicenseInfo } from '@mui/x-license-pro';
import { ponyfillGlobal } from '@material-ui/utils';
import {
  DEFAULT_GRID_PROPS_FROM_OPTIONS,
  GridBody,
  GridErrorHandler,
  GridFooterPlaceholder,
  GridHeaderPlaceholder,
  GridRoot,
  useGridApiRef,
} from '../../_modules_/grid';
import { useDataGridProComponent } from './useDataGridProComponent';
import { Watermark } from '../../_modules_/grid/components/Watermark';
import { DataGridProProps } from './DataGridProProps';
import { useDataGridProProps } from './useDataGridProProps';
import { GridRootPropsContext } from '../../_modules_/grid/hooks/utils/useGridRootProps';
import { GridApiContext } from '../../_modules_/grid/hooks/root/useGridApiContext';

// This is the package release date. Each package version should update this const
// automatically when a new version is published on npm.
let RELEASE_INFO = '__RELEASE_INFO__';

// eslint-disable-next-line no-useless-concat
if (process.env.NODE_ENV !== 'production' && RELEASE_INFO === '__RELEASE' + '_INFO__') {
  // eslint-disable-next-line no-underscore-dangle
  RELEASE_INFO = ponyfillGlobal.__MUI_RELEASE_INFO__;
}

LicenseInfo.setReleaseInfo(RELEASE_INFO);

const DataGridProRaw = React.forwardRef<HTMLDivElement, DataGridProProps>(function DataGridPro(
  inProps,
  ref,
) {
  const apiRef = useGridApiRef(inProps.apiRef);
  const props = useDataGridProProps(inProps);
  useDataGridProComponent(apiRef, props);

  return (
    <GridRootPropsContext.Provider value={props}>
      <GridApiContext.Provider value={apiRef}>
        <GridRoot ref={ref}>
          <GridErrorHandler>
            <GridHeaderPlaceholder />
            <GridBody>
              <Watermark />
            </GridBody>
            <GridFooterPlaceholder />
          </GridErrorHandler>
        </GridRoot>
      </GridApiContext.Provider>
    </GridRootPropsContext.Provider>
  );
});

// TODO remove defaultProps, API is going away in React, soon or later.
DataGridProRaw.defaultProps = DEFAULT_GRID_PROPS_FROM_OPTIONS;

export const DataGridPro = React.memo(DataGridProRaw);

// @ts-ignore
DataGridProRaw.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
} as any;
