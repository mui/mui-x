# Data Grid - Sorting

Easily sort your rows based on one or several criteria.

Sorting is enabled by default to the Data Grid users and works out of the box without any explicit configuration.
Users can set a sorting rule simply by clicking on a column header.
Following clicks change the column's sorting direction. You can see the applied direction on the header's arrow indicator.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function BasicExampleDataGrid() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} />
    </div>
  );
}

```

## Single and multi-sorting

:::warning
The Data Grid can only sort the rows according to one criterion at a time.

To use multi-sorting, you need to upgrade to [Pro plan](/x/introduction/licensing/#pro-plan) or above.
:::

## Multi-sorting [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

The following demo lets you sort the rows according to several criteria at the same time.

By default, users need to hold down the <kbd class="key">Ctrl</kbd> or <kbd class="key">Shift</kbd> (use <kbd class="key">⌘ Command</kbd> on macOS) key while clicking the column header.

```tsx
import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function BasicExampleDataGridPro() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro {...data} loading={loading} />
    </div>
  );
}

```

You can also enable multi-sorting without modifier keys by setting the `multipleColumnsSortingMode` prop to `"always"`.
This allows users to click on multiple column headers to add them as sort criteria without needing to hold down modifier keys.

```tsx
import * as React from 'react';
import { DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const initialState: DataGridProProps['initialState'] = {
  sorting: {
    sortModel: [
      { field: 'rating', sort: 'desc' },
      { field: 'name', sort: 'asc' },
    ],
  },
};

export default function MultiSortingWithoutModifier() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        initialState={initialState}
        multipleColumnsSortingMode="always"
      />
    </div>
  );
}

```

## Pass sorting rules to the Data Grid

### Structure of the model

The sort model is a list of sorting items.
Each item represents a sorting rule and is composed of several elements:

- `sortingItem.field`: the field on which the rule applies.
- `sortingItem.sort`: the direction of the sorting (`'asc'`, `'desc'`, `null` or `undefined`). If `null` or `undefined`, the rule doesn't apply.

### Initialize the sort model

Sorting is enabled by default to the user.
But if you want to set an initial sorting order, simply provide the model to the `initialState` prop.

```jsx
<DataGrid
  initialState={{
    sorting: {
      sortModel: [{ field: 'rating', sort: 'desc' }],
    },
  }}
/>
```

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function InitialSort() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        initialState={{
          ...data.initialState,
          sorting: {
            ...data.initialState?.sorting,
            sortModel: [
              {
                field: 'rating',
                sort: 'desc',
              },
            ],
          },
        }}
      />
    </div>
  );
}

```

### Controlled sort model

Use the `sortModel` prop to control the state of the sorting rules.

You can use the `onSortModelChange` prop to listen to changes in the sorting rules and update the prop accordingly.

```tsx
import * as React from 'react';
import { DataGrid, GridSortModel } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function ControlledSort() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    {
      field: 'rating',
      sort: 'desc',
    },
  ]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        sortModel={sortModel}
        onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
      />
    </div>
  );
}

```

## Disable the sorting

### For all columns

Sorting is enabled by default, but you can easily disable this feature by setting the `disableColumnSorting` prop.

```jsx
<DataGrid disableColumnSorting />
```

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function DisableSortingGridAllColumns() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} disableColumnSorting />
    </div>
  );
}

```

### For some columns

By default, all columns are sortable.
To disable sorting on a column, set the `sortable` property of `GridColDef` to `false`.
In the following demo, the user cannot sort the _rating_ column from the UI.

```tsx
<DataGrid columns={[...columns, { field: 'rating', sortable: false }]} />
```

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function DisableSortingGrid() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((col) =>
        col.field === 'rating' ? { ...col, sortable: false } : col,
      ),
    [data.columns],
  );
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} columns={columns} />
    </div>
  );
}

```

### Sorting non-sortable columns programmatically

The columns with `colDef.sortable` set to `false` are not sortable from the grid UI but could still be sorted programmatically. To add a sort rule to such a column, you could initialize the `sortModel`, use the `sortModel` prop, or use the API methods `sortColumn` or `setSortModel`.

In the following demo, the `firstName` column is not sortable by the default grid UI, but it is sorted programmatically by a custom built UI.

