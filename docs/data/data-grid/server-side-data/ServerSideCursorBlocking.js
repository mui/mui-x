import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useMockServer } from '@mui/x-data-grid-generator';

export default function ServerSideCursorBlocking() {
  const { columns, initialState, fetchRows } = useMockServer(
    {},
    { useCursorPagination: true, minDelay: 1000, maxDelay: 2000 },
  );
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const paginationModelRef = React.useRef(paginationModel);
  paginationModelRef.current = paginationModel;

  const mapPageToNextCursor = React.useRef({});

  const handlePaginationModelChange = (newPaginationModel) => {
    if (
      newPaginationModel.page === 0 ||
      mapPageToNextCursor.current[newPaginationModel.page - 1]
    ) {
      setPaginationModel(newPaginationModel);
    }
  };

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const cursor =
          mapPageToNextCursor.current[paginationModelRef.current.page - 1];
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
    [fetchRows],
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
