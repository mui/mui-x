import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';
import { useSWRConfig } from 'swr';

const serverOptions = { useCursorPagination: false };
const dataSetOptions = {};

function ServerSideDataGridWithSWR() {
  const { fetchRows, columns, initialState } = useMockServer(
    dataSetOptions,
    serverOptions,
  );

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: encodeURIComponent(
            JSON.stringify(params.paginationModel),
          ),
          filterModel: encodeURIComponent(JSON.stringify(params.filterModel)),
          sortModel: encodeURIComponent(JSON.stringify(params.sortModel)),
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

  const { cache: swrCache } = useSWRConfig();

  const cache = React.useMemo(
    () => ({
      getKey: (params) => JSON.stringify(params),
      set: (key, value) => {
        swrCache.set(key, { data: value });
      },
      get: (key) => {
        return swrCache.get(key)?.data;
      },
      clear: () => {
        const keys = swrCache.keys();
        Array.from(keys).forEach((key) => {
          swrCache.delete(key);
        });
      },
    }),
    [swrCache],
  );

  const initialStateWithPagination = React.useMemo(
    () => ({
      ...initialState,
      pagination: {
        paginationModel: { pageSize: 10, page: 0 },
      },
    }),
    [initialState],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        columns={columns}
        unstable_dataSource={dataSource}
        unstable_dataSourceCache={cache}
        pagination
        initialState={initialStateWithPagination}
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}

export default ServerSideDataGridWithSWR;
