import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import {
  DataGrid,
  GridApiRef,
  GridCsvExportOptions,
  gridPaginatedVisibleSortedGridRowIdsSelector,
  gridSortedRowIdsSelector,
  GridToolbarContainer,
  gridVisibleSortedRowIdsSelector,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid';

const getRowsFromCurrentPage = (apiRef: GridApiRef) =>
  gridPaginatedVisibleSortedGridRowIdsSelector(apiRef.current.state);

const getUnfilteredRows = (apiRef: GridApiRef) =>
  gridSortedRowIdsSelector(apiRef.current.state);

const getFilteredRows = (apiRef: GridApiRef) =>
  gridVisibleSortedRowIdsSelector(apiRef.current.state);

const CustomToolbar = () => {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  const handleExport = (options: GridCsvExportOptions) =>
    apiRef.current.exportDataAsCsv(options);

  const buttonBaseProps = {
    color: 'primary',
    size: 'small',
    startIcon: <rootProps.components.ExportIcon />,
    ...rootProps.componentsProps?.baseButton,
  };

  return (
    <GridToolbarContainer>
      <rootProps.components.BaseButton
        {...buttonBaseProps}
        onClick={() => handleExport({ getRowsToExport: getRowsFromCurrentPage })}
      >
        Current page rows
      </rootProps.components.BaseButton>
      <rootProps.components.BaseButton
        {...buttonBaseProps}
        onClick={() => handleExport({ getRowsToExport: getFilteredRows })}
      >
        Filtered rows
      </rootProps.components.BaseButton>
      <rootProps.components.BaseButton
        {...buttonBaseProps}
        onClick={() => handleExport({ getRowsToExport: getUnfilteredRows })}
      >
        Unfiltered rows
      </rootProps.components.BaseButton>
    </GridToolbarContainer>
  );
};

export default function CsvGetRowsToExport() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        components={{ Toolbar: CustomToolbar }}
        pageSize={10}
        rowsPerPageOptions={[10]}
        initialState={{
          filter: {
            filterModel: {
              items: [
                { columnField: 'quantity', operatorValue: '>', value: '20000' },
              ],
            },
          },
        }}
      />
    </div>
  );
}
