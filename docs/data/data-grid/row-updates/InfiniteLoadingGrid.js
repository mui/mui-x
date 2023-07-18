import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import {
  useDemoData,
  getRealGridData,
  getCommodityColumns,
} from '@mui/x-data-grid-generator';
import LinearProgress from '@mui/material/LinearProgress';

const MAX_ROW_LENGTH = 500;

function sleep(time) {
  return new Promise((res) => {
    setTimeout(res, time);
  });
}

const fetchData = async (rowLength) => {
  // Simulate network throttle
  await sleep(Math.random() * 500 + 100);
  return getRealGridData(rowLength, columns);
};

const columns = getCommodityColumns().slice(0, 6);

export default function InfiniteLoadingGrid() {
  const [loading, setLoading] = React.useState(false);
  const [loadedRows, setLoadedRows] = React.useState([]);
  const mounted = React.useRef(true);
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 6,
  });

  const loadServerRows = React.useCallback((newRowLength) => {
    setLoading(true);
    let isActive = true;
    fetchData(newRowLength).then(async (newData) => {
      if (!isActive) {
        return;
      }
      setLoading(false);
      setLoadedRows((prevRows) => prevRows.concat(newData.rows));
    });
    return () => {
      isActive = false;
    };
  }, []);

  const handleOnRowsScrollEnd = (params) => {
    if (loadedRows.length <= MAX_ROW_LENGTH) {
      loadServerRows(params.viewportPageSize);
    }
  };

  React.useEffect(() => {
    return () => {
      mounted.current = true;
    };
  }, []);

  React.useEffect(() => {
    // fetch first 20 rows on mount
    const cancel = loadServerRows(20);
    return cancel;
  }, [loadServerRows]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        rows={loadedRows}
        loading={loading}
        hideFooterPagination
        onRowsScrollEnd={handleOnRowsScrollEnd}
        slots={{
          loadingOverlay: LinearProgress,
        }}
      />
    </div>
  );
}
