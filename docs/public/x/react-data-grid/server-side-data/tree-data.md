---
title: Data Grid - Server-side tree data
---

# Data Grid - Server-side tree data [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

Implement lazy-loading server-side tree data in the Data Grid using the Data Source layer.

Trees are hierarchical data structures that organize data into parent-child relationships.
The Data Grid Pro can handle server-side tree data to render grouped rows with nested children using the [Data Source layer](/x/react-data-grid/server-side-data/#the-solution-the-data-source-layer).

:::info
For tree data on the client side, see [Tree data (client side)](/x/react-data-grid/tree-data/).
:::

## Prerequisites

Server-side tree data functionality is an extension of its client-side counterpart, so we recommend reviewing [Tree data (client side)](/x/react-data-grid/tree-data/) to understand the underlying data structures and core implementation before proceeding.

To be able to dynamically load tree data from the server, including lazy-loading of children, you must create a Data Source and pass the `dataSource` prop to the Data Grid, as detailed in the [Server-side data overview](/x/react-data-grid/server-side-data/).

## Implementing server-side tree data

The Data Source requires the following props to handle tree data:

- `getGroupKey()`: Returns the group key for the row.
- `getChildrenCount()`: Returns the number of children for the row; returns `-1` if there are children present but the count is not available.

```tsx
const customDataSource: GridDataSource = {
  getRows: async (params) => {
    // Fetch the data from the server
  },
  getGroupKey: (row) => {
    // Return the group key for the row, e.g. `name`
    return row.name;
  },
  getChildrenCount: (row) => {
    // Return the number of children for the row
    return row.childrenCount;
  },
};
```

The `getRows()` callback receives a `groupKeys` parameter that corresponds to the keys provided for each nested level in `getGroupKey()`.
Use `groupKeys` on the server to extract the rows for a given nested level.

```tsx
const getRows: async (params) => {
  const urlParams = new URLSearchParams({
    // Example: JSON.stringify(['Billy Houston', 'Lora Dean'])
    groupKeys: JSON.stringify(params.groupKeys),
  });
  const getRowsResponse = await fetchRows(
    // Server should extract the rows for the nested level based on `groupKeys`
    `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
  );
  return {
    rows: getRowsResponse.rows,
    rowCount: getRowsResponse.rowCount,
  };
}
```

The following tree data example supports filtering, sorting, and pagination on the server.
It also caches the data by default.

```tsx
import * as React from 'react';
import {
  DataGridPro,
  useGridApiRef,
  GridInitialState,
  GridDataSource,
} from '@mui/x-data-grid-pro';
import Button from '@mui/material/Button';
import { useMockServer } from '@mui/x-data-grid-generator';

const pageSizeOptions = [5, 10, 50];
const dataSetOptions = {
  dataSet: 'Employee' as const,
  rowLength: 1000,
  editable: true,
  treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 5 },
};

export default function ServerSideTreeData() {
  const apiRef = useGridApiRef();

  const { fetchRows, editRow, columns, initialState } =
    useMockServer(dataSetOptions);

  const initialStateWithPagination: GridInitialState = React.useMemo(
    () => ({
      ...initialState,
      pagination: {
        paginationModel: {
          pageSize: 5,
        },
        rowCount: 0,
      },
    }),
    [initialState],
  );

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(params.groupKeys),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
      updateRow: async (params) => {
        const syncedRow = await editRow(params.rowId, params.updatedRow);
        return syncedRow;
      },
      getGroupKey: (row) => row[dataSetOptions.treeData.groupingField],
      getChildrenCount: (row) => row.descendantCount,
    }),
    [fetchRows, editRow],
  );

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => apiRef.current?.dataSource.cache.clear()}>
        Reset cache
      </Button>
      <div style={{ height: 400 }}>
        <DataGridPro
          columns={columns}
          dataSource={dataSource}
          treeData
          apiRef={apiRef}
          pagination
          pageSizeOptions={pageSizeOptions}
          initialState={initialStateWithPagination}
          showToolbar
        />
      </div>
    </div>
  );
}

