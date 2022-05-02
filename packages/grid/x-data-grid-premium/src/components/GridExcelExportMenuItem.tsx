import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { GridExportMenuItemProps } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridExcelExportOptions } from '../hooks/features/export';

export type GridExcelExportMenuItemProps = GridExportMenuItemProps<GridExcelExportOptions>;

const GridExcelExportMenuItem = (props: GridExcelExportMenuItemProps) => {
  const apiRef = useGridApiContext();
  const { hideMenu, options } = props;

  return (
    <MenuItem
      onClick={() => {
        apiRef.current.exportDataAsExcel(options);
        hideMenu?.();
      }}
    >
      {apiRef.current.getLocaleText('toolbarExportExcel')}
    </MenuItem>
  );
};

GridExcelExportMenuItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  hideMenu: PropTypes.func,
  options: PropTypes.shape({
    disableToolbarButton: PropTypes.bool,
  }),
} as any;

export { GridExcelExportMenuItem };
