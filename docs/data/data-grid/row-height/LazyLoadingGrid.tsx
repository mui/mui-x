import * as React from 'react';
import {
  GridFetchRowsParams,
  DataGridPro,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import {
  useDemoData,
  getRealGridData,
  getCommodityColumns,
} from '@mui/x-data-grid-generator';

async function sleep(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

const loadServerRows = async (newRowLength: number) => {
  const newData = await getRealGridData(newRowLength, getCommodityColumns());
  // Simulate network throttle
  await sleep(Math.random() * 100 + 100);

  return newData.rows;
};

export default function LazyLoadingGrid() {
  const apiRef = useGridApiRef();
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 0,
    maxColumns: 6,
  });

  const handleFetchRows = async (params: GridFetchRowsParams) => {
    const newRowsBatch = await loadServerRows(
      params.lastRowToRender - params.firstRowToRender,
    );

    apiRef.current.replaceRows(
      params.firstRowToRender,
      params.lastRowToRender,
      newRowsBatch,
    );
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        apiRef={apiRef}
        hideFooterPagination
        rowCount={50}
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
