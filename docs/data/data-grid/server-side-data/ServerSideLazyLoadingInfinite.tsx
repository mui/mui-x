import * as React from 'react';
import {
  DataGridPro,
  GridDataSource,
  GridGetRowsParams,
  GridToolbar,
} from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';

function ServerSideLazyLoading() {
  const { columns, fetchRows } = useMockServer(
    { rowLength: 120 },
    { useCursorPagination: false, minDelay: 300, maxDelay: 800 },
  );

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params: GridGetRowsParams) => {
        const urlParams = new URLSearchParams({
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          firstRowToRender: `${params.start}`,
          lastRowToRender: `${params.end}`,
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );

        return {
          rows: getRowsResponse.rows,
        };
      },
    }),
    [fetchRows],
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGridPro
        columns={columns}
        unstable_dataSource={dataSource}
        slots={{ toolbar: GridToolbar }}
        lazyLoading
        paginationModel={{ page: 0, pageSize: 12 }}
      />
    </div>
  );
}

export default ServerSideLazyLoading;
