import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';

const SERVER_OPTIONS = {
  useCursorPagination: false,
};

const { useQuery, ...data } = createFakeServer({}, SERVER_OPTIONS);

export default function ServerPaginationGrid() {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  const { isLoading, rows, pageInfo } = useQuery(paginationModel);

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCount` from being undefined during the loading
  const rowCountRef = React.useRef(pageInfo?.totalRowCount || 0);

  const rowCount = React.useMemo(() => {
    if (pageInfo?.totalRowCount !== undefined) {
      rowCountRef.current = pageInfo.totalRowCount;
    }
    return rowCountRef.current;
  }, [pageInfo?.totalRowCount]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        {...data}
        rowCount={rowCount}
        loading={isLoading}
        pageSizeOptions={[5]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
      />
    </div>
  );
}
