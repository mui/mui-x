---
title: Data Grid - Understanding pivoting
---

# Data Grid - Understanding pivoting [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

Rearrange rows and columns to view data from multiple perspectives.

## The purpose of pivoting

Pivoting gets its name from the idea of rotating data—for example, you might take a flat list of transactions with columns for product, region, and sales, and then pivot it to compare these values in different ways.
With pivoting, you could turn the unique product names into rows and the regions into columns, and aggregate the sales values to see the total sales per product per region.

You can explore this example use case in the demo below.
(This same flat dataset is used throughout this page to showcase key pivoting features.)

```tsx
import * as React from 'react';
import { DataGridPremium, GridColDef, GridRowModel } from '@mui/x-data-grid-premium';

const rows: GridRowModel[] = [
  {
    id: 1,
    product: 'Apples',
    region: 'North',
    quarter: 'Q1',
    sales: 1000,
    profit: 100,
    size: 'L',
  },
  {
    id: 2,
    product: 'Apples',
    region: 'South',
    quarter: 'Q1',
    sales: 1200,
    profit: 120,
    size: 'M',
  },
  {
    id: 3,
    product: 'Oranges',
    region: 'North',
    quarter: 'Q1',
    sales: 800,
    profit: 80,
    size: 'M',
  },
  {
    id: 4,
    product: 'Oranges',
    region: 'South',
    quarter: 'Q1',
    sales: 900,
    profit: 90,
    size: 'S',
  },
  {
    id: 5,
    product: 'Apples',
    region: 'North',
    quarter: 'Q2',
    sales: 1100,
    profit: 110,
    size: 'L',
  },
  {
    id: 6,
    product: 'Apples',
    region: 'South',
    quarter: 'Q2',
    sales: 1300,
    profit: 130,
    size: 'L',
  },
  {
    id: 7,
    product: 'Oranges',
    region: 'North',
    quarter: 'Q2',
    sales: 850,
    profit: 85,
    size: 'M',
  },
  {
    id: 8,
    product: 'Oranges',
    region: 'South',
    quarter: 'Q2',
    sales: 950,
    profit: 95,
    size: 'S',
  },
];

const columns: GridColDef[] = [
  { field: 'product', headerName: 'Product' },
  { field: 'size', headerName: 'Size' },
  { field: 'region', headerName: 'Region' },
  { field: 'quarter', headerName: 'Quarter' },
  {
    field: 'sales',
    headerName: 'Sales',
    type: 'number',
    valueFormatter: (value) => {
      if (!value) {
        return '';
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: 'profit',
    headerName: 'Profit',
    type: 'number',
    valueFormatter: (value) => {
      if (!value) {
        return '';
      }
      return `${value}%`;
    },
  },
];

export default function GridNonPivoted() {
  return (
    <div style={{ height: 560, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        columnGroupHeaderHeight={36}
        showToolbar
        slotProps={{
          toolbar: {
            showQuickFilter: false,
          },
        }}
      />
    </div>
  );
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

```

## Pivoting parameters

### Rows

The **Rows** menu defines how the data will be grouped vertically after pivoting.
Each unique value in the fields selected for rows will become a new row in the pivot Data Grid.
For example, if you pivot by **Product**, each unique product name will become a row.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowModel,
  GridPivotModel,
  GridInitialState,
} from '@mui/x-data-grid-premium';
import { pivotHeightlightStyles } from './pivotHighlightStyles';

const rows: GridRowModel[] = [
  {
    id: 1,
    product: 'Apples',
    region: 'North',
    quarter: 'Q1',
    sales: 1000,
    profit: 100,
    size: 'L',
  },
  {
    id: 2,
    product: 'Apples',
    region: 'South',
    quarter: 'Q1',
    sales: 1200,
    profit: 120,
    size: 'M',
  },
  {
    id: 3,
    product: 'Oranges',
    region: 'North',
    quarter: 'Q1',
    sales: 800,
    profit: 80,
    size: 'M',
  },
  {
    id: 4,
    product: 'Oranges',
    region: 'South',
    quarter: 'Q1',
    sales: 900,
    profit: 90,
    size: 'S',
  },
  {
    id: 5,
    product: 'Apples',
    region: 'North',
    quarter: 'Q2',
    sales: 1100,
    profit: 110,
    size: 'L',
  },
  {
    id: 6,
    product: 'Apples',
    region: 'South',
    quarter: 'Q2',
    sales: 1300,
    profit: 130,
    size: 'L',
  },
  {
    id: 7,
    product: 'Oranges',
    region: 'North',
    quarter: 'Q2',
    sales: 850,
    profit: 85,
    size: 'M',
  },
  {
    id: 8,
    product: 'Oranges',
    region: 'South',
    quarter: 'Q2',
    sales: 950,
    profit: 95,
    size: 'S',
  },
];