```tsx
import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  Toolbar,
  ToolbarButton,
  useGridApiContext,
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
    filterable: false,
    sortable: false,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

function CustomToolbar() {
  const apiRef = useGridApiContext();

  return (
    <Toolbar>
      <ToolbarButton
        onClick={() => apiRef.current?.sortColumn('firstName', 'asc')}
        render={<Button />}
      >
        Ascending
      </ToolbarButton>
      <ToolbarButton
        onClick={() => apiRef.current?.sortColumn('firstName', 'desc')}
        render={<Button />}
      >
        Descending
      </ToolbarButton>
      <ToolbarButton
        onClick={() => apiRef.current?.sortColumn('firstName', null)}
        render={<Button />}
      >
        None
      </ToolbarButton>
    </Toolbar>
  );
}

export default function ReadOnlySortingGrid() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{ field: 'firstName', sort: 'asc' }],
          },
        }}
        slots={{
          toolbar: CustomToolbar,
        }}
        showToolbar
      />
    </div>
  );
}

```

## Custom comparator

A comparator determines how two cell values should be sorted.

Each column type comes with a default comparator method.
You can re-use them by importing the following functions:

- `gridStringOrNumberComparator` (used by the `string` and `singleSelect` columns)
- `gridNumberComparator` (used by the `number` and `boolean` columns)
- `gridDateComparator` (used by the `date` and `date-time` columns)

To extend or modify this behavior in a specific column, you can pass in a custom comparator, and override the `sortComparator` property of the `GridColDef` interface.

### Create a comparator from scratch

In the following demo, the "Created on" column sorting is based on the day of the month of the `createdOn` field.
It is a fully custom sorting comparator.

```tsx
import * as React from 'react';
import { GridColDef, DataGrid, GridComparatorFn } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'isAdmin'];

const dayInMonthComparator: GridComparatorFn<Date> = (v1, v2) =>
  v1.getDate() - v2.getDate();

export default function FullyCustomSortComparator() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'dateCreatedCustom',
        valueGetter: (value, row) => row.dateCreated,
        headerName: 'Created on',
        width: 180,
        type: 'date',
        sortComparator: dayInMonthComparator,
      },
      ...data.columns,
    ],
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        columns={columns}
        initialState={{
          ...data.initialState,
          sorting: {
            ...data.initialState?.sorting,
            sortModel: [
              {
                field: 'dateCreatedCustom',
                sort: 'asc',
              },
            ],
          },
        }}
      />
    </div>
  );
}

```

### Combine built-in comparators

In the following demo, the "Name" column combines the `name` and `isAdmin` fields.
The sorting is based on `isAdmin` and then on `name`, if necessary. It re-uses the built-in sorting comparator.

```tsx
import * as React from 'react';
import {
  GridColDef,
  DataGrid,
  gridNumberComparator,
  gridStringOrNumberComparator,
  GridComparatorFn,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['rating', 'country', 'dateCreated'];

interface NameAdminCellValue {
  name: string;
  isAdmin: boolean;
}

const nameAdminSortComparator: GridComparatorFn = (v1, v2, param1, param2) => {
  const adminComparatorResult = gridNumberComparator(
    (v1 as NameAdminCellValue).isAdmin,
    (v2 as NameAdminCellValue).isAdmin,
    param1,
    param2,
  );

  // The `isAdmin` values of the two cells are different
  // We can stop here and sort based on the `isAdmin` field.
  if (adminComparatorResult !== 0) {
    return adminComparatorResult;
  }

  return gridStringOrNumberComparator(
    (v1 as NameAdminCellValue).name,
    (v2 as NameAdminCellValue).name,
    param1,
    param2,
  );
};

export default function ExtendedSortComparator() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'nameAdmin',
        headerName: 'Name',
        valueGetter: (value, row) => ({
          name: row.name,
          isAdmin: row.isAdmin,
        }),
        valueFormatter: (value: NameAdminCellValue) => {
          if (value.isAdmin) {
            return `${value.name} (admin)`;
          }

          return value.name;
        },
        sortComparator: nameAdminSortComparator,
        width: 200,
      },
      ...data.columns,
    ],
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        columns={columns}
        initialState={{
          ...data.initialState,
          sorting: {
            ...data.initialState?.sorting,
            sortModel: [
              {
                field: 'nameAdmin',
                sort: 'asc',
              },
            ],
          },
        }}
      />
    </div>
  );
}

```

### Asymmetric comparator

The Data Grid considers the `sortComparator` function symmetric, automatically reversing the return value for descending sorting by multiplying it by `-1`.

While this is sufficient for most use cases, it is possible to define an asymmetric comparator using the `getSortComparator` function – it receives the sorting direction as an argument and returns a comparator function.

In the demo below, the `getSortComparator` function is used in the "Quantity" column to keep the `null` values at the bottom when sorting is applied (regardless of the sorting direction):

