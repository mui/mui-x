import * as React from 'react';
import {
  GridToolbarContainer,
  GridToolbarContainerProps,
} from '../containers/GridToolbarContainer';
import { GridToolbarColumnsButton } from './GridToolbarColumnsButton';
import { GridToolbarDensitySelector } from './GridToolbarDensitySelector';
import { GridToolbarFilterButton } from './GridToolbarFilterButton';
import { GridToolbarExport } from './GridToolbarExport';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export const GridToolbar = React.forwardRef<HTMLDivElement, GridToolbarContainerProps>(
  function GridToolbar(props, ref) {
    const { className, ...other } = props;
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
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  },
);
