import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';

export default function DataSourceUndoRedo() {
  const {
    columns,
    initialState: initState,
    fetchRows,
    editRow,
  } = useMockServer({ editable: true }, { useCursorPagination: false });

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
      updateRow: (params) => editRow(params.rowId, params.updatedRow),
    }),
    [fetchRows, editRow],
  );

  const initialState = React.useMemo(
    () => ({
      ...initState,
      pagination: {
        paginationModel: { pageSize: 10, page: 0 },
        rowCount: 0,
      },
    }),
    [initState],
  );

  return (
    <Box sx={{ height: 450, width: '100%' }}>
      <DataGridPremium
        columns={columns}
        dataSource={dataSource}
        pagination
        initialState={initialState}
        pageSizeOptions={[10, 20, 50]}
        showToolbar
        disableRowSelectionOnClick
        cellSelection
        disablePivoting
        disableRowGrouping
        disableColumnPinning
      />
    </Box>
  );
}
