---
title: React Data Grid component
githubLabel: 'scope: data grid'
packageName: '@mui/x-data-grid'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
---

# MUI X Data Grid

A fast and extensible React data table and React data grid, with filtering, sorting, aggregation, and more.



## Overview

The MUI X Data Grid is a TypeScript-based React component that presents information in a structured format of rows and columns.
It provides developers with an intuitive API for implementing complex use cases; and end users with a smooth experience for manipulating an unlimited set of data.

The Grid's theming features are designed to be frictionless when integrating with Material UI and other MUI X components, but it can also stand on its own and be customized to meet the needs of any design system.

The Data Grid is **open-core**: The Community version is MIT-licensed and free forever, while more advanced features require a Pro or Premium commercial license.
See [MUI X Licensing](/x/introduction/licensing/) for complete details.

## Community version (free forever)

```js
import { DataGrid } from '@mui/x-data-grid';
```

The MIT-licensed Community version of the Data Grid is a more sophisticated implementation of the [Material UI Table](/material-ui/react-table/).

It includes all of the main features listed in the navigation menu, such as editing, sorting, filtering, and pagination, as shown in the demo below:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
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

export default function DataGridDemo() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

```

## Pro version [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

```js
import { DataGridPro } from '@mui/x-data-grid-pro';
```

The Pro plan expands on the Community version to support more complex use cases with features like advanced filtering, column pinning, column and row reordering, support for tree data, and virtualization to handle larger datasets.
Pro features are denoted by the blue cube icon (<span class="plan-pro"></span>) throughout the documentation.

The demo below displays 31 columns and 100,000 rows—over three million cells in total:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function DataGridProDemo() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100000,
    editable: true,
  });

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        rowHeight={38}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

```

## Premium version [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

```js
import { DataGridPremium } from '@mui/x-data-grid-premium';
```

The Premium plan includes all Pro features as well as more advanced features for data analysis and large dataset management, such as row grouping with aggregation functions (like sum and average) and the ability to export to Excel files.
Premium features are denoted by the golden cube icon (<span class="plan-premium"></span>) throughout the documentation.

The demo below groups rows by commodity name, and uses an aggregation function to calculate the sum of quantities for each group and in total (displayed in a summary row).
You can experiment with grouping other columns in the column header menus.
You can also try exporting to Excel, and copying and pasting data to and from Excel tables.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGridPremium,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

const visibleFields = [
  'commodity',
  'quantity',
  'filledQuantity',
  'status',
  'isFilled',
  'unitPrice',
  'unitPriceCurrency',
  'subTotal',
  'feeRate',
  'feeAmount',
  'incoTerm',
];

export default function DataGridPremiumDemo() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    editable: true,
    visibleFields,
  });
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      ...data.initialState,
      rowGrouping: {
        ...data.initialState?.rowGrouping,
        model: ['commodity'],
      },
      sorting: {
        sortModel: [{ field: GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, sort: 'asc' }],
      },
      aggregation: {
        model: {
          quantity: 'sum',
        },
      },
    },
  });

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <DataGridPremium
        {...data}
        label="Data Grid Premium"
        apiRef={apiRef}
        loading={loading}
        disableRowSelectionOnClick
        initialState={initialState}
        showToolbar
      />
    </Box>
  );
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
