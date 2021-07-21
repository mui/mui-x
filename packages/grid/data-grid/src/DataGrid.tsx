import { DataGridProps, MAX_PAGE_SIZE } from '@material-ui/data-grid/DataGridProps';
import { DATAGRID_PROPTYPES } from '@material-ui/data-grid/DataGridPropTypes';
import * as React from 'react';
import {
  DEFAULT_GRID_OPTIONS,
  GridBody,
  GridErrorHandler,
  GridFooterPlaceholder,
  GridHeaderPlaceholder,
  GridRoot,
  useGridApiRef,
  useThemeProps,
} from '../../_modules_/grid';
import { GridContextProvider } from '../../_modules_/grid/context/GridContextProvider';
import { useDataGridComponent } from './useDataGridComponent';

const DataGridRaw = React.forwardRef<HTMLDivElement, DataGridProps>(function DataGrid(
  inProps,
  ref,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDataGrid' });
  const { pageSize: pageSizeProp, selectionModel: dataGridSelectionModel, ...other } = props;

  let pageSize = pageSizeProp;
  if (pageSize && pageSize > MAX_PAGE_SIZE) {
    // TODO throw error?
    pageSize = MAX_PAGE_SIZE;
  }

  //todo move that to useSorting
  const selectionModel =
    dataGridSelectionModel !== undefined && !Array.isArray(dataGridSelectionModel)
      ? [dataGridSelectionModel]
      : dataGridSelectionModel;

  const apiRef = useGridApiRef();

  useDataGridComponent(apiRef, { ...other, selectionModel, pageSize });

  return (
    <GridContextProvider apiRef={apiRef} props={{ ...other, selectionModel, pageSize }}>
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
DataGridRaw.defaultProps = {
  ...DEFAULT_GRID_OPTIONS,
  apiRef: undefined,
  disableColumnResize: true,
  disableColumnReorder: true,
  disableMultipleColumnsFiltering: true,
  disableMultipleColumnsSorting: true,
  disableMultipleSelection: true,
  pagination: true,
  onRowsScrollEnd: undefined,
  checkboxSelectionVisibleOnly: false,
};

export const DataGrid = React.memo(DataGridRaw);

// @ts-ignore
DataGrid.propTypes = DATAGRID_PROPTYPES;
