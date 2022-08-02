import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { createFakeServer } from '@mui/x-data-grid-generator';

const ROW_COUNT = 10000;
const DATASET_OPTION = {
  dataSet: 'Employee',
  rowLength: ROW_COUNT,
};

const { columns, useQuery } = createFakeServer(DATASET_OPTION);

export default function LazyLoadingGrid() {
  const apiRef = useGridApiRef();
  const cachedQuery = React.useMemo(() => ({}), []);
  const { data, loadServerRowsInterval } = useQuery(cachedQuery);
  const cachedRows = React.useMemo(() => data.slice(0, 10), [data]);
  const cachedColumns = React.useMemo(() => columns, []);

  const handleFetchRows = async (params) => {
    const newRowsBatch = await loadServerRowsInterval(params);

    apiRef.current.unstable_replaceRows(
      params.firstRowToRender,
      params.lastRowToRender,
      newRowsBatch.returnedRows,
    );
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        columns={cachedColumns}
        rows={cachedRows}
        apiRef={apiRef}
        hideFooterPagination
        rowCount={ROW_COUNT}
        sortingMode="server"
        filterMode="server"
        rowsLoadingMode="server"
        onFetchRows={handleFetchRows}
        experimentalFeatures={{
          lazyLoading: true,
        }}
      />
    </div>
  );
}
