import * as React from 'react';
import { DataGrid, GridPaginationMeta, GridPaginationModel } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';

const SERVER_OPTIONS = {
  useCursorPagination: false,
};

const { useQuery, ...data } = createFakeServer({}, SERVER_OPTIONS);

export default function ServerPaginationGridNoRowCount() {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  const {
    isLoading,
    rows,
    pageInfo: { hasNextPage },
  } = useQuery(paginationModel);

  const paginationMetaRef = React.useRef<GridPaginationMeta>();

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

  const handlePaginationModelChange = React.useCallback(
    (newPaginationModel: GridPaginationModel) => {
      setPaginationModel(newPaginationModel);
    },
    [],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        {...data}
        initialState={{ ...data.initialState, pagination: { rowCount: -1 } }}
        paginationMeta={paginationMeta}
        loading={isLoading}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={handlePaginationModelChange}
      />
    </div>
  );
}
