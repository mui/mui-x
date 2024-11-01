import * as React from 'react';
import PropTypes from 'prop-types';
import { TooltipProps } from '@mui/material/Tooltip';
import { ToggleButtonProps } from '@mui/material/ToggleButton';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridCsvExportOptions, GridPrintExportOptions } from '../../../models/gridExport';
import { GridToolbarExportContainer } from '../GridToolbarExportContainer';
import { GridExportDisplayOptions } from '../GridToolbarExport';

export interface GridToolbarExportItemProps {
  csvOptions?: GridCsvExportOptions & GridExportDisplayOptions;
  printOptions?: GridPrintExportOptions & GridExportDisplayOptions;
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: { toggleButton?: Partial<ToggleButtonProps>; tooltip?: Partial<TooltipProps> };
  [key: string]: any;
}

const GridToolbarExportItem = React.forwardRef<HTMLButtonElement, GridToolbarExportItemProps>(
  function GridToolbarExportItem(props, ref) {
    const { csvOptions = {}, printOptions = {}, excelOptions, slotProps, ...other } = props;

    const apiRef = useGridApiContext();

    const preProcessedButtons = apiRef.current
      .unstable_applyPipeProcessors('exportMenu', [], { excelOptions, csvOptions, printOptions })
      .sort((a, b) => (a.componentName > b.componentName ? 1 : -1));

    if (preProcessedButtons.length === 0) {
      return null;
    }

    return (
      <GridToolbarExportContainer
        {...other}
        slotProps={{ ...slotProps, toggleButton: slotProps?.toggleButton || {} }}
        ref={ref}
      >
        {preProcessedButtons.map((button, index) =>
          React.cloneElement(button.component, { key: index }),
        )}
      </GridToolbarExportContainer>
    );
  },
);

GridToolbarExportItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  csvOptions: PropTypes.object,
  printOptions: PropTypes.object,
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: PropTypes.object,
} as any;

export { GridToolbarExportItem };
