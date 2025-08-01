# Data Grid - Row updates

Always keep your rows up to date.

## The `rows` prop

The simplest way to update the rows is to provide the new rows using the `rows` prop.
It replaces the previous values. This approach has some drawbacks:

- You need to provide all the rows.
- You might create a performance bottleneck when preparing the rows array to provide to the Data Grid.

```tsx
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { randomInt, randomUserName } from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const columns: GridColDef[] = [
  { field: 'id' },
  { field: 'username', width: 150 },
  { field: 'age', width: 80, type: 'number' },
];

let idCounter = 0;
const createRandomRow = () => {
  idCounter += 1;
  return { id: idCounter, username: randomUserName(), age: randomInt(10, 80) };
};

export default function UpdateRowsProp() {
  const [rows, setRows] = React.useState(() => [
    createRandomRow(),
    createRandomRow(),
    createRandomRow(),
    createRandomRow(),
  ]);

  const handleUpdateRow = () => {
    if (rows.length === 0) {
      return;
    }
    setRows((prevRows) => {
      const rowToUpdateIndex = randomInt(0, rows.length - 1);

      return prevRows.map((row, index) =>
        index === rowToUpdateIndex ? { ...row, username: randomUserName() } : row,
      );
    });
  };

  const handleUpdateAllRows = () => {
    setRows(rows.map((row) => ({ ...row, username: randomUserName() })));
  };

  const handleDeleteRow = () => {
    if (rows.length === 0) {
      return;
    }
    setRows((prevRows) => {
      const rowToDeleteIndex = randomInt(0, prevRows.length - 1);
      return [
        ...rows.slice(0, rowToDeleteIndex),
        ...rows.slice(rowToDeleteIndex + 1),
      ];
    });
  };

  const handleAddRow = () => {
    setRows((prevRows) => [...prevRows, createRandomRow()]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1}>
        <Button size="small" onClick={handleUpdateRow}>
          Update a row
        </Button>
        <Button size="small" onClick={handleUpdateAllRows}>
          Update all rows
        </Button>
        <Button size="small" onClick={handleDeleteRow}>
          Delete a row
        </Button>
        <Button size="small" onClick={handleAddRow}>
          Add a row
        </Button>
      </Stack>
      <Box sx={{ height: 400, mt: 1 }}>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
  );
}

```

:::warning
Updating the `rows` prop causes the Data Grid to recompute the row tree, resulting in losing the current tree information like the expanded rows state.
Unless the recomputation is explicitly required, the API method `updateRows()` should be used.
:::

## The `updateRows()` method

If you want to only update part of the rows, you can use the `apiRef.current.updateRows()` method.

```tsx
import * as React from 'react';
import { DataGridPro, useGridApiRef, GridColDef } from '@mui/x-data-grid-pro';
import {
  randomInt,
  randomUserName,
  randomArrayItem,
} from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const columns: GridColDef[] = [
  { field: 'id' },
  { field: 'username', width: 150 },
  { field: 'age', width: 80, type: 'number' },
];

let idCounter = 0;
const createRandomRow = () => {
  idCounter += 1;
  return { id: idCounter, username: randomUserName(), age: randomInt(10, 80) };
};

const rows = [
  createRandomRow(),
  createRandomRow(),
  createRandomRow(),
  createRandomRow(),
];

export default function UpdateRowsApiRef() {
  const apiRef = useGridApiRef();

  const handleUpdateRow = () => {
    const rowIds = apiRef.current?.getAllRowIds() || [];
    const rowId = randomArrayItem(rowIds);

    apiRef.current?.updateRows([{ id: rowId, username: randomUserName() }]);
  };

  const handleUpdateAllRows = () => {
    const rowIds = apiRef.current?.getAllRowIds() || [];

    apiRef.current?.updateRows(
      rowIds.map((rowId) => ({ id: rowId, username: randomUserName() })),
    );
  };

  const handleDeleteRow = () => {
    const rowIds = apiRef.current?.getAllRowIds() || [];
    const rowId = randomArrayItem(rowIds);

    apiRef.current?.updateRows([{ id: rowId, _action: 'delete' }]);
  };

  const handleAddRow = () => {
    apiRef.current?.updateRows([createRandomRow()]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1}>
        <Button size="small" onClick={handleUpdateRow}>
          Update a row
        </Button>
        <Button size="small" onClick={handleUpdateAllRows}>
          Update all rows
        </Button>
        <Button size="small" onClick={handleDeleteRow}>
          Delete a row
        </Button>
        <Button size="small" onClick={handleAddRow}>
          Add a row
        </Button>
      </Stack>
      <Box sx={{ height: 400, mt: 1 }}>
        <DataGridPro apiRef={apiRef} rows={rows} columns={columns} />
      </Box>
    </Box>
  );
}

```

The default behavior of `updateRows()` API is to upsert rows.
So if a row has an id that is not in the current list of rows then it will be added to the Data Grid.

Alternatively, if you would like to delete a row, you would need to pass an extra `_action` property in the update object as below.