```

:::info
The Data Source demos use a `useMockServer()` utility function to simulate server-side data fetching.
In a real-world scenario you would replace this with your own server-side data-fetching logic.

Open the Info section of your browser console to see the requests being made and the data being fetched in response.
:::

## Error handling

For each row group expansion, the Data Source is called to fetch the children.
If an error occurs during the fetch, the Data Grid displays an error message in the row group cell.
`onDataSourceError()` is also triggered with an error object containing the params described in [Server-side data overview—Error handling](/x/react-data-grid/server-side-data/#error-handling).

The demo below renders an error message and a notification at the row group level when the requests fail, which you can simulate using the checkbox and the **Refetch rows** button at the top.
Try expanding a row group with the checkbox enabled to see this behavior.
Caching has been disabled for simplicity.

```tsx
import * as React from 'react';
import {
  DataGridPro,
  useGridApiRef,
  GridInitialState,
  GridDataSource,
  GridGetRowsResponse,
  GridGetRowsError,
} from '@mui/x-data-grid-pro';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { alpha, styled, darken, lighten } from '@mui/material/styles';
import { useMockServer } from '@mui/x-data-grid-generator';

const pageSizeOptions = [5, 10, 50];
const serverOptions = { useCursorPagination: false };
const dataSetOptions = {
  dataSet: 'Employee' as 'Employee',
  rowLength: 1000,
  treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 5 },
};

export default function ServerSideTreeDataErrorHandling() {
  const apiRef = useGridApiRef();
  const [rootError, setRootError] = React.useState<string>();
  const [childrenError, setChildrenError] = React.useState<string>();
  const [shouldRequestsFail, setShouldRequestsFail] = React.useState(false);

  const { fetchRows, ...props } = useMockServer<GridGetRowsResponse>(
    dataSetOptions,
    serverOptions,
    shouldRequestsFail,
  );

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(params.groupKeys),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
      getGroupKey: (row) => row[dataSetOptions.treeData.groupingField],
      getChildrenCount: (row) => row.descendantCount,
    }),
    [fetchRows],
  );

  const initialState: GridInitialState = React.useMemo(
    () => ({
      ...props.initialState,
      pagination: {
        paginationModel: {
          pageSize: 5,
        },
        rowCount: 0,
      },
    }),
    [props.initialState],
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={() => {
            setRootError('');
            apiRef.current?.dataSource.fetchRows();
          }}
        >
          Refetch rows
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              checked={shouldRequestsFail}
              onChange={(event) => setShouldRequestsFail(event.target.checked)}
            />
          }
          label="Make the requests fail"
        />
      </div>
      <div style={{ height: 400, position: 'relative' }}>
        <DataGridPro
          {...props}
          treeData
          dataSource={dataSource}
          onDataSourceError={(error) => {
            if (error instanceof GridGetRowsError) {
              if (!error.params.groupKeys || error.params.groupKeys.length === 0) {
                setRootError(error.message);
              } else {
                setChildrenError(
                  `${error.message} (Requested level: ${error.params.groupKeys.join(' > ')})`,
                );
              }
            }
          }}
          dataSourceCache={null}
          apiRef={apiRef}
          pagination
          pageSizeOptions={pageSizeOptions}
          initialState={initialState}
        />
        {rootError && <ErrorOverlay error={rootError} />}
        <Snackbar
          open={!!childrenError}
          autoHideDuration={3000}
          onClose={() => setChildrenError('')}
          message={childrenError}
        />
      </div>
    </div>
  );
}

const StyledDiv = styled('div')(({ theme: t }) => ({
  position: 'absolute',
  zIndex: 10,
  fontSize: '0.875em',
  top: 0,
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  border: `1px solid ${lighten(alpha(t.palette.divider, 1), 0.88)}`,
  backgroundColor: t.palette.background.default,
  ...t.applyStyles('dark', {
    borderColor: darken(alpha(t.palette.divider, 1), 0.68),
  }),
}));

function ErrorOverlay({ error }: { error: string }) {
  if (!error) {
    return null;
  }
  return <StyledDiv>{error}</StyledDiv>;
}

