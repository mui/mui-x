# Data Grid - Pagination

Easily paginate your rows and only fetch what you need.

## Enabling pagination

The default pagination behavior depends on your plan:

:::info
Exported CSV and Excel files include all data and disregard pagination by default.
To apply pagination to exported files, review the available [row selectors](/x/react-data-grid/export/#exported-rows).
:::

### Community plan

For the Community Data Grid, pagination is enabled by default and cannot be disabled.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function PaginationCommunityNoSnap() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 500,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid {...data} loading={loading} />
    </div>
  );
}

```

### Pro [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan') and Premium [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

For the Pro and Premium Data Grid, pagination is disabled by default; use the `pagination` prop to enable it.

```tsx
import * as React from 'react';
import { DataGridPremium, GridColDef, GridRowsProp } from '@mui/x-data-grid-premium';

const rows: GridRowsProp = [
  {
    jobTitle: 'Head of Human Resources',
    recruitmentDate: new Date(2020, 8, 12),
    contract: 'full time',
    id: 0,
  },
  {
    jobTitle: 'Head of Sales',
    recruitmentDate: new Date(2017, 3, 4),
    contract: 'full time',
    id: 1,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 11, 20),
    contract: 'full time',
    id: 2,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 10, 14),
    contract: 'part time',
    id: 3,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2017, 10, 29),
    contract: 'part time',
    id: 4,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 7, 21),
    contract: 'full time',
    id: 5,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 7, 20),
    contract: 'intern',
    id: 6,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2019, 6, 28),
    contract: 'full time',
    id: 7,
  },
  {
    jobTitle: 'Head of Engineering',
    recruitmentDate: new Date(2016, 3, 14),
    contract: 'full time',
    id: 8,
  },
  {
    jobTitle: 'Tech lead front',
    recruitmentDate: new Date(2016, 5, 17),
    contract: 'full time',
    id: 9,
  },
  {
    jobTitle: 'Front-end developer',
    recruitmentDate: new Date(2019, 11, 7),
    contract: 'full time',
    id: 10,
  },
  {
    jobTitle: 'Tech lead devops',
    recruitmentDate: new Date(2021, 7, 1),
    contract: 'full time',
    id: 11,
  },
  {
    jobTitle: 'Tech lead back',
    recruitmentDate: new Date(2017, 0, 12),
    contract: 'full time',
    id: 12,
  },
  {
    jobTitle: 'Back-end developer',
    recruitmentDate: new Date(2019, 2, 22),
    contract: 'intern',
    id: 13,
  },
  {
    jobTitle: 'Back-end developer',
    recruitmentDate: new Date(2018, 4, 19),
    contract: 'part time',
    id: 14,
  },
];

const columns: GridColDef[] = [
  { field: 'jobTitle', headerName: 'Job Title', width: 200 },
  {
    field: 'recruitmentDate',
    headerName: 'Recruitment Date',
    type: 'date',
    width: 150,
  },
  {
    field: 'contract',
    headerName: 'Contract Type',
    type: 'singleSelect',
    valueOptions: ['full time', 'part time', 'intern'],
    width: 150,
  },
];

export default function PageSizeAutoPremium() {
  return (
    <div style={{ height: 320, width: '100%' }}>
      <DataGridPremium pagination rows={rows} columns={columns} autoPageSize />
    </div>
  );
}

```

## Size of the page

The Data Grid (MIT license) is limited to pages of up to 100 rows.
If you want larger pages, you will need to upgrade to [Pro plan](/x/introduction/licensing/#pro-plan) or above.

By default, each page contains 100 rows. The user can change the size of the page through the selector in the footer.

### Page size options

You can customize the options shown in the "Rows per page" select using the `pageSizeOptions` prop.
You should provide an array of items, each item should be one of these types:

- **number**, each number will be used for the option's label and value.

  ```jsx
  <DataGrid pageSizeOptions={[5, 10, 25]}>
  ```

- **object**, the `value` and `label` keys will be used respectively for the value and label of the option. Define `value` as `-1` to display all results.

  ```jsx
  <DataGrid pageSizeOptions={[10, 100, { value: 1000, label: '1,000' }, { value: -1, label: 'All' }]}>
  ```

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function PageSizeCustomOptions() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        initialState={{
          ...data.initialState,
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
      />
    </div>
  );
}

```

### Automatic page size

Use the `autoPageSize` prop to auto-scale the `pageSize` to match the container height and the max number of rows that can be displayed without a vertical scroll bar.

:::warning
You cannot use both the `autoPageSize` and `autoHeight` props at the same time because `autoHeight` scales the height of the Data Grid according to the `pageSize`.
:::

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

