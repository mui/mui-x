import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { GridToolbarContainer } from '../containers/GridToolbarContainer';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridToolbarQuickFilter } from './GridToolbarQuickFilter';
import { GridToolbarColumnsToggleButton } from './GridToolbarColumnsToggleButton';
import { GridToolbarFilterToggleButton } from './GridToolbarFilterToggleButton';
import { GridToolbarFilterChip } from './GridToolbarFilterChip';
import { GridToolbarSeparator } from './GridToolbarSeparator';
import { GridToolbarDensityToggleButton } from './GridToolbarDensityToggleButton';
import { GridToolbarPrintToggleButton } from './GridToolbarPrintToggleButton';
import { GridToolbarExportToggleButton } from './GridToolbarExportToggleButton';
import { GridToolbarProps } from './GridToolbar';

const GridToolbarV8 = React.forwardRef<HTMLDivElement, GridToolbarProps>(
  function GridToolbarV8(props, ref) {
    // TODO v7: think about where export option should be passed.
    // from slotProps={{ toolbarExport: { ...exportOption } }} seems to be more appropriate
    const {
      className,
      csvOptions,
      printOptions,
      excelOptions,
      showQuickFilter = true,
      quickFilterProps = {},
      filterButtonRef,
      columnsButtonRef,
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
        {showQuickFilter && <GridToolbarQuickFilter {...quickFilterProps} />}
        <Box sx={{ flex: 1 }} />
        <GridToolbarColumnsToggleButton ref={columnsButtonRef} />
        <GridToolbarFilterToggleButton ref={filterButtonRef} />
        <GridToolbarFilterChip />
        <GridToolbarSeparator />
        <GridToolbarDensityToggleButton />
        <GridToolbarSeparator />
        {!printOptions?.disableToolbarButton && <GridToolbarPrintToggleButton />}
        <GridToolbarExportToggleButton
          printOptions={{ disableToolbarButton: true }}
          csvOptions={csvOptions}
          // TODO: remove the reference to excelOptions in community package
          excelOptions={excelOptions}
        />
      </GridToolbarContainer>
    );
  },
);

GridToolbarV8.propTypes = {
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

export { GridToolbarV8 };
