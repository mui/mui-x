import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';

function ServerSideLazyLoading() {
  const { columns, fetchRows } = useMockServer(
    {},
    { useCursorPagination: false, minDelay: 300, maxDelay: 800 },
  );

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
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
      lazyLoaded: true,
    }),
    [fetchRows],
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGridPro columns={columns} unstable_dataSource={dataSource} />
    </div>
  );
}

export default ServerSideLazyLoading;
