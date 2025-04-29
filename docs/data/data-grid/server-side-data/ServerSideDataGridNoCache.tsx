import * as React from 'react';
import { DataGrid, GridDataSource } from '@mui/x-data-grid';
import { useMockServer } from '@mui/x-data-grid-generator';

const pageSizeOptions = [5, 10, 50];

const serverOptions = { useCursorPagination: false };
const dataSetOptions = {};

export default function ServerSideDataGridNoCache() {
  const { fetchRows, columns, initialState } = useMockServer(
    dataSetOptions,
    serverOptions,
  );

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
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
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        initialState={initialStateWithPagination}
        columns={columns}
        dataSource={dataSource}
        dataSourceCache={null}
        pagination
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}
