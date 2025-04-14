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
