import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowModel,
  GridPivotModel,
  GridInitialState,
} from '@mui/x-data-grid-premium';

const rows: GridRowModel[] = [
  { id: 1, product: 'Product 1', type: 'Type A', price: 10, quantity: 2 },
  { id: 2, product: 'Product 2', type: 'Type A', price: 12, quantity: 3 },
  { id: 3, product: 'Product 3', type: 'Type B', price: 8, quantity: 1 },
  { id: 4, product: 'Product 4', type: 'Type C', price: 20, quantity: 8 },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const columns: GridColDef[] = [
  { field: 'product' },
  { field: 'type' },
  {
    field: 'price',
    type: 'number',
    valueFormatter: (value) => {
      if (!value) {
        return '';
      }
      return currencyFormatter.format(value);
    },
  },
  { field: 'quantity', type: 'number' },
];

const pivotModel: GridPivotModel = {
  rows: [{ field: 'type' }],
  columns: [],
  values: [{ field: 'price', aggFunc: 'sum' }],
};

const initialState: GridInitialState = {
  pivoting: {
    model: pivotModel,
    enabled: true,
    panelOpen: true,
  },
};

export default function GridPivotingBasic() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        initialState={initialState}
        columnGroupHeaderHeight={36}
        showToolbar
        experimentalFeatures={{ pivoting: true }}
      />
    </div>
  );
}
