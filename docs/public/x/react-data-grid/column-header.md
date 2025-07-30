# Data Grid - Column header

Customize your columns header.

You can configure the headers with:

- `headerName`: The title of the column rendered in the column header cell.
- `description`: The description of the column rendered as tooltip if the column header name is not fully displayed.

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

export default function HeaderColumnsGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[
          {
            field: 'username',
            headerName: 'Username',
            description:
              'The identification used by the person with access to the online service.',
          },
          { field: 'age', headerName: 'Age' },
        ]}
        rows={rows}
      />
    </div>
  );
}

```

## Custom header renderer

You can customize the look of each header with the `renderHeader` method.
It takes precedence over the `headerName` property.

```tsx
const columns: GridColDef[] = [
  {
    field: 'date',
    width: 150,
    type: 'date',
    renderHeader: (params: GridColumnHeaderParams) => (
      <strong>
        {'Birthday '}
        <span role="img" aria-label="enjoy">
          🎂
        </span>
      </strong>
    ),
  },
];
```

```tsx
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  {
    field: 'date',
    width: 150,
    type: 'date',
    renderHeader: () => (
      <strong>
        {'Birthday '}
        <span role="img" aria-label="enjoy">
          🎂
        </span>
      </strong>
    ),
  },
];

const rows = [
  {
    id: 1,
    date: new Date(1979, 0, 1),
  },
  {
    id: 2,
    date: new Date(1984, 1, 1),
  },
  {
    id: 3,
    date: new Date(1992, 2, 1),
  },
];

export default function RenderHeaderGrid() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

```

## Header height

By default, column headers have a height of 56 pixels. This matches the height from the [Material Design guidelines](https://m2.material.io/components/data-tables).

The `columnHeaderHeight` prop can be used to override the default value.

```tsx
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const rows = [
  {
    id: 1,
    username: '@MUI',
    age: 20,
  },
];

const columns: GridColDef[] = [
  {
    field: 'username',
    headerName: 'Username',
    description:
      'The identification used by the person with access to the online service.',
  },
  { field: 'age', headerName: 'Age' },
];

export default function HeaderHeight() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid columns={columns} rows={rows} columnHeaderHeight={36} />
    </div>
  );
}

```

## Styling header

You can check the [styling header](/x/react-data-grid/style/#styling-column-headers) section for more information.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
