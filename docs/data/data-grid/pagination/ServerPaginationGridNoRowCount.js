import * as React from 'react';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';

const SERVER_OPTIONS = {
  useCursorPagination: false,
};

const rowLength = 98;

const { useQuery, ...data } = createFakeServer({ rowLength }, SERVER_OPTIONS);

export default function ServerPaginationGridNoRowCount() {
  const apiRef = useGridApiRef();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  const {
    isLoading,
    rows,
    pageInfo: { hasNextPage },
  } = useQuery(paginationModel);

  const paginationMetaRef = React.useRef();

  // Memoize to avoid flickering when the `hasNextPage` is `undefined` during refetch
  const paginationMeta = React.useMemo(() => {
    if (
      hasNextPage !== undefined &&
      paginationMetaRef.current?.hasNextPage !== hasNextPage
    ) {
      paginationMetaRef.current = { hasNextPage };
    }
    return paginationMetaRef.current;
  }, [hasNextPage]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        {...data}
        initialState={{ ...data.initialState, pagination: { rowCount: -1 } }}
        paginationMeta={paginationMeta}
        loading={isLoading}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
      />
    </div>
  );
}
