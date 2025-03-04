import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridPivotModel,
} from '@mui/x-data-grid-premium';

const rows = [
  {
    id: 1,
    date: '2024-05-15',
    ticker: 'AAPL',
    price: 192.45,
    volume: 5500,
    type: 'stock',
  },
  {
    id: 2,
    date: '2024-03-16',
    ticker: 'GOOGL',
    price: 125.67,
    volume: 3200,
    type: 'stock',
  },
  {
    id: 3,
    date: '2024-01-17',
    ticker: 'MSFT',
    price: 345.22,
    volume: 4100,
    type: 'stock',
  },
  {
    id: 4,
    date: '2023-12-18',
    ticker: 'AAPL',
    price: 193.1,
    volume: 6700,
    type: 'stock',
  },
  {
    id: 5,
    date: '2024-11-19',
    ticker: 'AMZN',
    price: 145.33,
    volume: 2900,
    type: 'stock',
  },
  {
    id: 6,
    date: '2024-03-20',
    ticker: 'GOOGL',
    price: 126.45,
    volume: 3600,
    type: 'stock',
  },
  {
    id: 7,
    date: '2024-08-21',
    ticker: 'US_TREASURY_2Y',
    price: 98.75,
    volume: 1000,
    type: 'bond',
  },
  {
    id: 8,
    date: '2024-05-22',
    ticker: 'MSFT',
    price: 347.89,
    volume: 4500,
    type: 'stock',
  },
  {
    id: 9,
    date: '2024-04-23',
    ticker: 'US_TREASURY_10Y',
    price: 95.6,
    volume: 750,
    type: 'bond',
  },
  {
    id: 10,
    date: '2024-03-24',
    ticker: 'AMZN',
    price: 146.22,
    volume: 3100,
    type: 'stock',
  },
];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'date',
    type: 'date',
    headerName: 'Date',
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

const getYearField = (field: string) => `${field}-year`;
const getQuarterField = (field: string) => `${field}-quarter`;

export default function GridPivotingFinancial() {
  const [pivotModel, setPivotModel] = React.useState<GridPivotModel>({
    rows: [{ field: 'ticker' }],
    columns: [
      { field: getYearField('date'), sort: 'asc' },
      { field: getQuarterField('date'), sort: 'asc' },
    ],
    values: [
      { field: 'price', aggFunc: 'avg' },
      { field: 'volume', aggFunc: 'sum' },
    ],
  });

  const [pivotMode, setPivotMode] = React.useState(true);
  const [pivotPanelOpen, setPivotPanelOpen] = React.useState(true);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 600, width: '100%' }}>
        <DataGridPremium
          rows={rows}
          columns={columns}
          showToolbar
          pivotModel={pivotModel}
          onPivotModelChange={setPivotModel}
          pivotEnabled={pivotMode}
          onPivotEnabledChange={setPivotMode}
          pivotPanelOpen={pivotPanelOpen}
          onPivotPanelOpenChange={setPivotPanelOpen}
          cellSelection
          columnGroupHeaderHeight={36}
          experimentalFeatures={{ pivoting: true }}
        />
      </div>
    </div>
  );
}
