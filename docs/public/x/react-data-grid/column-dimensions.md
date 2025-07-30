# Data Grid - Column dimensions

Customize the dimensions and resizing behavior of your columns.

## Column width

By default, the columns have a width of 100px.
This is an arbitrary, easy-to-remember value.
To change the width of a column, use the `width` property available in `GridColDef`.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
  {
    id: 1,
    username: '@MUI',
    age: 38,
  },
];

export default function ColumnWidthGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[{ field: 'username', width: 200 }, { field: 'age' }]}
        rows={rows}
      />
    </div>
  );
}

```

### Minimum width

By default, the columns have a minimum width of 50px.
This is an arbitrary, easy-to-remember value.
To change the minimum width of a column, use the `minWidth` property available in `GridColDef`.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
  {
    id: 1,
    username: '@MUI',
    age: 38,
  },
];

export default function ColumnMinWidthGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[{ field: 'username', minWidth: 150 }, { field: 'age' }]}
        rows={rows}
      />
    </div>
  );
}

```

### Fluid width

Column fluidity or responsiveness can be achieved by setting the `flex` property in `GridColDef`.

The `flex` property accepts a value between 0 and ∞.
It works by dividing the remaining space in the Data Grid among all flex columns in proportion to their `flex` value.

For example, consider a grid with a total width of 500px that has three columns: the first with `width: 200`; the second with `flex: 1`; and the third with `flex: 0.5`.
The first column will be 200px wide, leaving 300px remaining. The column with `flex: 1` is twice the size of `flex: 0.5`, which means that final sizes will be: 200px, 200px, 100px.

To set a minimum and maximum width for a `flex` column set the `minWidth` and the `maxWidth` property in `GridColDef`.

:::warning
Before using fluid width, note that:

- `flex` doesn't work together with `width`. If you set both `flex` and `width` in `GridColDef`, `flex` will override `width`.
- `flex` doesn't work if the combined width of the columns that have `width` is more than the width of the Data Grid itself. If that is the case a scroll bar will be visible, and the columns that have `flex` will default back to their base value of 100px.

:::

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
  {
    id: 1,
    username: '@MUI',
    age: 20,
  },
];

export default function ColumnFluidWidthGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[
          {
            field: 'id',
            flex: 1,
            minWidth: 150,
          },
          {
            field: 'username',
            width: 200,
          },
          {
            field: 'age',
            flex: 0.3,
            minWidth: 50,
          },
        ]}
        rows={rows}
      />
    </div>
  );
}

```

## Resizing

By default, Data Grid allows all columns to be resized by dragging the right portion of the column separator.

To prevent the resizing of a column, set `resizable: false` in the `GridColDef`.
Alternatively, to disable all columns resize, set the prop `disableColumnResize={true}`.

To restrict resizing a column under a certain width set the `minWidth` property in `GridColDef`.

To restrict resizing a column above a certain width set the `maxWidth` property in `GridColDef`.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
  {
    id: 1,
    username: '@MUI',
    age: 20,
  },
];

export default function ColumnSizingGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[
          { field: 'id' },
          { field: 'username', width: 125, minWidth: 150, maxWidth: 200 },
          { field: 'age', resizable: false },
        ]}
        rows={rows}
      />
    </div>
  );
}

```

To capture changes in the width of a column there are two callbacks that are called:

- `onColumnResize`: Called while a column is being resized.
- `onColumnWidthChange`: Called after the width of a column is changed, but not during resizing.

## Autosizing

Data Grid allows to autosize the columns' dimensions based on their content. Autosizing is enabled by default. To turn it off, pass the `disableAutosize` prop to the Data Grid.

Autosizing can be used by one of the following methods:

- Adding the `autosizeOnMount` prop,
- Double-clicking a column header separator on the grid,
- Calling the `apiRef.current.autosizeColumns(options)` API method.

You can pass options directly to the API method when you call it. To configure autosize for the other two methods, provide the options in the `autosizeOptions` prop.

Note that for the separator double-click method, the `autosizeOptions.columns` will be replaced by the respective column user double-clicked on.

In all the cases, the `colDef.minWidth` and `colDef.maxWidth` options will be respected.

```tsx
<DataGrid
  {...otherProps}
  autosizeOptions={{
    columns: ['name', 'status', 'createdBy'],
    includeOutliers: true,
    includeHeaders: false,
  }}
/>
```

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {
  DataGrid,
  useGridApiRef,
  DEFAULT_GRID_AUTOSIZE_OPTIONS,
} from '@mui/x-data-grid';
import { randomRating, randomTraderName } from '@mui/x-data-grid-generator';

function renderRating(params: any) {
  return <Rating readOnly value={params.value} />;
}

