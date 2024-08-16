import * as React from 'react';
import {
  DataGridPro,
  DataGridProProps,
  GridSlots,
  GridSortModel,
  gridStringOrNumberComparator,
  GridFilterModel,
  getGridStringOperators,
  GridFilterOperator,
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

const columnFields = [
  'id',
  'desk',
  'commodity',
  'traderName',
  'traderEmail',
  'brokerId',
  'brokerName',
  'counterPartyName',
];
const columns = getCommodityColumns().filter((column) =>
  columnFields.includes(column.field),
);

const filterOperators = getGridStringOperators();
const filterOperatorsLookup = filterOperators.reduce<
  Record<string, GridFilterOperator>
>((acc, operator) => {
  acc[operator.value] = operator;
  return acc;
}, {});

async function fetchRows({
  fromIndex,
  toIndex,
  sortModel,
  filterModel,
}: {
  fromIndex: number;
  toIndex: number;
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
}) {
  if (!allData) {
    allData = await getRealGridData(MAX_ROW_LENGTH, columns);
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

  if (filterModel && filterModel.items.length > 0) {
    const method = filterModel.logicOperator === 'or' ? 'some' : 'every';

    allRows = allRows.filter((row) => {
      return filterModel.items[method]((item) => {
        const filter = filterOperatorsLookup[item.operator];
        if (!filter) {
          return true;
        }
        if (!filter.requiresFilterValue !== false && !item.value) {
          return true;
        }
        const colDef = {} as any;
        const apiRef = {} as any;
        return filter.getApplyFilterFn(item, colDef)?.(
          row[item.field],
          row,
          colDef,
          apiRef,
        );
      });
    });
  }

  const rows = allRows.slice(fromIndex, toIndex);
  return rows;
}

export default function InfiniteLoadingGrid() {
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<any[]>([]);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
  });

  const handleOnRowsScrollEnd = React.useCallback<
    NonNullable<DataGridProProps['onRowsScrollEnd']>
  >(
    async (params) => {
      setLoading(true);
      const fetchedRows = await fetchRows({
        fromIndex: rows.length,
        toIndex: rows.length + params.viewportPageSize * 2,
        sortModel,
        filterModel,
      });
      setLoading(false);
      setRows((prevRows) => prevRows.concat(fetchedRows));
    },
    [rows.length, sortModel, filterModel],
  );

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const fetchedRows = await fetchRows({
        fromIndex: 0,
        toIndex: 20,
        sortModel,
        filterModel,
      });
      if (mounted) {
        setLoading(false);
        setRows(fetchedRows);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [sortModel, filterModel]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        columns={columns}
        rows={rows}
        loading={loading}
        onRowsScrollEnd={handleOnRowsScrollEnd}
        scrollEndThreshold={200}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        filterMode="server"
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        initialState={{
          columns: { columnVisibilityModel: { id: false } },
        }}
        slots={{
          loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
        }}
        hideFooterPagination
      />
    </div>
  );
}
