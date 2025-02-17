import * as React from 'react';
import {
  DataGrid,
  GridDataSource,
  GridDataSourceCacheDefault,
} from '@mui/x-data-grid';
import { useMockServer } from '@mui/x-data-grid-generator';

const lowTTLCache = new GridDataSourceCacheDefault({ ttl: 1000 * 10 }); // 10 seconds

export default function ServerSideDataGridTTL() {
  const { columns, initialState, fetchRows } = useMockServer(
    {},
    { useCursorPagination: false },
  );

  const dataSource: GridDataSource = React.useMemo(
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

  const initialStateWithPagination = React.useMemo(
    () => ({
      ...initialState,
      pagination: {
        paginationModel: { pageSize: 10, page: 0 },
        rowCount: 0,
      },
    }),
    [initialState],
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGrid
        columns={columns}
        unstable_dataSource={dataSource}
        unstable_dataSourceCache={lowTTLCache}
        pagination
        initialState={initialStateWithPagination}
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}