export default function PageSizeAuto() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [height, setHeight] = React.useState(400);

  return (
    <Stack style={{ width: '100%' }} alignItems="flex-start" spacing={2}>
      <FormControl fullWidth>
        <InputLabel htmlFor="height-of-container" id="height-of-container-label">
          Height of the container
        </InputLabel>
        <Select
          label="Main Grouping Criteria"
          onChange={(event) => setHeight(Number(event.target.value))}
          value={height}
          id="height-of-container"
          labelId="height-of-container-label"
        >
          <MenuItem value="300">300px</MenuItem>
          <MenuItem value="400">400px</MenuItem>
          <MenuItem value="500">500px</MenuItem>
        </Select>
      </FormControl>
      <div style={{ height, width: '100%' }}>
        <DataGrid autoPageSize {...data} loading={loading} />
      </div>
    </Stack>
  );
}

```

## Pagination model

The pagination model is an object containing the current page and the size of the page. The default value is `{ page: 0, pageSize: 100 }`. To change the default value, make it controlled by `paginationModel` prop or initialize a custom value using `initialState.pagination.paginationModel`.

### Initializing the pagination model

To initialize the pagination model without controlling it, provide the `paginationModel` to the `initialState` prop. If you don't provide a value for one of the properties, the default value will be used.

```tsx
<DataGrid
  initialState={{
    pagination: {
      paginationModel: { pageSize: 25, page: 0 },
    },
  }}
/>
```

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function PaginationModelInitialState() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 500,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        initialState={{
          ...data.initialState,
          pagination: {
            ...data.initialState?.pagination,
            paginationModel: {
              pageSize: 25,
              /* page: 0 // default value will be used if not passed */
            },
          },
        }}
      />
    </div>
  );
}

```

### Controlled pagination model

Pass the `paginationModel` prop to control the size and current page of the grid. You can use the `onPaginationModelChange` prop to listen to changes to the `paginationModel` and update the prop accordingly.

```tsx
const [paginationModel, setPaginationModel] = React.useState({
  pageSize: 25,
  page: 0,
});

<DataGrid
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
/>;
```

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function PaginationModelControlled() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 500,
    maxColumns: 6,
  });
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        {...data}
        loading={loading}
      />
    </div>
  );
}

```

## Server-side pagination

By default, the pagination is handled on the client.
This means you have to give the rows of all pages to the Data Grid.
If your dataset is too big, and you want to fetch the pages on demand, you can use server-side pagination.

:::warning
If you enable server-side pagination with no other server-side features, then the Data Grid will only be provided with partial data for filtering and sorting.
To be able to work with the entire dataset, you must also implement [server-side filtering](/x/react-data-grid/filtering/server-side/) and [server-side sorting](/x/react-data-grid/sorting/#server-side-sorting).
The demo below does exactly that.
:::

```tsx
import * as React from 'react';
import { DataGrid, GridSortModel, GridFilterModel } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';

const SERVER_OPTIONS = {
  useCursorPagination: false,
};

const { useQuery, ...data } = createFakeServer({}, SERVER_OPTIONS);

export default function ServerPaginationFilterSortGrid() {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
  });
  const queryOptions = React.useMemo(
    () => ({ ...paginationModel, sortModel, filterModel }),
    [paginationModel, sortModel, filterModel],
  );
  const { isLoading, rows, pageInfo } = useQuery(queryOptions);

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCount` from being undefined during the loading
  const rowCountRef = React.useRef(pageInfo?.totalRowCount || 0);

  const rowCount = React.useMemo(() => {
    if (pageInfo?.totalRowCount !== undefined) {
      rowCountRef.current = pageInfo.totalRowCount;
    }
    return rowCountRef.current;
  }, [pageInfo?.totalRowCount]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        {...data}
        rowCount={rowCount}
        loading={isLoading}
        pageSizeOptions={[5]}
        paginationModel={paginationModel}
        sortModel={sortModel}
        filterModel={filterModel}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={setSortModel}
        onFilterModelChange={setFilterModel}
      />
    </div>
  );
}

```

In general, the server-side pagination could be categorized into two types:

- Index-based pagination
- Cursor-based pagination

