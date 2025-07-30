---
title: Data Grid - Pivoting
---

# Data Grid - Pivoting [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

Rearrange rows and columns to view data from multiple perspectives.

The Data Grid Premium's pivoting feature lets users transform the data in their grid by reorganizing rows and columns, creating dynamic cross-tabulations of data.
This makes it possible to analyze data from different angles and gain insights that would be difficult to see in the default grid view.

:::success
If you're new to pivoting, check out the [Understanding pivoting](/x/react-data-grid/pivoting-explained/) page to learn how it works through interactive examples.
:::

:::warning
Pivoting performs certain computations and uses them to override corresponding props.
When pivot mode is active, the following props are ignored: `rows`, `columns`, `rowGroupingModel`, `aggregationModel`, `getAggregationPosition`, `columnVisibilityModel`, `columnGroupingModel`, `groupingColDef`, `headerFilters`, `disableRowGrouping`, and `disableAggregation`.
:::

## Quick start

Pivoting is enabled by default and can be accessed through the icon in the toolbar.
In the demo below, the pivot panel is already open and some pivoting parameters have been set.
Use the **Pivot** switch at the top of the panel to toggle pivoting off and on.
You can drag and drop existing columns in the **Rows**, **Columns**, and **Values** dropdown menus to change how the data is pivoted.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowModel,
  GridPivotModel,
  GridInitialState,
} from '@mui/x-data-grid-premium';

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
    enabled: true,
    model: pivotModel,
    panelOpen: true,
  },
};

