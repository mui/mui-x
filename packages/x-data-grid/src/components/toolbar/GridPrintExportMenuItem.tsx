import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridPrintExportOptions } from '../../models/gridExport';
import { GridExportMenuItemProps } from './GridToolbarExport';

export type GridPrintExportMenuItemProps = GridExportMenuItemProps<GridPrintExportOptions>;

function GridPrintExportMenuItem(props: GridPrintExportMenuItemProps) {
  const apiRef = useGridApiContext();
  const { hideMenu, options, ...other } = props;

  return (
    <MenuItem
      onClick={() => {
        apiRef.current.exportDataAsPrint(options);
        hideMenu?.();
      }}
      {...other}
    >
      {apiRef.current.getLocaleText('toolbarExportPrint')}
    </MenuItem>
  );
}

GridPrintExportMenuItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  hideMenu: PropTypes.func,
  options: PropTypes.shape({
    allColumns: PropTypes.bool,
    bodyClassName: PropTypes.string,
    copyStyles: PropTypes.bool,
    disableToolbarButton: PropTypes.bool,
    fields: PropTypes.arrayOf(PropTypes.string),
    fileName: PropTypes.string,
    getRowsToExport: PropTypes.func,
    hideFooter: PropTypes.bool,
    hideToolbar: PropTypes.bool,
    includeCheckboxes: PropTypes.bool,
    pageStyle: PropTypes.oneOfType([
      PropTypes.shape({
        '__@hasInstance@645': PropTypes.func.isRequired,
        '__@metadata@647': PropTypes.any,
        apply: PropTypes.func.isRequired,
        arguments: PropTypes.any.isRequired,
        bind: PropTypes.func.isRequired,
        call: PropTypes.func.isRequired,
        caller: PropTypes.object.isRequired,
        length: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        prototype: PropTypes.any.isRequired,
        toString: PropTypes.func.isRequired,
      }),
      PropTypes.string,
    ]),
  }),
} as any;

export { GridPrintExportMenuItem };