:::info
Check out [Selection—Usage with server-side pagination](/x/react-data-grid/row-selection/#usage-with-server-side-pagination) for more details.
:::

### Index-based pagination

The index-based pagination uses the `page` and `pageSize` to fetch the data from the server page by page.

To enable server-side pagination, you need to:

- Set the `paginationMode` prop to `server`
- Use the `onPaginationModelChange` prop to react to the page changes and load the data from the server

The server-side pagination can be further categorized into sub-types based on the availability of the total number of rows or `rowCount`.

The Data Grid uses the `rowCount` to calculate the number of pages and to show the information about the current state of the pagination in the footer.
You can provide the `rowCount` in one of the following ways:

- **Initialize.**
  Use the `initialState.pagination.rowCount` prop to initialize the `rowCount`.
- **Control.**
  Use the `rowCount` prop along with `onRowCountChange` to control the `rowCount` and reflect the changes when the row count is updated.
- **Set using the API.**
  Use the `apiRef.current.setRowCount` method to set the `rowCount` after the Grid is initialized.

There can be three different possibilities regarding the availability of the `rowCount` on the server-side:

1. Row count is available (known)
2. Row count is not available (unknown)
3. Row count is available but is not accurate and may update later on (estimated)

:::warning
The `rowCount` prop is used in server-side pagination mode to inform the DataGrid about the total number of rows in your dataset.
This prop is ignored when the `paginationMode` is set to `client`, that is when the pagination is handled on the client-side.
:::

You can configure `rowCount`, `paginationMeta.hasNextPage`, and `estimatedRowCount` props to handle the above scenarios.

|                     | `rowCount` | `paginationMeta.hasNextPage` | `estimatedRowCount` |
| :------------------ | :--------- | :--------------------------- | :------------------ |
| Known row count     | `number`   | —                            | —                   |
| Unknown row count   | `-1`       | `boolean`                    | —                   |
| Estimated row count | `-1`       | `boolean`                    | `number`            |

#### Known row count

Pass the props to the Data Grid as explained in the table above to handle the case when the actual row count is known, as the following example demonstrates.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';

const SERVER_OPTIONS = {
  useCursorPagination: false,
};

const { useQuery, ...data } = createFakeServer({}, SERVER_OPTIONS);

export default function ServerPaginationGrid() {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  const { isLoading, rows, pageInfo } = useQuery(paginationModel);

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCount` from being undefined during the loading
  const rowCountRef = React.useRef(pageInfo?.totalRowCount || 0);

  const rowCount = React.useMemo(() => {
    if (pageInfo?.totalRowCount !== undefined) {
      rowCountRef.current = pageInfo.totalRowCount;
    }
    return rowCountRef.current;
  }, [pageInfo?.totalRowCount]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        {...data}
        rowCount={rowCount}
        loading={isLoading}
        pageSizeOptions={[5]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
      />
    </div>
  );
}

```

:::warning
If the value `rowCount` becomes `undefined` during loading, it will reset the page to zero.
To avoid this issue, you can memoize the `rowCount` value to ensure it doesn't change during loading:

```jsx
const rowCountRef = React.useRef(pageInfo?.totalRowCount || 0);

const rowCount = React.useMemo(() => {
  if (pageInfo?.totalRowCount !== undefined) {
    rowCountRef.current = pageInfo.totalRowCount;
  }
  return rowCountRef.current;
}, [pageInfo?.totalRowCount]);

<DataGrid rowCount={rowCount} />;
```

:::

#### Unknown row count

Pass the props to the Data Grid as explained in the table above to handle the case when the actual row count is unknown, as the following example demonstrates.

```tsx
import * as React from 'react';
import { DataGrid, GridPaginationMeta, useGridApiRef } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';

const SERVER_OPTIONS = {
  useCursorPagination: false,
};

const rowLength = 98;

const { useQuery, ...data } = createFakeServer({ rowLength }, SERVER_OPTIONS);

export default function ServerPaginationGridNoRowCount() {
  const apiRef = useGridApiRef();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  const {
    isLoading,
    rows,
    pageInfo: { hasNextPage },
  } = useQuery(paginationModel);

  const paginationMetaRef = React.useRef<GridPaginationMeta>(undefined);

  // Memoize to avoid flickering when the `hasNextPage` is `undefined` during refetch
  const paginationMeta = React.useMemo(() => {
    if (
      hasNextPage !== undefined &&
      paginationMetaRef.current?.hasNextPage !== hasNextPage
    ) {
      paginationMetaRef.current = { hasNextPage };
    }
    return paginationMetaRef.current;
  }, [hasNextPage]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        {...data}
        initialState={{ ...data.initialState, pagination: { rowCount: -1 } }}
        paginationMeta={paginationMeta}
        loading={isLoading}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
      />
    </div>
  );
}

```

:::warning
The value of the `hasNextPage` variable might become `undefined` during loading if it's handled by some external fetching hook resulting in unwanted computations, one possible solution could be to memoize the `paginationMeta`:

```tsx
const paginationMetaRef = React.useRef<GridPaginationMeta>();

const paginationMeta = React.useMemo(() => {
  if (
    hasNextPage !== undefined &&
    paginationMetaRef.current?.hasNextPage !== hasNextPage
  ) {
    paginationMetaRef.current = { hasNextPage };
  }
  return paginationMetaRef.current;
}, [hasNextPage]);
```

:::

#### Estimated row count

Estimated row count could be considered a hybrid approach that switches between the "Known row count" and "Unknown row count" use cases.

Initially, when an `estimatedRowCount` is set and `rowCount={-1}`, the Data Grid behaves as in the "Unknown row count" use case, but with the `estimatedRowCount` value shown in the pagination footer.

If the number of rows loaded exceeds the `estimatedRowCount`, the Data Grid ignores the `estimatedRowCount` and the behavior is identical to the "Unknown row count" use case.

When the `hasNextPage` returns `false` or `rowCount` is set to a positive number, the Data Grid switches to the "Known row count" behavior.

In the following example, the actual row count is `1000` but the Data Grid is initially provided with `estimatedRowCount={100}`.
You can set the `rowCount` to the actual row count by pressing the "Set Row Count" button.

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import type { GridPaginationMeta } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';

const SERVER_OPTIONS = {
  useCursorPagination: false,
};

const { useQuery, ...data } = createFakeServer({ rowLength: 1000 }, SERVER_OPTIONS);

export default function ServerPaginationGridEstimated() {
  const apiRef = useGridApiRef();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 50,
  });

  const {
    isLoading,
    rows,
    pageInfo: { hasNextPage },
  } = useQuery(paginationModel);

  const paginationMetaRef = React.useRef<GridPaginationMeta>({});
  // Memoize to avoid flickering when the `hasNextPage` is `undefined` during refetch
  const paginationMeta = React.useMemo(() => {
    if (
      hasNextPage !== undefined &&
      paginationMetaRef.current?.hasNextPage !== hasNextPage
    ) {
      paginationMetaRef.current = { hasNextPage };
    }
    return paginationMetaRef.current;
  }, [hasNextPage]);

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => apiRef.current?.setRowCount(1000)}>
        Set Row Count
      </Button>
      <div style={{ height: 400 }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          {...data}
          initialState={{ ...data.initialState, pagination: { rowCount: -1 } }}
          estimatedRowCount={100}
          paginationMeta={paginationMeta}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50, 100]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
        />
      </div>
    </div>
  );
}

