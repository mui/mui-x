import * as React from 'react';
import { DATA_GRID_PROPTYPES } from './DataGridPropTypes';
import {
  DEFAULT_GRID_PROPS_FROM_OPTIONS,
  GridBody,
  GridErrorHandler,
  GridFooterPlaceholder,
  GridHeaderPlaceholder,
  GridRoot,
  useGridApiRef,
} from '../../_modules_/grid';
import { GridContextProvider } from '../../_modules_/grid/context/GridContextProvider';
import { useDataGridComponent } from './useDataGridComponent';
import { DataGridProps } from './DataGridProps';
import { useDataGridProps } from './useDataGridProps';

const DataGridRaw = React.forwardRef<HTMLDivElement, DataGridProps>(function DataGrid(
  inProps,
  ref,
) {
  const props = useDataGridProps(inProps);
  const apiRef = useGridApiRef();
  useDataGridComponent(apiRef, props);

  return (
    <GridContextProvider apiRef={apiRef} props={props}>
      <GridRoot ref={ref}>
        <GridErrorHandler>
          <GridHeaderPlaceholder />
          <GridBody />
          <GridFooterPlaceholder />
        </GridErrorHandler>
      </GridRoot>
    </GridContextProvider>
  );
});

DataGridRaw.defaultProps = DEFAULT_GRID_PROPS_FROM_OPTIONS;

export const DataGrid = React.memo(DataGridRaw);

// @ts-ignore
DataGrid.propTypes = DATA_GRID_PROPTYPES;
