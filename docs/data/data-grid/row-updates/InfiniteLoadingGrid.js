import * as React from 'react';
import { DataGridPro, gridStringOrNumberComparator } from '@mui/x-data-grid-pro';
import {
  getRealGridData,
  getCommodityColumns,
  randomInt,
} from '@mui/x-data-grid-generator';
import LinearProgress from '@mui/material/LinearProgress';

const MAX_ROW_LENGTH = 1000;

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

let allData;

async function fetchRows({ fromIndex, toIndex, sortModel }) {
  if (!allData) {
    allData = await getRealGridData(MAX_ROW_LENGTH, getCommodityColumns());
  }
  await sleep(randomInt(100, 600));

  fromIndex = Math.max(0, fromIndex);
  fromIndex = Math.min(fromIndex, allData.rows.length);

  toIndex = Math.max(0, toIndex);
  toIndex = Math.min(toIndex, allData.rows.length);

  let allRows = [...allData.rows];

  if (sortModel && sortModel.length > 0) {
    sortModel.forEach(({ field, sort }) => {
      if (field && sort) {
        allRows = allRows.sort((a, b) => {
          return (
            gridStringOrNumberComparator(a[field], b[field], {}, {}) *
            (sort === 'asc' ? 1 : -1)
          );
        });
      }
    });
  }

  const rows = allRows.slice(fromIndex, toIndex);
  return rows;
}

export default function InfiniteLoadingGrid() {
  const [columns, setColumns] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [sortModel, setSortModel] = React.useState([]);
  const mounted = React.useRef(false);

  const handleSortModelChange = React.useCallback(async (newSortModel) => {
    setLoading(true);
    setSortModel(newSortModel);
    const newRows = await fetchRows({
      fromIndex: 0,
      toIndex: 20,
      sortModel: newSortModel,
    });
    setLoading(false);
    setRows(newRows);
  }, []);

  const handleOnRowsScrollEnd = React.useCallback(
    async (params) => {
      setLoading(true);
      const fetchedRows = await fetchRows({
        fromIndex: rows.length,
        toIndex: rows.length + params.viewportPageSize * 2,
        sortModel,
      });
      setLoading(false);
      setRows((prevRows) => prevRows.concat(fetchedRows));
    },
    [rows.length, sortModel],
  );

  React.useEffect(() => {
    mounted.current = true;
    (async () => {
      setLoading(true);
      const fetchedRows = await fetchRows({
        fromIndex: 0,
        toIndex: 20,
        sortModel,
      });
      if (mounted.current) {
        setLoading(false);
        setRows(fetchedRows);
        setColumns(allData.columns);
      }
    })();
    return () => {
      mounted.current = false;
    };
  }, [sortModel]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        columns={columns}
        rows={rows}
        loading={loading}
        onRowsScrollEnd={handleOnRowsScrollEnd}
        scrollEndThreshold={200}
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        sortingMode="server"
        slots={{
          loadingOverlay: LinearProgress,
        }}
        hideFooterPagination
      />
    </div>
  );
}
