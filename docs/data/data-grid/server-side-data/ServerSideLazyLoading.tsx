import * as React from 'react';
import {
  DataGridPro,
  GridDataSource,
  GridGetRowsParams,
} from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';

function ServerSideLazyLoading() {
  const { columns, fetchRows } = useMockServer(
    {},
    { useCursorPagination: false, minDelay: 300, maxDelay: 800 },
  );

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params: GridGetRowsParams) => {
        const urlParams = new URLSearchParams({
          filterModel: encodeURIComponent(JSON.stringify(params.filterModel)),
          sortModel: encodeURIComponent(JSON.stringify(params.sortModel)),
          firstRowToRender: encodeURIComponent(JSON.stringify(params.start)),
          lastRowToRender: encodeURIComponent(JSON.stringify(params.end)),
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
      <DataGridPro columns={columns} unstable_dataSource={dataSource} lazyLoading />
    </div>
  );
}

export default ServerSideLazyLoading;
