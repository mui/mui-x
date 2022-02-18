import * as React from 'react';
import PropTypes from 'prop-types';
import { ButtonProps } from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridCsvExportOptions, GridPrintExportOptions } from '../../models/gridExport';
import { GridToolbarExportContainer } from './GridToolbarExportContainer';

interface GridExportDisplayOptions {
  /**
   * If `true`, this export option will be removed from the GridToolbarExport menu.
   * @default false
   */
  disableToolbarButton?: boolean;
}

export interface GridExportMenuItemProps<Options extends {}> {
  hideMenu?: () => void;
  options?: Options & GridExportDisplayOptions;
}

export type GridCsvExportMenuItemProps = GridExportMenuItemProps<GridCsvExportOptions>;

export type GridPrintExportMenuItemProps = GridExportMenuItemProps<GridPrintExportOptions>;

export interface GridToolbarExportProps extends ButtonProps {
  csvOptions?: GridCsvExportOptions & GridExportDisplayOptions;
  printOptions?: GridPrintExportOptions & GridExportDisplayOptions;
}

export const GridCsvExportMenuItem = (props: GridCsvExportMenuItemProps) => {
  const apiRef = useGridApiContext();
  const { hideMenu, options } = props;

  if (options?.disableToolbarButton) {
    return null;
  }
  return (
    <MenuItem
      onClick={() => {
        apiRef.current.exportDataAsCsv(options);
        hideMenu?.();
      }}
    >
      {apiRef.current.getLocaleText('toolbarExportCSV')}
    </MenuItem>
  );
};

export const GridPrintExportMenuItem = (props: GridPrintExportMenuItemProps) => {
  const apiRef = useGridApiContext();
  const { hideMenu, options } = props;

  if (options?.disableToolbarButton) {
    return null;
  }
  return (
    <MenuItem
      onClick={() => {
        apiRef.current.exportDataAsPrint(options);
        hideMenu?.();
      }}
    >
      {apiRef.current.getLocaleText('toolbarExportPrint')}
    </MenuItem>
  );
};

const GridToolbarExport = React.forwardRef<HTMLButtonElement, GridToolbarExportProps>(
  function GridToolbarExport(props, ref) {
    const { csvOptions = {}, printOptions = {}, ...other } = props;

    if (csvOptions?.disableToolbarButton && printOptions?.disableToolbarButton) {
      return null;
    }

    return (
      <GridToolbarExportContainer {...other} ref={ref}>
        <GridCsvExportMenuItem options={csvOptions} />
        <GridPrintExportMenuItem options={printOptions} />
      </GridToolbarExportContainer>
    );
  },
);

GridToolbarExport.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  csvOptions: PropTypes.object,
  printOptions: PropTypes.object,
} as any;

export { GridToolbarExport };
