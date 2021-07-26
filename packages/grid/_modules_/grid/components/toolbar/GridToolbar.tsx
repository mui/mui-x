import * as React from 'react';
import {
  GridToolbarContainer,
  GridToolbarContainerProps,
} from '../containers/GridToolbarContainer';
import { GridToolbarColumnsButton } from './GridToolbarColumnsButton';
import { GridToolbarDensitySelector } from './GridToolbarDensitySelector';
import { GridToolbarFilterButton } from './GridToolbarFilterButton';
import { GridToolbarExport } from './GridToolbarExport';
import {GridRootPropsContext} from "../../context/GridRootPropsContext";

export const GridToolbar = React.forwardRef<HTMLDivElement, GridToolbarContainerProps>(
  function GridToolbar(props, ref) {
      const rootProps = React.useContext(GridRootPropsContext)!;

    if (
        rootProps.disableColumnFilter &&
        rootProps.disableColumnSelector &&
        rootProps.disableDensitySelector
    ) {
      return null;
    }

    return (
      <GridToolbarContainer ref={ref} {...props}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  },
);