const columns: GridColDef[] = [
  { field: 'product', headerName: 'Product' },
  { field: 'size', headerName: 'Size' },
  { field: 'region', headerName: 'Region' },
  { field: 'quarter', headerName: 'Quarter' },
  {
    field: 'sales',
    headerName: 'Sales',
    type: 'number',
    valueFormatter: (value) => {
      if (!value) {
        return '';
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: 'profit',
    headerName: 'Profit',
    type: 'number',
    valueFormatter: (value) => {
      if (!value) {
        return '';
      }
      return `${value}%`;
    },
  },
];

const pivotModel: GridPivotModel = {
  rows: [{ field: 'product' }, { field: 'size', hidden: true }],
  columns: [],
  values: [],
};

const initialState: GridInitialState = {
  pivoting: {
    model: pivotModel,
    panelOpen: true,
  },
};

export default function GridPivotingRows() {
  const [pivotActive, setPivotActive] = React.useState(true);

  return (
    <div style={{ height: 560, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        initialState={initialState}
        columnGroupHeaderHeight={36}
        showToolbar
        pivotActive={pivotActive}
        onPivotActiveChange={setPivotActive}
        sx={pivotActive ? pivotHeightlightStyles : undefined}
        slotProps={{
          toolbar: {
            showQuickFilter: false,
          },
        }}
      />
    </div>
  );
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

```

If multiple fields are selected for rows, the rows will be grouped in the order of the selected fields.
For example, if you pivot with both **Product** and **Size** selected for rows, then each unique combination of the two will become a row in the pivot Data Grid.

### Values

The **Values** menu defines what data will be displayed in the cells of the pivot Data Grid.
These are typically numeric fields that can be aggregated (often into a sum, an average, or a total count).
For example, the demo below contains multiple rows for just two kinds of products: apples and oranges.
By selecting **Product** for the pivot rows and **Sales** for the pivot values, you can see the sum total of sales for each of the two products.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowModel,
  GridPivotModel,
  GridInitialState,
} from '@mui/x-data-grid-premium';
import { pivotHeightlightStyles } from './pivotHighlightStyles';

const rows: GridRowModel[] = [
  {
    id: 1,
    product: 'Apples',
    region: 'North',
    quarter: 'Q1',
    sales: 1000,
    profit: 100,
    size: 'L',
  },
  {
    id: 2,
    product: 'Apples',
    region: 'South',
    quarter: 'Q1',
    sales: 1200,
    profit: 120,
    size: 'M',
  },
  {
    id: 3,
    product: 'Oranges',
    region: 'North',
    quarter: 'Q1',
    sales: 800,
    profit: 80,
    size: 'M',
  },
  {
    id: 4,
    product: 'Oranges',
    region: 'South',
    quarter: 'Q1',
    sales: 900,
    profit: 90,
    size: 'S',
  },
  {
    id: 5,
    product: 'Apples',
    region: 'North',
    quarter: 'Q2',
    sales: 1100,
    profit: 110,
    size: 'L',
  },
  {
    id: 6,
    product: 'Apples',
    region: 'South',
    quarter: 'Q2',
    sales: 1300,
    profit: 130,
    size: 'L',
  },
  {
    id: 7,
    product: 'Oranges',
    region: 'North',
    quarter: 'Q2',
    sales: 850,
    profit: 85,
    size: 'M',
  },
  {
    id: 8,
    product: 'Oranges',
    region: 'South',
    quarter: 'Q2',
    sales: 950,
    profit: 95,
    size: 'S',
  },
];

const columns: GridColDef[] = [
  { field: 'product', headerName: 'Product' },
  { field: 'size', headerName: 'Size' },
  { field: 'region', headerName: 'Region' },
  { field: 'quarter', headerName: 'Quarter' },
  {
    field: 'sales',
    headerName: 'Sales',
    type: 'number',
    valueFormatter: (value) => {
      if (!value) {
        return '';
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: 'profit',
    headerName: 'Profit',
    type: 'number',
    valueFormatter: (value) => {
      if (!value) {
        return '';
      }
      return `${value}%`;
    },
  },
];

const pivotModel: GridPivotModel = {
  rows: [{ field: 'product' }, { field: 'size', hidden: true }],
  columns: [],
  values: [
    { field: 'sales', aggFunc: 'sum' },
    { field: 'profit', aggFunc: 'avg', hidden: true },
  ],
};

const initialState: GridInitialState = {
  pivoting: {
    model: pivotModel,
    panelOpen: true,
  },
};

export default function GridPivotingValues() {
  const [pivotActive, setPivotActive] = React.useState(true);

  return (
    <div style={{ height: 560, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        initialState={initialState}
        columnGroupHeaderHeight={36}
        showToolbar
        pivotActive={pivotActive}
        onPivotActiveChange={setPivotActive}
        sx={pivotActive ? pivotHeightlightStyles : undefined}
        slotProps={{
          toolbar: {
            showQuickFilter: false,
          },
        }}
      />
    </div>
  );
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

```

If multiple fields are selected for values, each field will add a new aggregated column to the pivot Data Grid.
For example, if you pivot with **Sales** and **Profit** for values, the pivot Data Grid will contain two corresponding aggregated columns.

### Columns

The **Columns** menu defines how the data will be grouped horizontally after pivoting.
Each unique value in the fields you select for columns will create a new column group in the pivot Data Grid.
For example, if you pivot by **Region** in the demo below, each unique region will become a column group in the pivot Data Grid.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowModel,
  GridPivotModel,
  GridInitialState,
} from '@mui/x-data-grid-premium';
import { pivotHeightlightStyles } from './pivotHighlightStyles';

const rows: GridRowModel[] = [
  {
    id: 1,
    product: 'Apples',
    region: 'North',
    quarter: 'Q1',
    sales: 1000,
    profit: 100,
    size: 'L',
  },
  {
    id: 2,
    product: 'Apples',
    region: 'South',
    quarter: 'Q1',
    sales: 1200,
    profit: 120,
    size: 'M',
  },
  {
    id: 3,
    product: 'Oranges',
    region: 'North',
    quarter: 'Q1',
    sales: 800,
    profit: 80,
    size: 'M',
  },
  {
    id: 4,
    product: 'Oranges',
    region: 'South',
    quarter: 'Q1',
    sales: 900,
    profit: 90,
    size: 'S',
  },
  {
    id: 5,
    product: 'Apples',
    region: 'North',
    quarter: 'Q2',
    sales: 1100,
    profit: 110,
    size: 'L',
  },
  {
    id: 6,
    product: 'Apples',
    region: 'South',
    quarter: 'Q2',
    sales: 1300,
    profit: 130,
    size: 'L',
  },
  {
    id: 7,
    product: 'Oranges',
    region: 'North',
    quarter: 'Q2',
    sales: 850,
    profit: 85,
    size: 'M',
  },
  {
    id: 8,
    product: 'Oranges',
    region: 'South',
    quarter: 'Q2',
    sales: 950,
    profit: 95,
    size: 'S',
  },
];

const columns: GridColDef[] = [
  { field: 'product', headerName: 'Product' },
  { field: 'size', headerName: 'Size' },
  { field: 'region', headerName: 'Region' },
  { field: 'quarter', headerName: 'Quarter' },
  {
    field: 'sales',
    headerName: 'Sales',
    type: 'number',
    valueFormatter: (value) => {
      if (!value) {
        return '';
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: 'profit',
    headerName: 'Profit',
    type: 'number',
    valueFormatter: (value) => {
      if (!value) {
        return '';
      }
      return `${value}%`;
    },
  },
];

const pivotModel: GridPivotModel = {
  rows: [{ field: 'product' }, { field: 'size', hidden: true }],
  columns: [{ field: 'region' }, { field: 'quarter', hidden: true }],
  values: [
    { field: 'sales', aggFunc: 'sum' },
    { field: 'profit', aggFunc: 'avg', hidden: true },
  ],
};

const initialState: GridInitialState = {
  pivoting: {
    model: pivotModel,
    panelOpen: true,
  },
};

export default function GridPivotingColumns() {
  const [pivotActive, setPivotActive] = React.useState(true);

  return (
    <div style={{ height: 560, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        initialState={initialState}
        columnGroupHeaderHeight={36}
        showToolbar
        pivotActive={pivotActive}
        onPivotActiveChange={setPivotActive}
        sx={pivotActive ? pivotHeightlightStyles : undefined}
        slotProps={{
          toolbar: {
            showQuickFilter: false,
          },
        }}
      />
    </div>
  );
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

```

If multiple fields are selected for columns, the columns will be grouped in the order of the selected fields.
For example, if you pivot with **Region** and **Quarter** for columns, each unique combination of the two will become a column in the pivot Grid.
Try selecting the **Quarter** checkbox in the **Columns** section in the demo above to see this.

## Pivoting in action

In the demo below, the goal is to evaluate sales by region and quarter for each product and size available.
To accomplish this, the dataset can be pivoted with **Product** and **Size** for rows; **Region** and **Quarter** for columns; and **Sales** and **Profit** for aggregated values.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowModel,
  GridPivotModel,
  GridInitialState,
} from '@mui/x-data-grid-premium';
import { pivotHeightlightStyles } from './pivotHighlightStyles';

const rows: GridRowModel[] = [
  {
    id: 1,
    product: 'Apples',
    region: 'North',
    quarter: 'Q1',
    sales: 1000,
    profit: 100,
    size: 'L',
  },
  {
    id: 2,
    product: 'Apples',
    region: 'South',
    quarter: 'Q1',
    sales: 1200,
    profit: 120,
    size: 'M',
  },
  {
    id: 3,
    product: 'Oranges',
    region: 'North',
    quarter: 'Q1',
    sales: 800,
    profit: 80,
    size: 'M',
  },
  {
    id: 4,
    product: 'Oranges',
    region: 'South',
    quarter: 'Q1',
    sales: 900,
    profit: 90,
    size: 'S',
  },
  {
    id: 5,
    product: 'Apples',
    region: 'North',
    quarter: 'Q2',
    sales: 1100,
    profit: 110,
    size: 'L',
  },
  {
    id: 6,
    product: 'Apples',
    region: 'South',
    quarter: 'Q2',
    sales: 1300,
    profit: 130,
    size: 'L',
  },
  {
    id: 7,
    product: 'Oranges',
    region: 'North',
    quarter: 'Q2',
    sales: 850,
    profit: 85,
    size: 'M',
  },
  {
    id: 8,
    product: 'Oranges',
    region: 'South',
    quarter: 'Q2',
    sales: 950,
    profit: 95,
    size: 'S',
  },
];

const columns: GridColDef[] = [
  { field: 'product', headerName: 'Product' },
  { field: 'region', headerName: 'Region' },
  { field: 'quarter', headerName: 'Quarter' },
  {
    field: 'sales',
    headerName: 'Sales',
    type: 'number',
    valueFormatter: (value) => {
      if (!value) {
        return '';
      }
      return currencyFormatter.format(value);
    },
  },
  {
    field: 'profit',
    headerName: 'Profit',
    type: 'number',
    valueFormatter: (value) => {
      if (!value) {
        return '';
      }
      return `${value}%`;
    },
  },
  {
    field: 'size',
    headerName: 'Size',
  },
];

const pivotModel: GridPivotModel = {
  rows: [{ field: 'product' }, { field: 'size' }],
  columns: [{ field: 'region' }, { field: 'quarter' }],
  values: [
    { field: 'sales', aggFunc: 'sum' },
    { field: 'profit', aggFunc: 'avg' },
  ],
};

const initialState: GridInitialState = {
  pivoting: {
    model: pivotModel,
    panelOpen: true,
  },
};

export default function GridPivotingMultipleValues() {
  const [pivotActive, setPivotActive] = React.useState(true);
  return (
    <div style={{ height: 560, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        initialState={initialState}
        columnGroupHeaderHeight={36}
        showToolbar
        pivotActive={pivotActive}
        onPivotActiveChange={setPivotActive}
        sx={pivotActive ? pivotHeightlightStyles : undefined}
        slotProps={{
          toolbar: {
            showQuickFilter: false,
          },
        }}
      />
    </div>
  );
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

```

## Next steps

Learn how to [implement pivoting](/x/react-data-grid/pivoting/) in your Data Grid.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
