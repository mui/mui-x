import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';
import LoadingSlate from './LoadingSlateNoSnap';

function ServerSideDataGrid() {
  const { isInitialized, columns, initialState, fetchRows } = useMockServer(
    {},
    { useCursorPagination: false },
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
        rowCount: 0,
      },
    }),
    [initialState],
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      {isInitialized ? (
        <DataGridPro
          columns={columns}
          unstable_dataSource={dataSource}
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

export default ServerSideDataGrid;