```tsx
import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  gridStringOrNumberComparator,
} from '@mui/x-data-grid';
import {
  randomQuantity,
  randomId,
  randomCommodity,
} from '@mui/x-data-grid-generator';

const columns: GridColDef[] = [
  { field: 'commodity', headerName: 'Commodity', width: 200 },
  {
    type: 'number',
    field: 'quantity',
    headerName: 'Quantity',
    getSortComparator: (sortDirection) => {
      const modifier = sortDirection === 'desc' ? -1 : 1;
      return (value1, value2, cellParams1, cellParams2) => {
        if (value1 === null) {
          return 1;
        }
        if (value2 === null) {
          return -1;
        }
        return (
          modifier *
          gridStringOrNumberComparator(value1, value2, cellParams1, cellParams2)
        );
      };
    },
  },
];

const rows = [
  { id: randomId(), commodity: randomCommodity(), quantity: randomQuantity() },
  { id: randomId(), commodity: randomCommodity(), quantity: null },
  { id: randomId(), commodity: randomCommodity(), quantity: randomQuantity() },
  { id: randomId(), commodity: randomCommodity(), quantity: null },
  { id: randomId(), commodity: randomCommodity(), quantity: randomQuantity() },
];

export default function GetSortComparator() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid columns={columns} rows={rows} />
    </div>
  );
}

```

## Custom sort order

By default, the sort order cycles between these three different modes:

```jsx
const sortingOrder = ['asc', 'desc', null];
```

In practice, when you click a column that is not sorted, it will sort ascending (`asc`).
The next click will make it sort descending (`desc`). Another click will remove the sort (`null`), reverting to the order that the data was provided in.

### For all columns

The default sort order can be overridden for all columns with the `sortingOrder` prop.
In the following demo, columns are only sortable in descending or ascending order.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function OrderSortingGrid() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        sortingOrder={['desc', 'asc']}
        initialState={{
          ...data.initialState,
          sorting: {
            ...data.initialState?.sorting,
            sortModel: [
              {
                field: 'commodity',
                sort: 'asc',
              },
            ],
          },
        }}
      />
    </div>
  );
}

```

### Per column

Sort order can be configured (and overridden) on a per-column basis by setting the `sortingOrder` property of the `GridColDef` interface:

```tsx
const columns: GridColDef = [
  { field: 'rating', sortingOrder: ['desc', 'asc', null] },
];
```

```tsx
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function OrderSortingPerColumnGrid() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo<GridColDef[]>(
    () =>
      data.columns.map((column) => {
        if (column.field === 'rating') {
          return {
            ...column,
            sortingOrder: ['desc', 'asc', null],
          };
        }

        return column;
      }),
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        columns={columns}
        sortingOrder={['asc', 'desc', null]}
      />
    </div>
  );
}

```

## Server-side sorting

Sorting can be run server-side by setting the `sortingMode` prop to `server`, and implementing the `onSortModelChange` handler.

```tsx
import * as React from 'react';
import { DataGrid, GridSortModel } from '@mui/x-data-grid';
import { UseDemoDataOptions, createFakeServer } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const DATASET_OPTION: UseDemoDataOptions = {
  dataSet: 'Employee',
  visibleFields: VISIBLE_FIELDS,
  rowLength: 100,
};

const { useQuery, ...data } = createFakeServer(DATASET_OPTION);

export default function ServerSortingGrid() {
  const [queryOptions, setQueryOptions] = React.useState({});

  const handleSortModelChange = React.useCallback((sortModel: GridSortModel) => {
    // Here you save the data you need from the sort model
    setQueryOptions({ sortModel: [...sortModel] });
  }, []);

  const { isLoading, rows } = useQuery(queryOptions);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        {...data}
        sortingMode="server"
        onSortModelChange={handleSortModelChange}
        loading={isLoading}
      />
    </div>
  );
}

```

:::success
You can combine server-side sorting with [server-side filtering](/x/react-data-grid/filtering/server-side/) and [server-side pagination](/x/react-data-grid/pagination/#server-side-pagination) to avoid fetching more data than needed, since it's already processed outside of the Data Grid.
:::

## apiRef

:::warning
Only use this API as the last option. Give preference to the props to control the Data Grid.
:::

```jsx
import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-sort-api.json';

export default function SortingApiNoSnap() {
  return <ApiDocs api={api} />;
}

```

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "Sorting"}}

More information about the selectors and how to use them on the [dedicated page](/x/react-data-grid/state/#access-the-state)

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
