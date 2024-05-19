import * as React from 'react';
import {
  DataGridPro,
  GridGetRowsParams,
  GridGetRowsResponse,
} from '@mui/x-data-grid-pro';
import { useDemoDataSource } from '@mui/x-data-grid-generator';
import { useSWRConfig } from 'swr';

const serverOptions = { useCursorPagination: false };
const dataSetOptions = {};

function ServerSideDataGridWithSWR() {
  const { getRows, columns, initialState } = useDemoDataSource(
    dataSetOptions,
    serverOptions,
  );
  const { cache: swrCache } = useSWRConfig();

  const cache = React.useMemo(
    () => ({
      getKey: (params: GridGetRowsParams) => JSON.stringify(params),
      set: (key: unknown, value: GridGetRowsResponse) => {
        swrCache.set(key as string, { data: value });
      },
      get: (key: unknown) => {
        return swrCache.get(key as string)?.data;
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
