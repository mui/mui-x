import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';

const PAGE_SIZE = 5;

const SERVER_OPTIONS = {
  useCursorPagination: true,
};

const { useQuery, ...data } = createFakeServer({}, SERVER_OPTIONS);

export default function CursorPaginationGrid() {
  const mapPageToNextCursor = React.useRef({});

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const queryOptions = React.useMemo(
    () => ({
      cursor: mapPageToNextCursor.current[paginationModel.page - 1],
      pageSize: paginationModel.pageSize,
    }),
    [paginationModel],
  );
  const { isLoading, rows, pageInfo } = useQuery(queryOptions);

  const handlePaginationModelChange = (newPaginationModel) => {
    // We have the cursor, we can allow the page transition.
    if (
      newPaginationModel.page === 0 ||
      mapPageToNextCursor.current[newPaginationModel.page - 1]
    ) {
      setPaginationModel(newPaginationModel);
    }
  };

  React.useEffect(() => {
    if (!isLoading && pageInfo?.nextCursor) {
      // We add nextCursor when available
      mapPageToNextCursor.current[paginationModel.page] = pageInfo?.nextCursor;
    }
  }, [paginationModel.page, isLoading, pageInfo?.nextCursor]);

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = React.useState(
    pageInfo?.totalRowCount || 0,
  );
  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      pageInfo?.totalRowCount !== undefined
        ? pageInfo?.totalRowCount
        : prevRowCountState,
    );
  }, [pageInfo?.totalRowCount, setRowCountState]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        {...data}
        pageSizeOptions={[PAGE_SIZE]}
        rowCount={rowCountState}
        paginationMode="server"
        onPaginationModelChange={handlePaginationModelChange}
        paginationModel={paginationModel}
        loading={isLoading}
      />
    </div>
  );
}
