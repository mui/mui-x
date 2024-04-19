import * as React from 'react';
import Button from '@mui/material/Button';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';

import { createFakeServer } from '@mui/x-data-grid-generator';

const SERVER_OPTIONS = {
  useCursorPagination: false,
};

const { useQuery, ...data } = createFakeServer({ rowLength: 1000 }, SERVER_OPTIONS);

export default function ServerPaginationGridEstimated() {
  const apiRef = useGridApiRef();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 50,
  });

  const {
    isLoading,
    rows,
    pageInfo: { hasNextPage },
  } = useQuery(paginationModel);

  const paginationMetaRef = React.useRef({});
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
    <div style={{ width: '100%' }}>
      <Button onClick={() => apiRef.current.setRowCount(1000)}>Set Row Count</Button>
      <div style={{ height: 400 }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          {...data}
          initialState={{ ...data.initialState, pagination: { rowCount: -1 } }}
          estimatedRowCount={100}
          paginationMeta={paginationMeta}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50, 100]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
        />
      </div>
    </div>
  );
}