```

:::warning
The `hasNextPage` must not be set to `false` until there are _actually_ no records left to fetch, because when `hasNextPage` becomes `false`, the Grid considers this as the last page and tries to set the `rowCount` value to a finite value.

If an external data fetching library sets the values to undefined during loading, you can memoize the `paginationMeta` value to ensure it doesn't change during loading as shown in the "Unknown row count" section.
:::

:::info

🌍 **Localization of the estimated row count**

The Data Grid uses the [Table Pagination](/material-ui/api/table-pagination/) component from the Material UI library which doesn't support `estimated` row count. Until this is supported natively by the Table Pagination component, a workaround to make the localization work is to provide the `labelDisplayedRows` function to the `localeText.MuiTablePagination` property as per the locale you are interested in.

The Grid injects an additional variable `estimated` to the `labelDisplayedRows` function which you can use to accommodate the estimated row count.
The following example demonstrates how to show the estimated row count in the pagination footer in the Croatian (hr-HR) language.

```jsx
const labelDisplayedRows = ({ from, to, count, estimated }) => {
  if (!estimated) {
    return `${from}–${to} od ${count !== -1 ? count : `više nego ${to}`}`;
  }
  const estimateLabel =
    estimated && estimated > to ? `oko ${estimated}` : `više nego ${to}`;
  return `${from}–${to} od ${count !== -1 ? count : estimateLabel}`;
};

<DataGrid
  {...data}
  localeText={{
    MuiTablePagination: {
      labelDisplayedRows,
    },
  }}
/>;
```

For more information, see the [Translation keys](/x/react-data-grid/localization/#translation-keys) section of the localization documentation.

:::

### Cursor-based pagination

You can also handle servers with cursor-based pagination.
To do so, you just have to keep track of the next cursor associated with each page you fetched.

```tsx
import * as React from 'react';
import {
  DataGrid,
  GridRowId,
  GridPaginationModel,
  GridPaginationMeta,
} from '@mui/x-data-grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { createFakeServer } from '@mui/x-data-grid-generator';

const PAGE_SIZE = 5;

const SERVER_OPTIONS = {
  useCursorPagination: true,
};

const { useQuery, ...data } = createFakeServer({}, SERVER_OPTIONS);

