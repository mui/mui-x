import * as React from 'react';
import { unstable_debounce as debounce } from '@mui/utils';
import {
  DataGridPro,
  GridFetchRowsParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import {
  createFakeServer,
  loadServerRows,
  UseDemoDataOptions,
} from '@mui/x-data-grid-generator';

const DATASET_OPTION: UseDemoDataOptions = {
  dataSet: 'Employee',
  rowLength: 10000,
};

const { columnsWithDefaultColDef, useQuery, ...data } =
  createFakeServer(DATASET_OPTION);

const emptyObject = {};

export default function LazyLoadingGrid() {
  // dataServerSide simulates your database.
  const { rows: rowsServerSide } = useQuery(emptyObject);

  const apiRef = useGridApiRef();
  const [initialRows, setInitialRows] = React.useState<typeof rowsServerSide>([]);
  const [rowCount, setRowCount] = React.useState(0);

  const fetchRow = React.useCallback(
    async (params: GridFetchRowsParams) => {
      const serverRows = await loadServerRows(
        rowsServerSide,
        {
          filterModel: params.filterModel,
          sortModel: params.sortModel,
        },
        {
          minDelay: 300,
          maxDelay: 800,
          useCursorPagination: false,
        },
        columnsWithDefaultColDef,
      );

      return {
        slice: serverRows.returnedRows.slice(
          params.firstRowToRender,
          params.lastRowToRender,
        ),
        total: serverRows.returnedRows.length,
      };
    },
    [rowsServerSide],
  );

  // The initial fetch request of the viewport.
  React.useEffect(() => {
    if (rowsServerSide.length === 0) {
      return;
    }

    (async () => {
      const { slice, total } = await fetchRow({
        firstRowToRender: 0,
        lastRowToRender: 10,
        sortModel: [],
        filterModel: {
          items: [],
        },
      });

      setInitialRows(slice);
      setRowCount(total);
    })();
  }, [rowsServerSide, fetchRow]);

  // Fetch rows as they become visible in the viewport
  const handleFetchRows = React.useCallback(
    async (params: GridFetchRowsParams) => {
      const { slice, total } = await fetchRow(params);

      apiRef.current.unstable_replaceRows(params.firstRowToRender, slice);
      setRowCount(total);
    },
    [apiRef, fetchRow],
  );

  const debouncedHandleFetchRows = React.useMemo(
    () => debounce(handleFetchRows, 200),
    [handleFetchRows],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={initialRows}
        {...data}
        apiRef={apiRef}
        hideFooterPagination
        rowCount={rowCount}
        sortingMode="server"
        filterMode="server"
        rowsLoadingMode="server"
        onFetchRows={debouncedHandleFetchRows}
      />
    </div>
  );
}
