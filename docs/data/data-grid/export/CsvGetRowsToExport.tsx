import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import {
  DataGrid,
  GridCsvExportOptions,
  GridCsvGetRowsToExportParams,
  gridPaginatedVisibleSortedGridRowIdsSelector,
  gridSortedRowIdsSelector,
  Toolbar,
  gridExpandedSortedRowIdsSelector,
  useGridApiContext,
  GridDownloadIcon,
  ToolbarButton,
} from '@mui/x-data-grid';

const getRowsFromCurrentPage = ({ apiRef }: GridCsvGetRowsToExportParams) =>
  gridPaginatedVisibleSortedGridRowIdsSelector(apiRef);

const getUnfilteredRows = ({ apiRef }: GridCsvGetRowsToExportParams) =>
  gridSortedRowIdsSelector(apiRef);

const getFilteredRows = ({ apiRef }: GridCsvGetRowsToExportParams) =>
  gridExpandedSortedRowIdsSelector(apiRef);

function CustomToolbar() {
  const apiRef = useGridApiContext();

  const handleExport = (options: GridCsvExportOptions) =>
    apiRef.current.exportDataAsCsv(options);

  const buttonBaseProps = {
    color: 'primary',
    size: 'small',
    startIcon: <GridDownloadIcon />,
  } as const;

  return (
    <Toolbar>
      <ToolbarButton
        render={<Button {...buttonBaseProps} />}
        onClick={() => handleExport({ getRowsToExport: getRowsFromCurrentPage })}
      >
        Current page rows
      </ToolbarButton>
      <ToolbarButton
        render={<Button {...buttonBaseProps} />}
        onClick={() => handleExport({ getRowsToExport: getFilteredRows })}
      >
        Filtered rows
      </ToolbarButton>
      <ToolbarButton
        render={<Button {...buttonBaseProps} />}
        onClick={() => handleExport({ getRowsToExport: getUnfilteredRows })}
      >
        Unfiltered rows
      </ToolbarButton>
    </Toolbar>
  );
}

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
        slots={{ toolbar: CustomToolbar }}
        showToolbar
        pageSizeOptions={[10]}
        initialState={{
          ...data.initialState,
          filter: {
            ...data.initialState?.filter,
            filterModel: {
              items: [{ field: 'quantity', operator: '>', value: '20000' }],
            },
          },
          pagination: {
            ...data.initialState?.pagination,
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
      />
    </div>
  );
}
