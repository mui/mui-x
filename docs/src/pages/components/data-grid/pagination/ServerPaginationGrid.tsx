import * as React from 'react';
import { DataGrid, GridRowModel } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

/**
 * Simulates server data loading
 */
const loadServerRows = (page: number, pageSize: number, allRows: GridRowModel[]) =>
  new Promise<GridRowModel[]>((resolve) => {
    setTimeout(() => {
      resolve(allRows.slice(page * pageSize, (page + 1) * pageSize));
    }, Math.random() * 200 + 100); // simulate network latency
  });

interface RowsState {
  page: number;
  pageSize: number;
  rows: GridRowModel[];
  loading: boolean;
}

/**
 * TODO: Improve `useDemoData` to move the fake pagination inside it instead of "fetching" everything of slicing in the component
 */
export default function ServerPaginationGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [rowsState, setRowsState] = React.useState<RowsState>({
    page: 0,
    pageSize: 5,
    rows: [],
    loading: false,
  });

  React.useEffect(() => {
    let active = true;

    (async () => {
      setRowsState((prev) => ({ ...prev, loading: true }));
      const newRows = await loadServerRows(
        rowsState.page,
        rowsState.pageSize,
        data.rows,
      );

      if (!active) {
        return;
      }

      setRowsState((prev) => ({ ...prev, loading: false, rows: newRows }));
    })();

    return () => {
      active = false;
    };
  }, [rowsState.page, rowsState.pageSize, data.rows]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        columns={data.columns}
        pagination
        rowCount={data.rows.length}
        {...rowsState}
        paginationMode="server"
        onPageChange={(page) => setRowsState((prev) => ({ ...prev, page }))}
        onPageSizeChange={(pageSize) =>
          setRowsState((prev) => ({ ...prev, pageSize }))
        }
      />
    </div>
  );
}
