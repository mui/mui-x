import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoDataSource } from '@mui/x-data-grid-generator';
import { useSWRConfig } from 'swr';
import LoadingSlate from './LoadingSlate';

const serverOptions = { useCursorPagination: false };
const dataSetOptions = {};

const dataSource = {
  getRows: async (params) => {
    const urlParams = new URLSearchParams({
      paginationModel: encodeURIComponent(JSON.stringify(params.paginationModel)),
      filterModel: encodeURIComponent(JSON.stringify(params.filterModel)),
      sortModel: encodeURIComponent(JSON.stringify(params.sortModel)),
      groupKeys: encodeURIComponent(JSON.stringify(params.groupKeys)),
    });
    const serverResponse = await fetch(
      `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
    );
    const getRowsResponse = await serverResponse.json();
    return {
      rows: getRowsResponse.rows,
      rowCount: getRowsResponse.rowCount,
    };
  },
};

function ServerSideDataGridWithSWR() {
  const { isInitialized, columns, initialState } = useDemoDataSource(
    dataSetOptions,
    serverOptions,
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
      {isInitialized ? (
        <DataGridPro
          columns={columns}
          unstable_dataSource={dataSource}
          unstable_serverSideCache={cache}
          pagination
          initialState={initialStateWithPagination}
          pageSizeOptions={[10, 20, 50]}
        />
      ) : (
        <LoadingSlate />
      )}
    </div>
  );
}

export default ServerSideDataGridWithSWR;