```

## Group expansion

Group expansion of server-side tree data works similarly to how it's described in the [client-side row grouping documentation](/x/react-data-grid/row-grouping/#group-expansion).
The difference is that the data is not initially available and is fetched automatically after the Data Grid is mounted based on the `defaultGroupingExpansionDepth` and `isGroupExpandedByDefault()` props in a waterfall manner.

The following demo uses `defaultGroupingExpansionDepth={-1}` to expand all levels of the tree by default.

```tsx
import * as React from 'react';
import {
  DataGridPro,
  useGridApiRef,
  GridInitialState,
  GridDataSource,
} from '@mui/x-data-grid-pro';
import Button from '@mui/material/Button';
import { useMockServer } from '@mui/x-data-grid-generator';

type DataSet = 'Commodity' | 'Employee';

const pageSizeOptions = [5, 10, 50];
const dataSetOptions = {
  dataSet: 'Employee' as DataSet,
  rowLength: 1000,
  treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 5 },
};

export default function ServerSideTreeDataGroupExpansion() {
  const apiRef = useGridApiRef();

  const { fetchRows, columns, initialState } = useMockServer(dataSetOptions);

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(params.groupKeys),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
      getGroupKey: (row) => row[dataSetOptions.treeData.groupingField],
      getChildrenCount: (row) => row.descendantCount,
    }),
    [fetchRows],
  );

  const initialStateWithPagination: GridInitialState = React.useMemo(
    () => ({
      ...initialState,
      pagination: {
        paginationModel: {
          pageSize: 5,
        },
        rowCount: 0,
      },
    }),
    [initialState],
  );

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => apiRef.current?.dataSource.cache.clear()}>
        Reset cache
      </Button>
      <div style={{ height: 400 }}>
        <DataGridPro
          columns={columns}
          dataSource={dataSource}
          treeData
          apiRef={apiRef}
          pagination
          pageSizeOptions={pageSizeOptions}
          initialState={initialStateWithPagination}
          showToolbar
          defaultGroupingExpansionDepth={-1}
        />
      </div>
    </div>
  );
}

```

## Custom cache

The Data Source uses its own built-in cache by default to store fetched data.
Use the `dataSourceCache` prop to provide a custom cache if necessary.
See [Server-side data overview—Data caching](/x/react-data-grid/server-side-data/#data-caching) for more info.

The following demo uses `QueryClient` from `@tanstack/react-core` as a Data Source cache.

```tsx
import * as React from 'react';
import {
  DataGridPro,
  useGridApiRef,
  GridInitialState,
  GridDataSourceCache,
  GridDataSource,
  GridGetRowsParams,
} from '@mui/x-data-grid-pro';
import Button from '@mui/material/Button';
import { useMockServer } from '@mui/x-data-grid-generator';
import { QueryClient } from '@tanstack/query-core';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
    },
  },
});

function getKey(params: GridGetRowsParams) {
  return [
    params.paginationModel,
    params.sortModel,
    params.filterModel,
    params.groupKeys,
  ];
}

const cache: GridDataSourceCache = {
  set: (key: GridGetRowsParams, value) => {
    const queryKey = getKey(key);
    queryClient.setQueryData(queryKey, value);
  },
  get: (key: GridGetRowsParams) => {
    const queryKey = getKey(key);
    return queryClient.getQueryData(queryKey);
  },
  clear: () => {
    queryClient.clear();
  },
};

const pageSizeOptions = [5, 10, 50];
const dataSetOptions = {
  dataSet: 'Employee' as 'Employee',
  rowLength: 1000,
  treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 5 },
};

export default function ServerSideTreeDataCustomCache() {
  const apiRef = useGridApiRef();

  const { fetchRows, ...props } = useMockServer(dataSetOptions);

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(params.groupKeys),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
      getGroupKey: (row) => row[dataSetOptions.treeData.groupingField],
      getChildrenCount: (row) => row.descendantCount,
    }),
    [fetchRows],
  );

  const initialState: GridInitialState = React.useMemo(
    () => ({
      ...props.initialState,
      pagination: {
        paginationModel: {
          pageSize: 5,
        },
        rowCount: 0,
      },
    }),
    [props.initialState],
  );

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => queryClient.clear()}>Reset cache</Button>
      <div style={{ height: 400 }}>
        <DataGridPro
          {...props}
          dataSource={dataSource}
          dataSourceCache={cache}
          treeData
          apiRef={apiRef}
          pagination
          pageSizeOptions={pageSizeOptions}
          initialState={initialState}
          showToolbar
        />
      </div>
    </div>
  );
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
