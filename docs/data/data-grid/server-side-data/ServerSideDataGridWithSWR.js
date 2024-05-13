import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoDataSource } from '@mui/x-data-grid-generator';
import { useSWRConfig } from 'swr';

function ServerSideDataGridWithSWR() {
  const { getRows, columns, initialState } = useDemoDataSource(
    {},
    { useCursorPagination: false },
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

  const dataSource = React.useMemo(() => {
    return {
      getRows,
    };
  }, [getRows]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        columns={columns}
        unstable_dataSource={dataSource}
        unstable_serverSideCache={cache}
        pagination
        initialState={initialStateWithPagination}
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}

export default ServerSideDataGridWithSWR;
