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