```ts
apiRef.current.updateRows([{ id: 1, _action: 'delete' }]);
```

:::info
The community version of the Data Grid is limited to a single row update per `apiRef.current.updateRows()` call.
Multiple row updates at a time are supported in [Pro](/x/introduction/licensing/#pro-plan) and [Premium](/x/introduction/licensing/#premium-plan) plans.
:::

## Infinite loading [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

:::warning
This feature is deprecated, use the [Server-side data—Infinite loading](/x/react-data-grid/server-side-data/lazy-loading/#infinite-loading) instead.
:::

The grid provides a `onRowsScrollEnd` prop that can be used to load additional rows when the scroll reaches the bottom of the viewport area.

In addition, the area in which `onRowsScrollEnd` is called can be changed using `scrollEndThreshold`.

```tsx
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

```

:::info
For sorting and filtering to work properly with the infinite loading, they should be applied on the server-side.
Otherwise, the sorting and filtering will only be applied to the subset of rows that have been loaded.
:::

## Lazy loading [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

:::warning
This feature is deprecated, use the [Server-side data—Viewport loading](/x/react-data-grid/server-side-data/lazy-loading/#viewport-loading) instead.
:::

Lazy Loading works like a pagination system, but instead of loading new rows based on pages, it loads them based on the viewport.
It loads new rows in chunks, as the user scrolls through the Data Grid and reveals empty rows.

The Data Grid builds the vertical scroll as if all the rows are already there, and displays empty (skeleton) rows while loading the data. Only rows that are displayed get fetched.

To enable lazy loading, there are a few steps you need to follow:

First, set `rowsLoadingMode="server"`.
Then, set `rowCount` to reflect the number of available rows on the server.
Third, set a callback function on `onFetchRows` to load the data corresponding to the row indices passed within `GridFetchRowsParams`.
Finally, replace the empty rows with the newly fetched ones using `apiRef.current.unstable_replaceRows()` like in the demo below.

```tsx
import * as React from 'react';
import debounce from '@mui/utils/debounce';
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
  const fetchReference = React.useRef(0);

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
      const reference = fetchReference.current;
      const { slice, total } = await fetchRow(params);
      if (reference !== fetchReference.current) {
        return;
      }

      apiRef.current?.unstable_replaceRows(params.firstRowToRender, slice);
      setRowCount(total);
    },
    [apiRef, fetchRow],
  );

  const debouncedHandleFetchRows = React.useMemo(
    () => debounce(handleFetchRows, 200),
    [handleFetchRows],
  );

  const handleModelChange = React.useCallback(() => {
    fetchReference.current += 1;
    setInitialRows([]);
  }, []);

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
        onSortModelChange={handleModelChange}
        onFilterModelChange={handleModelChange}
      />
    </div>
  );
}

```

:::warning
The `onFetchRows` callback is called every time a new row is in the viewport, so when you scroll, you can easily send multiple requests to your backend. We recommend developers limit those by implementing debouncing.
:::

:::warning
For now, lazy loading rows does not work with row grouping or tree data.
:::

:::info
In order for filtering and sorting to work you need to set their modes to `server`.
You can find out more information about how to do that on the [server-side filter page](/x/react-data-grid/filtering/server-side/) and on the [server-side sorting page](/x/react-data-grid/sorting/#server-side-sorting).
:::

## High frequency [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

Whenever the rows are updated, the Data Grid has to apply the sorting and filters. This can be a problem if you have high frequency updates. To maintain good performances, the Data Grid allows to batch the updates and only apply them after a period of time. The `throttleRowsMs` prop can be used to define the frequency (in milliseconds) at which rows updates are applied.

When receiving updates more frequently than this threshold, the Data Grid will wait before updating the rows.

The following demo updates the rows every 10 ms, but they are only applied every 2 seconds.

```tsx
import * as React from 'react';
import { DataGridPro, useGridApiRef, GridColDef } from '@mui/x-data-grid-pro';
import { interval } from 'rxjs';
import { randomInt, randomUserName } from '@mui/x-data-grid-generator';

const columns: GridColDef[] = [
  { field: 'id' },
  { field: 'username', width: 150 },
  { field: 'age', width: 80, type: 'number' },
];

const rows = [
  { id: 1, username: randomUserName(), age: randomInt(10, 80) },
  { id: 2, username: randomUserName(), age: randomInt(10, 80) },
  { id: 3, username: randomUserName(), age: randomInt(10, 80) },
  { id: 4, username: randomUserName(), age: randomInt(10, 80) },
];

export default function ThrottledRowsGrid() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    const subscription = interval(10).subscribe(() => {
      apiRef.current?.updateRows([
        {
          id: randomInt(1, 4),
          username: randomUserName(),
          age: randomInt(10, 80),
        },
        {
          id: randomInt(1, 4),
          username: randomUserName(),
          age: randomInt(10, 80),
        },
      ]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [apiRef]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        apiRef={apiRef}
        throttleRowsMs={2000}
      />
    </div>
  );
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
