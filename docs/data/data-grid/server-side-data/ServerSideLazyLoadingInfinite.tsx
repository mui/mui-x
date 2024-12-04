import * as React from 'react';
import {
  DataGridPro,
  GridDataSource,
  GridGetRowsParams,
} from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';

function ServerSideLazyLoadingInfinite() {
  const { fetchRows, ...props } = useMockServer(
    { rowLength: 100 },
    { useCursorPagination: false, minDelay: 200, maxDelay: 500 },
  );

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params: GridGetRowsParams) => {
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
        paginationModel={{ page: 0, pageSize: 15 }}
      />
    </div>
  );
}

export default ServerSideLazyLoadingInfinite;
