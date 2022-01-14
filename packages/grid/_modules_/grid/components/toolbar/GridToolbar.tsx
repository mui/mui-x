import * as React from 'react';
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
    Pick<GridToolbarExportProps, 'csvOptions' | 'printOptions'> {}

export const GridToolbar = React.forwardRef<HTMLDivElement, GridToolbarProps>(function GridToolbar(
  props,
  ref,
) {
  const { className, csvOptions, printOptions, ...other } = props;
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
      <GridToolbarExport csvOptions={csvOptions} printOptions={printOptions} />
    </GridToolbarContainer>
  );
});
