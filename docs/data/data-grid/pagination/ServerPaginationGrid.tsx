import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { serverConfiguration, UseDemoDataOptions } from '@mui/x-data-grid-generator';

const DATASET_OPTION: UseDemoDataOptions = {
  dataSet: 'Commodity',
  rowLength: 100,
  maxColumns: 6,
};

const SERVER_OPTIONS = {
  minDelay: 100,
  maxDelay: 300,
  useCursorPagination: false,
};

const { columns, initialState, useQuery } = serverConfiguration(
  DATASET_OPTION,
  SERVER_OPTIONS,
);

export default function ServerPaginationGrid() {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);

  const queryOptions = React.useMemo(
    () => ({
      page,
      pageSize,
    }),
    [page, pageSize],
  );

  const { isLoading, data, rowCount } = useQuery(queryOptions);

  // Some api client return undefine while loading
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
        rowCount={rowCountState}
        loading={isLoading}
        rowsPerPageOptions={[5]}
        pagination
        page={page}
        pageSize={pageSize}
        paginationMode="server"
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        columns={columns}
        initialState={initialState}
      />
    </div>
  );
}
