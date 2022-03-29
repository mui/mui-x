import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';

const PAGE_SIZE = 5;

const SERVER_OPTIONS = {
  useCursorPagination: true,
};

const { columns, initialState, useQuery } = createFakeServer({}, SERVER_OPTIONS);

export default function CursorPaginationGrid() {
  const mapPageToNextCursor = React.useRef({});

  const [page, setPage] = React.useState(0);

  const queryOptions = React.useMemo(
    () => ({
      cursor: mapPageToNextCursor.current[page - 1],
      pageSize: PAGE_SIZE,
    }),
    [page],
  );

  const { isLoading, data, rowCount, nextCursor } = useQuery(queryOptions);

  const handlePageChange = (newPage) => {
    // We have the cursor, we can allow the page transition.
    if (newPage === 0 || mapPageToNextCursor.current[newPage - 1]) {
      setPage(newPage);
    }
  };

  React.useEffect(() => {
    if (!isLoading && nextCursor) {
      // We add nextCursor when available
      mapPageToNextCursor.current[page] = nextCursor;
    }
  }, [page, nextCursor, isLoading]);

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = React.useState(rowCount || 0);
  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      rowCount !== undefined ? rowCount : prevRowCountState,
    );
  }, [rowCount, setRowCountState]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={initialState}
        pagination
        pageSize={PAGE_SIZE}
        rowsPerPageOptions={[PAGE_SIZE]}
        rowCount={rowCountState}
        paginationMode="server"
        onPageChange={handlePageChange}
        page={page}
        loading={isLoading}
      />
    </div>
  );
}
