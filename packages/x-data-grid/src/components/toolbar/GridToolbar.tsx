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
    Omit<GridToolbarExportProps, 'color'> {
  /**
   * Show the quick filter component.
   * @default false
   */
  showQuickFilter?: boolean;
  /**
   * Props passed to the quick filter component.
   */
  quickFilterProps?: GridToolbarQuickFilterProps;
}

const GridToolbar = React.forwardRef<HTMLDivElement, GridToolbarProps>(
  function GridToolbar(props, ref) {
    // TODO v7: think about where export option should be passed.
    // from slotProps={{ toolbarExport: { ...exportOption } }} seems to be more appropriate
    const {
      className,
      csvOptions,
      printOptions,
      excelOptions,
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
        <GridToolbarExport
          csvOptions={csvOptions}
          printOptions={printOptions}
          // TODO: remove the reference to excelOptions in community package
          excelOptions={excelOptions}
        />
        <Box sx={{ flex: 1 }} />
        {showQuickFilter && <GridToolbarQuickFilter {...quickFilterProps} />}
      </GridToolbarContainer>
    );
  },
);

GridToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Props passed to the quick filter component.
   */
  quickFilterProps: PropTypes.object,
  /**
   * Show the quick filter component.
   * @default false
   */
  showQuickFilter: PropTypes.bool,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { GridToolbar };
