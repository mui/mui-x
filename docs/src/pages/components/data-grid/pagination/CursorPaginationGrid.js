import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData, useFakeServer } from '@mui/x-data-grid-generator';

const PAGE_SIZE = 5;

export default function CursorPaginationGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const { get } = useFakeServer(data.rows);

  const pagesNextCursor = React.useRef({});

  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const handlePageChange = (newPage) => {
    // We have the cursor, we can allow the page transition.
    if (newPage === 0 || pagesNextCursor.current[newPage - 1]) {
      setPage(newPage);
    }
  };

  React.useEffect(() => {
    let active = true;

    (async () => {
      const nextCursor = pagesNextCursor.current[page - 1];

      if (!nextCursor && page > 0) {
        return;
      }

      setLoading(true);
      const response = await get({ cursor: nextCursor, pageSize: PAGE_SIZE });

      if (response.nextCursor) {
        pagesNextCursor.current[page] = response.nextCursor;
      }

      if (!active) {
        return;
      }

      setRows(response.data);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [page, get]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={data.columns}
        pagination
        pageSize={5}
        rowsPerPageOptions={[5]}
        rowCount={100}
        paginationMode="server"
        onPageChange={handlePageChange}
        page={page}
        loading={loading}
      />
    </div>
  );
}