export default function GridPivotingQuickStart() {
  return (
    <div style={{ height: 560, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        initialState={initialState}
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

## Pivot model

The pivot model is a configuration object that defines rows, columns, and values of the pivot Grid:

```tsx
interface GridPivotModel {
  rows: Array<{
    field: string;
    hidden?: boolean;
  }>;
  columns: Array<{
    field: string;
    sort?: 'asc' | 'desc';
    hidden?: boolean;
  }>;
  values: Array<{
    field: string;
    aggFunc: string;
    hidden?: boolean;
  }>;
}
```

## Initialize pivoting

Use the `initialState` prop to initialize uncontrolled pivoting.
This is the recommended method unless you specifically need to control the state.
You can initialize the pivot model, toggle pivot panel visibility, and toggle the pivot mode as shown below:

```tsx
<DataGridPremium
  initialState={{ pivoting: { model: pivotModel, active: true, panelOpen: true } }}
/>
```

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowModel,
  GridPivotModel,
  GridInitialState,
} from '@mui/x-data-grid-premium';

const rows: GridRowModel[] = [
  { id: 1, product: 'Apples', region: 'North', quarter: 'Q1', sales: 1000 },
  { id: 2, product: 'Apples', region: 'South', quarter: 'Q1', sales: 1200 },
  { id: 3, product: 'Oranges', region: 'North', quarter: 'Q1', sales: 800 },
  { id: 4, product: 'Oranges', region: 'South', quarter: 'Q1', sales: 900 },
  { id: 5, product: 'Apples', region: 'North', quarter: 'Q2', sales: 1100 },
  { id: 6, product: 'Apples', region: 'South', quarter: 'Q2', sales: 1300 },
  { id: 7, product: 'Oranges', region: 'North', quarter: 'Q2', sales: 850 },
  { id: 8, product: 'Oranges', region: 'South', quarter: 'Q2', sales: 950 },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

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
];

const pivotModel: GridPivotModel = {
  rows: [{ field: 'product' }],
  columns: [{ field: 'region' }, { field: 'quarter', sort: 'asc' }],
  values: [{ field: 'sales', aggFunc: 'sum' }],
};

const initialState: GridInitialState = {
  pivoting: {
    model: pivotModel,
    enabled: true,
    panelOpen: true,
  },
};

export default function GridPivotingInitialState() {
  return (
    <div style={{ height: 560, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        initialState={initialState}
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

```

## Controlled pivoting

For fully controlled pivoting state, you can use the following props:

- Pivot model:
  - `pivotModel`: Controls the current pivot configuration.
  - `onPivotModelChange`: Callback fired when the pivot model changes.
- Pivot mode toggle:
  - `pivotActive`: Controls whether pivot mode is active.
  - `onPivotActiveChange`: Callback fired when the pivot mode changes between active and inactive.
- Pivot panel:
  - `pivotPanelOpen`: Controls whether the pivot panel is open.
  - `onPivotPanelOpenChange`: Callback fired when the pivot panel is opened or closed.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowModel,
  GridPivotModel,
} from '@mui/x-data-grid-premium';

const rows: GridRowModel[] = [
  { id: 1, product: 'Apples', region: 'North', quarter: 'Q1', sales: 1000 },
  { id: 2, product: 'Apples', region: 'South', quarter: 'Q1', sales: 1200 },
  { id: 3, product: 'Oranges', region: 'North', quarter: 'Q1', sales: 800 },
  { id: 4, product: 'Oranges', region: 'South', quarter: 'Q1', sales: 900 },
  { id: 5, product: 'Apples', region: 'North', quarter: 'Q2', sales: 1100 },
  { id: 6, product: 'Apples', region: 'South', quarter: 'Q2', sales: 1300 },
  { id: 7, product: 'Oranges', region: 'North', quarter: 'Q2', sales: 850 },
  { id: 8, product: 'Oranges', region: 'South', quarter: 'Q2', sales: 950 },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

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
];

export default function GridPivotingControlled() {
  // Pivot model state
  const [pivotModel, setPivotModel] = React.useState<GridPivotModel>({
    rows: [{ field: 'product' }],
    columns: [{ field: 'region' }, { field: 'quarter', sort: 'asc' }],
    values: [{ field: 'sales', aggFunc: 'sum' }],
  });

  // Pivot mode toggle state
  const [pivotModeEnabled, setPivotModeEnabled] = React.useState(true);

  // Pivot panel visibility state
  const [pivotPanelOpen, setPivotPanelOpen] = React.useState(true);

  return (
    <div style={{ height: 560, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        pivotModel={pivotModel}
        onPivotModelChange={setPivotModel}
        pivotActive={pivotModeEnabled}
        onPivotActiveChange={setPivotModeEnabled}
        pivotPanelOpen={pivotPanelOpen}
        onPivotPanelOpenChange={setPivotPanelOpen}
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

```

## Using fields in the pivot model multiple times

While this is not supported yet, we are working to bring this feature to the Data Grid.

Subscribe to [this issue](https://github.com/mui/mui-x/issues/17302) to get notified when it's available.

## Disable pivoting

To disable pivoting feature completely, set the `disablePivoting` prop to `true`:

```tsx
<DataGridPremium disablePivoting />
```

### Disable pivoting for specific columns

To exclude specific column from pivoting, set the `pivotable: false` on its [column definition](/x/api/data-grid/grid-col-def/#grid-col-def-prop-pivotable):

```tsx
const columns: GridColDef[] = [{ field: 'id', pivotable: false }];

<DataGridPremium columns={columns} />;
```

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowModel,
  GridPivotModel,
  GridInitialState,
} from '@mui/x-data-grid-premium';

const rows: GridRowModel[] = [
  { id: 1, product: 'Apples', region: 'North', quarter: 'Q1', sales: 1000 },
  { id: 2, product: 'Apples', region: 'South', quarter: 'Q1', sales: 1200 },
  { id: 3, product: 'Oranges', region: 'North', quarter: 'Q1', sales: 800 },
  { id: 4, product: 'Oranges', region: 'South', quarter: 'Q1', sales: 900 },
  { id: 5, product: 'Apples', region: 'North', quarter: 'Q2', sales: 1100 },
  { id: 6, product: 'Apples', region: 'South', quarter: 'Q2', sales: 1300 },
  { id: 7, product: 'Oranges', region: 'North', quarter: 'Q2', sales: 850 },
  { id: 8, product: 'Oranges', region: 'South', quarter: 'Q2', sales: 950 },
];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', pivotable: false },
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
];

const pivotModel: GridPivotModel = {
  rows: [{ field: 'product' }],
  columns: [{ field: 'region' }, { field: 'quarter', sort: 'asc' }],
  values: [{ field: 'sales', aggFunc: 'sum' }],
};

const initialState: GridInitialState = {
  pivoting: {
    model: pivotModel,
    enabled: true,
    panelOpen: true,
  },
};

export default function GridNonPivotableColumns() {
  return (
    <div style={{ height: 560, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        initialState={initialState}
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

## Derived columns in pivot mode

In pivot mode, it's often useful to group data by a year or quarter.
The Data Grid automatically generates year and quarter columns for each **Date** column for this purpose.

For example, the sales dataset used throughout the examples has a **Quarter** column.
But in a real-world dataset, each sales record would typically have a precise **Transaction Date** field, as in the following demo.

The **Transaction Date** column is represented by additional columns in pivot mode: **Transaction Date (Year)** and **Transaction Date (Quarter)**:

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridPivotModel,
} from '@mui/x-data-grid-premium';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'transactionDate',
    type: 'date',
    headerName: 'Transaction Date',
    width: 140,
    valueGetter: (value) => new Date(value),
    groupingValueGetter: (value) => value,
  },
  { field: 'ticker', headerName: 'Ticker' },
  {
    field: 'price',
    type: 'number',
    headerName: 'Price',
    valueFormatter: (value: number | undefined) =>
      value ? `$${value.toFixed(2)}` : null,
  },
  { field: 'volume', type: 'number', headerName: 'Volume' },
  {
    field: 'type',
    type: 'singleSelect',
    valueOptions: ['stock', 'bond'],
    headerName: 'Type',
  },
];

const getYearField = (field: string) => `${field}-year`;
const getQuarterField = (field: string) => `${field}-quarter`;

const pivotModel: GridPivotModel = {
  rows: [{ field: 'ticker' }],
  columns: [
    { field: getYearField('transactionDate'), sort: 'asc' },
    { field: getQuarterField('transactionDate'), sort: 'asc' },
  ],
  values: [
    { field: 'price', aggFunc: 'avg' },
    { field: 'volume', aggFunc: 'sum' },
  ],
};

export default function GridPivotingFinancial() {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 560, width: '100%' }}>
        <DataGridPremium
          rows={rows}
          columns={columns}
          showToolbar
          initialState={{
            pivoting: {
              enabled: true,
              panelOpen: true,
              model: pivotModel,
            },
          }}
          columnGroupHeaderHeight={36}
          slotProps={{
            toolbar: {
              showQuickFilter: false,
            },
          }}
        />
      </div>
    </div>
  );
}

const rows = [
  {
    id: 1,
    transactionDate: '2024-05-15',
    ticker: 'AAPL',
    price: 192.45,
    volume: 5500,
    type: 'stock',
  },
  {
    id: 2,
    transactionDate: '2024-03-16',
    ticker: 'GOOGL',
    price: 125.67,
    volume: 3200,
    type: 'stock',
  },
  {
    id: 3,
    transactionDate: '2024-01-17',
    ticker: 'MSFT',
    price: 345.22,
    volume: 4100,
    type: 'stock',
  },
  {
    id: 4,
    transactionDate: '2023-12-18',
    ticker: 'AAPL',
    price: 193.1,
    volume: 6700,
    type: 'stock',
  },
  {
    id: 5,
    transactionDate: '2024-11-19',
    ticker: 'AMZN',
    price: 145.33,
    volume: 2900,
    type: 'stock',
  },
  {
    id: 6,
    transactionDate: '2024-03-20',
    ticker: 'GOOGL',
    price: 126.45,
    volume: 3600,
    type: 'stock',
  },
  {
    id: 7,
    transactionDate: '2024-08-21',
    ticker: 'US_TREASURY_2Y',
    price: 98.75,
    volume: 1000,
    type: 'bond',
  },
  {
    id: 8,
    transactionDate: '2024-05-22',
    ticker: 'MSFT',
    price: 347.89,
    volume: 4500,
    type: 'stock',
  },
  {
    id: 9,
    transactionDate: '2024-04-23',
    ticker: 'US_TREASURY_10Y',
    price: 95.6,
    volume: 750,
    type: 'bond',
  },
  {
    id: 10,
    transactionDate: '2024-03-24',
    ticker: 'AMZN',
    price: 146.22,
    volume: 3100,
    type: 'stock',
  },
];

```

### Custom derived columns

Use the `getPivotDerivedColumns` prop to customize derived columns.
This prop is called for each original column and returns an array of derived columns, or `undefined` if no derived columns are needed.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridColDef,
  GridPivotModel,
} from '@mui/x-data-grid-premium';

const getPivotDerivedColumns: DataGridPremiumProps['getPivotDerivedColumns'] = (
  column,
) => {
  if (column.type === 'date') {
    const field = column.field;
    return [
      {
        field: `${field}-year`,
        headerName: `${column.headerName} (Year)`,
        valueGetter: (value, row) => new Date(row[field]).getFullYear(),
      },

      {
        field: `${field}-month`,
        headerName: `${column.headerName} (Month)`,
        valueGetter: (value, row) =>
          `M${`${new Date(row[field]).getMonth() + 1}`.padStart(2, '0')}`,
      },
    ];
  }
  return undefined;
};
const getYearField = (field: string) => `${field}-year`;
const getMonthField = (field: string) => `${field}-month`;

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'transactionDate',
    type: 'date',
    headerName: 'Transaction Date',
    width: 140,
    valueGetter: (value) => new Date(value),
    groupingValueGetter: (value) => value,
  },
  { field: 'ticker', headerName: 'Ticker' },
  {
    field: 'price',
    type: 'number',
    headerName: 'Price',
    valueFormatter: (value: number | undefined) =>
      value ? `$${value.toFixed(2)}` : null,
  },
  { field: 'volume', type: 'number', headerName: 'Volume' },
  {
    field: 'type',
    type: 'singleSelect',
    valueOptions: ['stock', 'bond'],
    headerName: 'Type',
  },
];

const pivotModel: GridPivotModel = {
  rows: [{ field: 'ticker' }],
  columns: [
    { field: getYearField('transactionDate'), sort: 'asc' },
    { field: getMonthField('transactionDate'), sort: 'asc' },
  ],
  values: [
    { field: 'price', aggFunc: 'avg' },
    { field: 'volume', aggFunc: 'sum' },
  ],
};

export default function GridGetPivotDerivedColumns() {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 560, width: '100%' }}>
        <DataGridPremium
          rows={rows}
          columns={columns}
          getPivotDerivedColumns={getPivotDerivedColumns}
          initialState={{
            pivoting: {
              enabled: false,
              panelOpen: true,
              model: pivotModel,
            },
          }}
          showToolbar
          columnGroupHeaderHeight={36}
          slotProps={{
            toolbar: {
              showQuickFilter: false,
            },
          }}
        />
      </div>
    </div>
  );
}

const rows = [
  {
    id: 1,
    transactionDate: '2024-05-15',
    ticker: 'AAPL',
    price: 192.45,
    volume: 5500,
    type: 'stock',
  },
  {
    id: 2,
    transactionDate: '2024-03-16',
    ticker: 'GOOGL',
    price: 125.67,
    volume: 3200,
    type: 'stock',
  },
  {
    id: 3,
    transactionDate: '2024-01-17',
    ticker: 'MSFT',
    price: 345.22,
    volume: 4100,
    type: 'stock',
  },
  {
    id: 4,
    transactionDate: '2023-12-18',
    ticker: 'AAPL',
    price: 193.1,
    volume: 6700,
    type: 'stock',
  },
  {
    id: 5,
    transactionDate: '2024-11-19',
    ticker: 'AMZN',
    price: 145.33,
    volume: 2900,
    type: 'stock',
  },
  {
    id: 6,
    transactionDate: '2024-03-20',
    ticker: 'GOOGL',
    price: 126.45,
    volume: 3600,
    type: 'stock',
  },
  {
    id: 7,
    transactionDate: '2024-08-21',
    ticker: 'US_TREASURY_2Y',
    price: 98.75,
    volume: 1000,
    type: 'bond',
  },
  {
    id: 8,
    transactionDate: '2024-05-22',
    ticker: 'MSFT',
    price: 347.89,
    volume: 4500,
    type: 'stock',
  },
  {
    id: 9,
    transactionDate: '2024-04-23',
    ticker: 'US_TREASURY_10Y',
    price: 95.6,
    volume: 750,
    type: 'bond',
  },
  {
    id: 10,
    transactionDate: '2024-03-24',
    ticker: 'AMZN',
    price: 146.22,
    volume: 3100,
    type: 'stock',
  },
];

```

## Sticky column groups

Depending on the pivot mode, some column groups might exceed the width of the Data Grid viewport.
To improve the user experience, you can make these column groups "sticky" so that the column group labels remain visible while scrolling horizontally.

You can use the `sx` prop to apply the necessary styles:

```tsx
<DataGridPremium
  sx={{
    '& .MuiDataGrid-columnHeader--filledGroup': {
      '& .MuiDataGrid-columnHeaderTitleContainer': {
        overflow: 'visible',
      },
      '& .MuiDataGrid-columnHeaderTitleContainerContent': {
        position: 'sticky',
        left: 8,
      },
    },
  }}
/>
```

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridPivotModel,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

const pivotModel: GridPivotModel = {
  rows: [{ field: 'company' }],
  columns: [
    { field: 'year', sort: 'desc' },
    { field: 'cinematicUniverse', sort: 'asc' },
    { field: 'director', sort: 'asc' },
  ],
  values: [
    { field: 'gross', aggFunc: 'sum' },
    { field: 'imdbRating', aggFunc: 'avg' },
  ],
};

export default function GridPivotingMovies() {
  const movieData = useMovieData();
  const data = React.useMemo(() => {
    return {
      ...movieData,
      columns: [
        ...movieData.columns.map((col) => ({ ...col, editable: true })),
        { field: 'imdbRating', headerName: 'Rating', type: 'number' },
      ] as GridColDef[],
    };
  }, [movieData]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 560, width: '100%' }}>
        <DataGridPremium
          rows={data.rows}
          columns={data.columns}
          initialState={{
            pivoting: {
              enabled: true,
              model: pivotModel,
              panelOpen: false,
            },
          }}
          showToolbar
          columnGroupHeaderHeight={36}
          sx={{
            '& .MuiDataGrid-columnHeader--filledGroup': {
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                overflow: 'visible',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContent': {
                position: 'sticky',
                left: 8,
              },
            },
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: false,
            },
          }}
        />
      </div>
    </div>
  );
}

```

## Advanced demo

The following demo showcases pivoting on a larger Commodities dataset with over 30 different columns to choose for pivoting parameters.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  GridPivotModel,
  DataGridPremiumProps,
  GridInitialState,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

const pivotModel: GridPivotModel = {
  rows: [{ field: 'commodity' }],
  columns: [{ field: 'maturityDate-year', sort: 'asc' }, { field: 'status' }],
  values: [
    { field: 'quantity', aggFunc: 'sum' },
    { field: 'filledQuantity', aggFunc: 'avg' },
    { field: 'totalPrice', aggFunc: 'avg' },
  ],
};

const initialState: GridInitialState = {
  pivoting: {
    model: pivotModel,
    panelOpen: true,
  },
  pinnedColumns: {
    left: [GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD],
  },
};

export default function GridPivotingCommodities() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1_000,
    editable: true,
  });

  const [pivotActive, setPivotActive] = React.useState(false);

  const pivotingColDef = React.useMemo<
    DataGridPremiumProps['pivotingColDef']
  >(() => {
    return (originalColumnField) => {
      if (originalColumnField === 'quantity') {
        return { width: 80 };
      }
      return undefined;
    };
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 560, width: '100%' }}>
        <DataGridPremium
          rows={data.rows}
          columns={data.columns}
          showToolbar
          pivotActive={pivotActive}
          onPivotActiveChange={setPivotActive}
          initialState={initialState}
          loading={loading}
          columnGroupHeaderHeight={36}
          pivotingColDef={pivotingColDef}
          slotProps={{
            toolbar: {
              showQuickFilter: false,
            },
          }}
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
