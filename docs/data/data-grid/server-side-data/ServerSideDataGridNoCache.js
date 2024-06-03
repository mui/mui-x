import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';
import LoadingSlate from './LoadingSlateNoSnap';

const pageSizeOptions = [5, 10, 50];

const serverOptions = { useCursorPagination: false };
const dataSetOptions = {};

export default function ServerSideDataGridNoCache() {
  const { isInitialized, fetchRows, columns, initialState } = useMockServer(
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
          initialState={initialStateWithPagination}
          columns={columns}
          unstable_dataSource={dataSource}
          disableDataSourceCache
          pagination
          pageSizeOptions={pageSizeOptions}
        />
      ) : (
        <LoadingSlate />
      )}
    </div>
  );
}
