import * as React from 'react';
import {
  GridRowsProp,
  DataGrid,
  GridPageChangeParams,
} from '@material-ui/data-grid';
import {
  useDemoData,
  GridData,
  DemoDataOptions,
  DataRowModel,
} from '@material-ui/x-grid-data-generator';

interface CursorBasedGridData extends GridData {
  cursors: string[];
}

interface CursorBasedGridResponse {
  rows: DataRowModel[];
  nextCursor: string;
}

function loadServerRows(
  cursor: string | null | undefined,
  data: CursorBasedGridData,
): Promise<CursorBasedGridResponse> {
  return new Promise<CursorBasedGridResponse>((resolve) => {
    setTimeout(() => {
      const start = cursor ? data.cursors.indexOf(cursor) + 1 : 0;
      const end = start + 5;
      const rows = data.rows.slice(start, end);

      resolve({ rows, nextCursor: data.cursors[end] });
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

const useCursorBasedDemoData = (options: DemoDataOptions) => {
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

export default function ServerPaginationGrid() {
  const { data } = useCursorBasedDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const pagesNextCursor = React.useRef<{ [page: number]: string }>({});

  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handlePageChange = (params: GridPageChangeParams) => {
    setPage(params.page);
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
        loading={loading}
      />
    </div>
  );
}
