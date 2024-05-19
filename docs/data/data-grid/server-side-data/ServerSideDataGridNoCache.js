import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoDataSource } from '@mui/x-data-grid-generator';
import LoadingSlate from './LoadingSlate';

const pageSizeOptions = [5, 10, 50];

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

export default function ServerSideDataGridNoCache() {
  const { isInitialized, columns, initialState } = useDemoDataSource(
    dataSetOptions,
    serverOptions,
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
          disableServerSideCache
          pagination
          pageSizeOptions={pageSizeOptions}
        />
      ) : (
        <LoadingSlate />
      )}
    </div>
  );
}
