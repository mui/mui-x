import * as React from 'react';
import {
  DataGrid,
  GridDataSource,
  GridPaginationModel,
  GridRowId,
} from '@mui/x-data-grid';
import { useMockServer } from '@mui/x-data-grid-generator';

export default function ServerSideCursorBlocking() {
  const { columns, initialState, fetchRows } = useMockServer(
    {},
    { useCursorPagination: true, minDelay: 200, maxDelay: 500 },
  );
  const mapPageToNextCursor = React.useRef<{
    [page: number]: GridRowId | undefined;
  }>({});
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
    // We have the cursor, we can allow the page transition.
    if (
      newPaginationModel.page === 0 ||
      mapPageToNextCursor.current[newPaginationModel.page - 1]
    ) {
      setPaginationModel(newPaginationModel);
    }
  };

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const cursor = mapPageToNextCursor.current[paginationModel.page - 1];
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          cursor: String(cursor ?? ''),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        mapPageToNextCursor.current[params.paginationModel?.page || 0] =
          getRowsResponse.pageInfo?.nextCursor;
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
    }),
    [fetchRows, paginationModel],
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGrid
        columns={columns}
        dataSource={dataSource}
        pagination
        initialState={{
          ...initialState,
          pagination: { rowCount: 0 },
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}
