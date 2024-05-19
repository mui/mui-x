import * as React from 'react';
import { DataGridPro, GridDataSource } from '@mui/x-data-grid-pro';
import { useDemoDataSource } from '@mui/x-data-grid-generator';
import LoadingSlate from './LoadingSlate';

const serverOptions = { useCursorPagination: false, minDelay: 1000, maxDelay: 3000 };
const dataSetOptions = {};

const dataSource: GridDataSource = {
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

function ServerSideDataGrid() {
  const { isInitialized, columns, initialState } = useDemoDataSource(
    dataSetOptions,
    serverOptions,
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
    <div style={{ height: 400, width: '100%' }}>
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
