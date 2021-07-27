import * as React from 'react';
import { DATAGRID_PROPTYPES } from './DataGridPropTypes';
import {
  DEFAULT_GRID_OPTIONS,
  GridBody,
  GridComponentProps,
  GridErrorHandler,
  GridFooterPlaceholder,
  GridHeaderPlaceholder,
  GridRoot,
  useGridApiRef,
} from '../../_modules_/grid';
import { GridContextProvider } from '../../_modules_/grid/context/GridContextProvider';
import { useDataGridComponent } from './useDataGridComponent';
import { DataGridProps, MAX_PAGE_SIZE } from './DataGridProps';

const DataGridRaw = React.forwardRef<HTMLDivElement, DataGridProps>(function DataGrid(
  inProps,
  ref,
) {
  if (inProps.pageSize! > MAX_PAGE_SIZE) {
    throw new Error(`'props.pageSize' cannot exceed 100 in DataGrid.`);
  }

  const props: GridComponentProps = {
    ...inProps,
    disableColumnResize: true,
    disableColumnReorder: true,
    disableMultipleColumnsFiltering: true,
    disableMultipleColumnsSorting: true,
    disableMultipleSelection: true,
    pagination: true,
    checkboxSelectionVisibleOnly: false,
  };

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

export const DATA_GRID_DEFAULT_PROPS = DEFAULT_GRID_OPTIONS;

DataGridRaw.defaultProps = DATA_GRID_DEFAULT_PROPS;

export const DataGrid = React.memo(DataGridRaw);

// @ts-ignore
DataGrid.propTypes = DATAGRID_PROPTYPES;
