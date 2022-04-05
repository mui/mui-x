import * as React from 'react';
import PropTypes from 'prop-types';
import { ButtonProps } from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridCsvExportOptions, GridPrintExportOptions } from '../../models/gridExport';
import { GridToolbarExportContainer } from './GridToolbarExportContainer';

export interface GridExportDisplayOptions {
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
  [key: string]: any;
}

export const GridCsvExportMenuItem = (props: GridCsvExportMenuItemProps) => {
  const apiRef = useGridApiContext();
  const { hideMenu, options } = props;

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
    const { csvOptions = {}, printOptions = {}, excelOptions, ...other } = props;

    const apiRef = useGridApiContext();

    const preProcessedButtons = apiRef.current
      .unstable_applyPipeProcessors('exportMenu', [], { excelOptions, csvOptions, printOptions })
      .sort((a, b) => (a.componentName > b.componentName ? 1 : -1));

    if (preProcessedButtons.length === 0) {
      return null;
    }

    return (
      <GridToolbarExportContainer {...other} ref={ref}>
        {preProcessedButtons.map((button, index) =>
          React.cloneElement(button.component, { key: index }),
        )}
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
