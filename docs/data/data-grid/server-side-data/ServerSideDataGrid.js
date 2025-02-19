import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useMockServer } from '@mui/x-data-grid-generator';

export default function ServerSideDataGrid() {
  const { columns, initialState, fetchRows } = useMockServer(
    {},
    { useCursorPagination: false },
  );

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
    }),
    [fetchRows],
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGrid
        columns={columns}
        unstable_dataSource={dataSource}
        pagination
        initialState={{
          ...initialState,
          pagination: { paginationModel: { pageSize: 10, page: 0 }, rowCount: 0 },
        }}
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}
