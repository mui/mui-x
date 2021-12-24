import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData, useFakeServer } from '@mui/x-data-grid-generator';

export default function ServerPaginationGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const { get } = useFakeServer(data.rows);

  const [rowsState, setRowsState] = React.useState({
    page: 0,
    pageSize: 5,
    rows: [],
    loading: false,
  });

  React.useEffect(() => {
    let active = true;

    (async () => {
      setRowsState((prev) => ({ ...prev, loading: true }));
      const { data: newRows } = await get({
        page: rowsState.page,
        pageSize: rowsState.pageSize,
      });

      if (!active) {
        return;
      }

      setRowsState((prev) => ({ ...prev, loading: false, rows: newRows }));
    })();

    return () => {
      active = false;
    };
  }, [rowsState.page, rowsState.pageSize, data.rows, get]);

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