type RowCountType = 'known' | 'unknown' | 'estimated';

export default function CursorPaginationGrid() {
  const [rowCountType, setRowCountType] = React.useState<RowCountType>('known');

  const mapPageToNextCursor = React.useRef<{ [page: number]: GridRowId }>({});

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const queryOptions = React.useMemo(
    () => ({
      cursor: mapPageToNextCursor.current[paginationModel.page - 1],
      pageSize: paginationModel.pageSize,
    }),
    [paginationModel],
  );
  const {
    isLoading,
    rows,
    pageInfo: { hasNextPage, nextCursor, totalRowCount },
  } = useQuery(queryOptions);

  const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
    // We have the cursor, we can allow the page transition.
    if (
      newPaginationModel.page === 0 ||
      mapPageToNextCursor.current[newPaginationModel.page - 1]
    ) {
      setPaginationModel(newPaginationModel);
    }
  };

  const paginationMetaRef = React.useRef<GridPaginationMeta>(undefined);

  // Memoize to avoid flickering when the `hasNextPage` is `undefined` during refetch
  const paginationMeta = React.useMemo(() => {
    if (
      hasNextPage !== undefined &&
      paginationMetaRef.current?.hasNextPage !== hasNextPage
    ) {
      paginationMetaRef.current = { hasNextPage };
    }
    return paginationMetaRef.current;
  }, [hasNextPage]);

  React.useEffect(() => {
    if (!isLoading && nextCursor) {
      // We add nextCursor when available
      mapPageToNextCursor.current[paginationModel.page] = nextCursor;
    }
  }, [paginationModel.page, isLoading, nextCursor]);

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = React.useState(totalRowCount || 0);
  React.useEffect(() => {
    if (rowCountType === 'known') {
      setRowCountState((prevRowCountState) =>
        totalRowCount !== undefined ? totalRowCount : prevRowCountState,
      );
    }
    if (
      (rowCountType === 'unknown' || rowCountType === 'estimated') &&
      paginationMeta?.hasNextPage !== false
    ) {
      setRowCountState(-1);
    }
  }, [paginationMeta?.hasNextPage, rowCountType, totalRowCount]);

  const prevEstimatedRowCount = React.useRef<number | undefined>(undefined);
  const estimatedRowCount = React.useMemo(() => {
    if (rowCountType === 'estimated') {
      if (totalRowCount !== undefined) {
        if (prevEstimatedRowCount.current === undefined) {
          prevEstimatedRowCount.current = totalRowCount / 2;
        }
        return totalRowCount / 2;
      }
      return prevEstimatedRowCount.current;
    }
    return undefined;
  }, [rowCountType, totalRowCount]);

  return (
    <div style={{ width: '100%' }}>
      <FormControl>
        <FormLabel id="demo-cursor-pagination-buttons-group-label">
          Row count
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-cursor-pagination-buttons-group-label"
          name="cursor-pagination-buttons-group"
          value={rowCountType}
          onChange={(event) => setRowCountType(event.target.value as RowCountType)}
        >
          <FormControlLabel value="known" control={<Radio />} label="Known" />
          <FormControlLabel value="unknown" control={<Radio />} label="Unknown" />
          <FormControlLabel
            value="estimated"
            control={<Radio />}
            label="Estimated"
          />
        </RadioGroup>
      </FormControl>
      <div style={{ height: 400 }}>
        <DataGrid
          rows={rows}
          {...data}
          pageSizeOptions={[PAGE_SIZE]}
          rowCount={rowCountState}
          onRowCountChange={(newRowCount) => setRowCountState(newRowCount)}
          estimatedRowCount={estimatedRowCount}
          paginationMeta={paginationMeta}
          paginationMode="server"
          onPaginationModelChange={handlePaginationModelChange}
          paginationModel={paginationModel}
          loading={isLoading}
        />
      </div>
    </div>
  );
}

```

## Custom pagination UI

You can customize the rendering of the pagination in the footer following [the component section](/x/react-data-grid/components/#pagination) of the documentation.

## apiRef

The Data Grid exposes a set of methods via the `apiRef` object that are used internally in the implementation of the pagination feature.
The reference below describes the relevant functions.
See [API object](/x/react-data-grid/api-object/) for more details.

:::warning
This API should only be used as a last resort when the Data Grid's built-in props aren't sufficient for your specific use case.
:::

```jsx
import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-pagination-api.json';

export default function PaginationApiNoSnap() {
  return <ApiDocs api={api} />;
}

```

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "Pagination"}}

More information about the selectors and how to use them on the [dedicated page](/x/react-data-grid/state/#access-the-state)

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
