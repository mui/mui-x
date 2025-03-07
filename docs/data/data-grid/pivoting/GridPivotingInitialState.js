import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';

const rows = [
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

const columns = [
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

const pivotModel = {
  rows: [{ field: 'product' }],
  columns: [{ field: 'region' }, { field: 'quarter', sort: 'asc' }],
  values: [{ field: 'sales', aggFunc: 'sum' }],
};

const initialState = {
  pivoting: {
    model: pivotModel,
    enabled: true,
    panelOpen: true,
  },
};

export default function GridPivotingInitialState() {
  return (
    <div style={{ height: 450, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        initialState={initialState}
        columnGroupHeaderHeight={36}
        showToolbar
        experimentalFeatures={{ pivoting: true }}
        slotProps={{
          toolbar: {
            showQuickFilter: false,
          },
        }}
      />
    </div>
  );
}
