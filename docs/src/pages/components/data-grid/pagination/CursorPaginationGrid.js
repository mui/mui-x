import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

const PAGE_SIZE = 5;

function loadServerRows(cursor, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = cursor ? data.cursors.indexOf(cursor) : 0;
      const end = start + PAGE_SIZE;
      const rows = data.rows.slice(start, end);

      resolve({ rows, nextCursor: data.cursors[end] });
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

const useCursorBasedDemoData = (options) => {
  const response = useDemoData(options);

  const data = React.useMemo(
    () => ({
      ...response.data,
      cursors: response.data.rows.map(() => Math.random().toString()),
    }),
    [response.data],
  );

  return {
    ...response,
    data,
  };
};

export default function CursorPaginationGrid() {
  const { data } = useCursorBasedDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const pagesNextCursor = React.useRef({});

  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const handlePageChange = (params) => {
    // We have the cursor, we can allow the page transition.
    if (params.page === 0 || pagesNextCursor.current[params.page - 1]) {
      setPage(params.page);
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
      const response = await loadServerRows(nextCursor, data);
      pagesNextCursor.current[page] = response.nextCursor;

      if (!active) {
        return;
      }

      setRows(response.rows);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [page, data]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={data.columns}
        pagination
        pageSize={5}
        rowCount={100}
        paginationMode="server"
        onPageChange={handlePageChange}
        page={page}
        loading={loading}
      />
    </div>
  );
}
