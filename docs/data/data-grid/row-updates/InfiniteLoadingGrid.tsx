import * as React from 'react';
import {
  DataGridPro,
  DataGridProProps,
  GridSlots,
  GridSortModel,
  gridStringOrNumberComparator,
  GridColDef,
} from '@mui/x-data-grid-pro';
import {
  getRealGridData,
  getCommodityColumns,
  randomInt,
  GridDemoData,
} from '@mui/x-data-grid-generator';
import LinearProgress from '@mui/material/LinearProgress';

const MAX_ROW_LENGTH = 1000;

function sleep(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

let allData: GridDemoData | undefined;

async function fetchRows({
  fromIndex,
  toIndex,
  sortModel,
}: {
  fromIndex: number;
  toIndex: number;
  sortModel: GridSortModel;
}) {
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
            gridStringOrNumberComparator(a[field], b[field], {} as any, {} as any) *
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
  const [columns, setColumns] = React.useState<GridColDef[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<any[]>([]);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const mounted = React.useRef<boolean>(false);

  const handleSortModelChange = React.useCallback(
    async (newSortModel: GridSortModel) => {
      setLoading(true);
      setSortModel(newSortModel);
      const newRows = await fetchRows({
        fromIndex: 0,
        toIndex: 20,
        sortModel: newSortModel,
      });
      setLoading(false);
      setRows(newRows);
    },
    [],
  );

  const handleOnRowsScrollEnd = React.useCallback<
    NonNullable<DataGridProProps['onRowsScrollEnd']>
  >(
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
        setColumns(allData!.columns);
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
          loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
        }}
        hideFooterPagination
      />
    </div>
  );
}
