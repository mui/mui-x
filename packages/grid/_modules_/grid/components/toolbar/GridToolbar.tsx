import * as React from 'react';
import PropTypes from 'prop-types';
import {
  GridToolbarContainer,
  GridToolbarContainerProps,
} from '../containers/GridToolbarContainer';
import { GridToolbarColumnsButton } from './GridToolbarColumnsButton';
import { GridToolbarDensitySelector } from './GridToolbarDensitySelector';
import { GridToolbarFilterButton } from './GridToolbarFilterButton';
import { GridToolbarExport, GridToolbarExportProps } from './GridToolbarExport';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface GridToolbarProps
  extends GridToolbarContainerProps,
    Pick<GridToolbarExportProps, 'csvOptions' | 'printOptions' | 'excelOptions'> {}

const GridToolbar = React.forwardRef<HTMLDivElement, GridToolbarProps>(function GridToolbar(
  props,
  ref,
) {
  const { className, csvOptions, printOptions, excelOptions, ...other } = props;
  const rootProps = useGridRootProps();

  if (
    rootProps.disableColumnFilter &&
    rootProps.disableColumnSelector &&
    rootProps.disableDensitySelector
  ) {
    return null;
  }

  return (
    <GridToolbarContainer ref={ref} {...other}>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport
        csvOptions={csvOptions}
        printOptions={printOptions}
        excelOptions={excelOptions}
      />
    </GridToolbarContainer>
  );
});

GridToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  csvOptions: PropTypes.object,
  excelOptions: PropTypes.shape({
    allColumns: PropTypes.bool,
    disableToolbarButton: PropTypes.bool,
    exceljsPostprocess: PropTypes.func,
    exceljsPreprocess: PropTypes.func,
    fields: PropTypes.arrayOf(PropTypes.string),
    fileName: PropTypes.string,
    getRowsToExport: PropTypes.func,
    includeHeaders: PropTypes.bool,
  }),
  printOptions: PropTypes.object,
} as any;

export { GridToolbar };
