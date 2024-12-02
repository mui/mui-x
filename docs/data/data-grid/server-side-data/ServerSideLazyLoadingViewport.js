import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';

function ServerSideLazyLoadingViewport() {
  const { fetchRows, ...props } = useMockServer(
    { rowLength: 100000 },
    { useCursorPagination: false, minDelay: 200, maxDelay: 500 },
  );

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          start: `${params.start}`,
          end: `${params.end}`,
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
      <DataGridPro
        {...props}
        unstable_dataSource={dataSource}
        unstable_lazyLoading
        paginationModel={{ page: 0, pageSize: 10 }}
      />
    </div>
  );
}

export default ServerSideLazyLoadingViewport;
