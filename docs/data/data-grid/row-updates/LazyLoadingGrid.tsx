import * as React from 'react';
import {
  DataGridPro,
  GridFetchRowsParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { createFakeServer, UseDemoDataOptions } from '@mui/x-data-grid-generator';

const ROW_COUNT = 10000;
const DATASET_OPTION: UseDemoDataOptions = {
  dataSet: 'Employee',
  rowLength: ROW_COUNT,
};

const { columns, useQuery } = createFakeServer(DATASET_OPTION);

export default function LazyLoadingGrid() {
  const apiRef = useGridApiRef();
  const cachedQuery = React.useMemo(() => ({}), []);
  const { data, loadServerRowsInterval } = useQuery(cachedQuery);
  const cachedRows = React.useMemo(() => data.slice(0, 10), [data]);

  const handleFetchRows = async (params: GridFetchRowsParams) => {
    const newRowsBatch = await loadServerRowsInterval(params);

    apiRef.current.replaceRows(
      params.firstRowToRender,
      params.lastRowToRender,
      newRowsBatch.returnedRows,
    );
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        columns={columns}
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
