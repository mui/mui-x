import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

/**
 * Simulates server data loading
 */
const loadServerRows = (page, pageSize, allRows) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(allRows.slice(page * pageSize, (page + 1) * pageSize));
    }, Math.random() * 200 + 100); // simulate network latency
  });

const useQuery = (page, pageSize, allRows) => {
  const [rowCount, setRowCount] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    let active = true;

    setIsLoading(true);
    setRowCount(undefined);
    loadServerRows(page, pageSize, allRows).then((newRows) => {
      if (!active) {
        return;
      }
      setData(newRows);
      setIsLoading(false);
      setRowCount(allRows.length);
    });

    return () => {
      active = false;
    };
  }, [page, pageSize, allRows]);

  return { isLoading, data, rowCount };
};

/**
 * TODO: Improve `useDemoData` to move the fake pagination inside it instead of "fetching" everything of slicing in the component
 */
export default function ServerPaginationGrid() {
  const { data: demoData } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [rowsState, setRowsState] = React.useState({
    page: 0,
    pageSize: 5,
  });

  const { isLoading, data, rowCount } = useQuery(
    rowsState.page,
    rowsState.pageSize,
    demoData.rows,
  );

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
        columns={demoData.columns}
        rows={data}
        rowCount={rowCountState}
        loading={isLoading}
        rowsPerPageOptions={[5]}
        pagination
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