function useData(length: number) {
  return React.useMemo(() => {
    const names = [
      'Nike',
      'Adidas',
      'Puma',
      'Reebok',
      'Fila',
      'Lululemon Athletica Clothing',
      'Varley',
    ];
    const rows = Array.from({ length }).map((_, id) => ({
      id,
      brand: names[id % names.length],
      rep: randomTraderName(),
      rating: randomRating(),
    }));

    const columns = [
      { field: 'id', headerName: 'Brand ID' },
      { field: 'brand', headerName: 'Brand name' },
      { field: 'rep', headerName: 'Representative' },
      {
        field: 'rating',
        headerName: 'Rating',
        renderCell: renderRating,
        display: 'flex' as const,
      },
    ];

    return { rows, columns };
  }, [length]);
}

export default function ColumnAutosizing() {
  const apiRef = useGridApiRef();
  const data = useData(100);

  const [includeHeaders, setIncludeHeaders] = React.useState(
    DEFAULT_GRID_AUTOSIZE_OPTIONS.includeHeaders,
  );
  const [includeOutliers, setExcludeOutliers] = React.useState(
    DEFAULT_GRID_AUTOSIZE_OPTIONS.includeOutliers,
  );
  const [outliersFactor, setOutliersFactor] = React.useState(
    String(DEFAULT_GRID_AUTOSIZE_OPTIONS.outliersFactor),
  );
  const [expand, setExpand] = React.useState(DEFAULT_GRID_AUTOSIZE_OPTIONS.expand);

  const autosizeOptions = {
    includeHeaders,
    includeOutliers,
    outliersFactor: Number.isNaN(parseFloat(outliersFactor))
      ? 1
      : parseFloat(outliersFactor),
    expand,
  };

  return (
    <div style={{ width: '100%' }}>
      <Stack
        spacing={1}
        direction="row"
        alignItems="center"
        sx={{ mb: 1 }}
        useFlexGap
        flexWrap="wrap"
      >
        <Button
          variant="outlined"
          onClick={() => apiRef.current?.autosizeColumns(autosizeOptions)}
        >
          Autosize columns
        </Button>
        <FormControlLabel
          sx={{ ml: 0 }}
          control={
            <Checkbox
              checked={includeHeaders}
              onChange={(ev) => setIncludeHeaders(ev.target.checked)}
            />
          }
          label="Include headers"
        />
        <FormControlLabel
          sx={{ ml: 0 }}
          control={
            <Checkbox
              checked={includeOutliers}
              onChange={(event) => setExcludeOutliers(event.target.checked)}
            />
          }
          label="Include outliers"
        />
        <TextField
          size="small"
          label="Outliers factor"
          value={outliersFactor}
          onChange={(ev) => setOutliersFactor(ev.target.value)}
          sx={{ width: '12ch' }}
        />
        <FormControlLabel
          sx={{ ml: 0 }}
          control={
            <Checkbox
              checked={expand}
              onChange={(ev) => setExpand(ev.target.checked)}
            />
          }
          label="Expand"
        />
      </Stack>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          apiRef={apiRef}
          density="compact"
          {...data}
          autosizeOptions={autosizeOptions}
        />
      </div>
    </div>
  );
}

```

:::warning
The Data Grid can only autosize based on the currently rendered cells.

DOM access is required to accurately calculate dimensions, so unmounted cells (when [virtualization](/x/react-data-grid/virtualization/) is on) cannot be sized. If you need a bigger row sample, [open an issue](https://github.com/mui/mui-x/issues) to discuss it further.
:::

### Autosizing asynchronously

The `autosizeColumns` method from the `apiRef` can be used as well to adjust the column size on specified events, for example when receiving row data from the server.

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { DataGridPro, useGridApiRef, GridColDef } from '@mui/x-data-grid-pro';
import {
  randomInt,
  randomRating,
  randomTraderName,
} from '@mui/x-data-grid-generator';
import * as ReactDOM from 'react-dom';
import { GridData } from 'docsx/data/data-grid/virtualization/ColumnVirtualizationGrid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Brand ID' },
  { field: 'brand', headerName: 'Brand name' },
  { field: 'rep', headerName: 'Representative' },
  {
    field: 'rating',
    headerName: 'Rating',
    renderCell: renderRating,
    display: 'flex',
  },
];

function renderRating(params: any) {
  return <Rating readOnly value={params.value} />;
}

function getFakeData(length: number): Promise<{ rows: GridData['rows'] }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const names = [
        'Nike',
        'Adidas',
        'Puma',
        'Reebok',
        'Fila',
        'Lululemon Athletica Clothing',
        'Varley',
      ];
      const rows = Array.from({ length }).map((_, id) => ({
        id,
        brand: names[randomInt(0, names.length - 1)],
        rep: randomTraderName(),
        rating: randomRating(),
      }));

      resolve({ rows });
    }, 1000);
  });
}

export default function ColumnAutosizingAsync() {
  const apiRef = useGridApiRef();
  const [isLoading, setIsLoading] = React.useState(false);
  const [rows] = React.useState([]);

  const fetchData = React.useCallback(() => {
    setIsLoading(true);
    getFakeData(100)
      .then((data) => {
        ReactDOM.flushSync(() => {
          setIsLoading(false);
          apiRef.current?.updateRows(data.rows);
        });
      })
      // `sleep`/`setTimeout` is required because `.updateRows` is an
      // async function throttled to avoid choking on frequent changes.
      .then(() => sleep(0))
      .then(() =>
        apiRef.current?.autosizeColumns({
          includeHeaders: true,
          includeOutliers: true,
        }),
      );
  }, [apiRef]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ width: '100%' }}>
      <Stack
        spacing={1}
        direction="row"
        alignItems="center"
        sx={{ mb: 1 }}
        useFlexGap
        flexWrap="wrap"
      >
        <Button variant="outlined" onClick={fetchData}>
          Refetch data
        </Button>
      </Stack>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPro
          apiRef={apiRef}
          density="compact"
          columns={columns}
          rows={rows}
          loading={isLoading}
        />
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

```

