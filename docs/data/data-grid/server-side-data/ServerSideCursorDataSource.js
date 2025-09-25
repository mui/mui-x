import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useMockServer } from '@mui/x-data-grid-generator';

export default function ServerSideCursorDataSource() {
  const { columns, initialState, fetchRows } = useMockServer(
    {},
    { useCursorPagination: true },
  );

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const cursor = await params.getCursor();
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          cursor: String(cursor ?? ''),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
          pageInfo: {
            nextCursor: getRowsResponse.pageInfo?.nextCursor,
          },
        };
      },
    }),
    [fetchRows],
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGrid
        columns={columns}
        dataSource={dataSource}
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
