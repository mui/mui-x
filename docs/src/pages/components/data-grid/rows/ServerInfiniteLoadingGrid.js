import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';
import {
  useDemoData,
  getRealData,
  getCommodityColumns,
} from '@material-ui/x-grid-data-generator';

async function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

const loadServerRows = async (newRowLength) => {
  const newData = await getRealData(newRowLength, getCommodityColumns());
  // Simulate network throttle
  await sleep(Math.random() * 100 + 100);

  return newData.rows;
};

export default function InfiniteLoadingGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  const handleFetchRows = async (params) => {
    const newRowsBatch = await loadServerRows(params.viewportPageSize);

    params.api.current.insertRows({
      startIndex: params.startIndex,
      pageSize: params.viewportPageSize,
      newRows: newRowsBatch,
    });
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid
        {...data}
        hideFooterPagination
        rowCount={50}
        sortingMode="server"
        filterMode="server"
        infniteLoadingMode="server"
        onFetchRows={handleFetchRows}
      />
    </div>
  );
}
