import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {
  GridToolbarContainer,
  GridToolbarContainerProps,
} from '../containers/GridToolbarContainer';
import { GridToolbarColumnsButton } from './GridToolbarColumnsButton';
import { GridToolbarDensitySelector } from './GridToolbarDensitySelector';
import { GridToolbarFilterButton } from './GridToolbarFilterButton';
import { GridToolbarExport, GridToolbarExportProps } from './GridToolbarExport';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridToolbarQuickFilter, GridToolbarQuickFilterProps } from './GridToolbarQuickFilter';

export interface GridToolbarProps
  extends GridToolbarContainerProps,
    Pick<GridToolbarExportProps, 'csvOptions' | 'printOptions'> {
  /**
   * Show the quick filter component
   * @default false
   */
  showQuickFilter?: boolean;
  /**
   * props passed to the quick filter component
   */
  quickFilterProps?: GridToolbarQuickFilterProps;
}

const GridToolbar = React.forwardRef<HTMLDivElement, GridToolbarProps>(function GridToolbar(
  props,
  ref,
) {
  const {
    className,
    csvOptions,
    printOptions,
    showQuickFilter = false,
    quickFilterProps = {},
    ...other
  } = props;
  const rootProps = useGridRootProps();

  if (
    rootProps.disableColumnFilter &&
    rootProps.disableColumnSelector &&
    rootProps.disableDensitySelector &&
    !showQuickFilter
  ) {
    return null;
  }

  return (
    <GridToolbarContainer ref={ref} {...other}>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={csvOptions} printOptions={printOptions} />
      <Box sx={{ flex: 1 }} />
      {showQuickFilter && <GridToolbarQuickFilter {...quickFilterProps} />}
    </GridToolbarContainer>
  );
});

GridToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  csvOptions: PropTypes.object,
  printOptions: PropTypes.object,
  /**
   * props passed to the quick filter component
   */
  quickFilterProps: PropTypes.object,
  /**
   * Show the quick filter component
   * @default false
   */
  showQuickFilter: PropTypes.bool,
} as any;

export { GridToolbar };