:::warning
This example uses `ReactDOM.flushSync`. If used incorrectly it can hurt the performance of your application. Please refer to the official [React docs](https://react.dev/reference/react-dom/flushSync) for further information.
:::

### Autosizing with dynamic row height

Column autosizing is compatible with the [Dynamic row height](/x/react-data-grid/row-height/#dynamic-row-height) feature.

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import {
  DataGrid,
  GridColDef,
  gridClasses,
  useGridApiRef,
  GridAutosizeOptions,
} from '@mui/x-data-grid';
import { randomInt, randomArrayItem } from '@mui/x-data-grid-generator';

const lines = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Aliquam dapibus, lorem vel mattis aliquet, purus lorem tincidunt mauris, in blandit quam risus sed ipsum.',
  'Maecenas non felis venenatis, porta velit quis, consectetur elit.',
  'Vestibulum commodo et odio a laoreet.',
  'Nullam cursus tincidunt auctor.',
  'Sed feugiat venenatis nulla, sit amet dictum nulla convallis sit amet.',
  'Nulla venenatis justo non felis vulputate, eu mollis metus ornare.',
  'Nam ullamcorper ligula id consectetur auctor.',
  'Phasellus et ultrices dui.',
  'Fusce facilisis egestas massa, et eleifend magna imperdiet et.',
  'Pellentesque ac metus velit.',
  'Vestibulum in massa nibh.',
  'Vestibulum pulvinar aliquam turpis, ac faucibus risus varius a.',
];

const columns: GridColDef[] = [{ field: 'id' }, { field: 'bio', width: 400 }];

const rows: object[] = [];

for (let i = 0; i < 200; i += 1) {
  const bio = [];

  for (let j = 0; j < randomInt(1, 5); j += 1) {
    bio.push(randomArrayItem(lines));
  }

  rows.push({ id: i, bio: bio.join(' ') });
}

const autosizeOptions: GridAutosizeOptions = {
  includeOutliers: true,
};

export default function ColumnAutosizingDynamicRowHeight() {
  const apiRef = useGridApiRef();

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => apiRef.current?.autosizeColumns(autosizeOptions)}>
        Autosize Columns
      </Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          getRowHeight={() => 'auto'}
          autosizeOptions={autosizeOptions}
          sx={{
            [`& .${gridClasses.cell}`]: {
              py: 0.5,
            },
          }}
        />
      </div>
    </div>
  );
}

```

:::warning
When autosizing columns with long content, consider setting the `maxWidth` for the column to avoid it becoming too wide.
:::

### Autosizing with grouped rows [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

When using [row grouping](/x/react-data-grid/row-grouping/) you can utilize the `autosizeColumns` method to adjust the column width of the expanded rows dynamically.
The demo below shows how you can subscribe to the `rowExpansionChange` event. The provided handler function then calls the `autosizeColumns` method from the gridApi.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridGroupingColDefOverride,
  GridValidRowModel,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const groupingColDef: GridGroupingColDefOverride<GridValidRowModel> = {
  width: 250,
};

export default function ColumnAutosizingGroupedRows() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const columns = React.useMemo(() => {
    return data.columns.map((col) => ({ ...col, width: 50 }));
  }, [data.columns]);

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: { rowGrouping: { model: ['company'] } },
  });

  React.useEffect(() => {
    return apiRef.current?.subscribeEvent('rowExpansionChange', (params) => {
      if (params.childrenExpanded) {
        apiRef.current?.autosizeColumns({ includeOutliers: true });
      }
    });
  }, [apiRef]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        columns={columns}
        apiRef={apiRef}
        initialState={initialState}
        groupingColDef={groupingColDef}
      />
    </div>
  );
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
