import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';

const columns = [
  { field: 'product', headerName: 'Product', width: 160 },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 100,
    editable: true,
  },
  {
    field: 'quantity',
    headerName: 'Qty',
    type: 'number',
    width: 80,
    editable: true,
  },
];

const rows = [
  { id: 1, product: 'Keyboard', price: 40, quantity: 3 },
  { id: 2, product: 'Mouse', price: 25, quantity: 10 },
  { id: 3, product: 'Monitor', price: 220, quantity: 2 },
  { id: 4, product: 'Cable', price: 5, quantity: 50 },
  { id: 5, product: 'Dock', price: 130, quantity: 1 },
];

const computedColumns = [
  {
    field: 'total',
    headerName: 'Total',
    formula: '=price * quantity',
    type: 'number',
    numberFormat: { style: 'currency', currency: 'USD' },
    editable: false,
  },
  {
    field: 'tax',
    headerName: 'Tax',
    formula: '=price * quantity * 0.2',
    type: 'number',
    numberFormat: { style: 'currency', currency: 'USD' },
  },
];

export default function ComputedColumnsReadOnly() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        featureDependencies={{ formula: formulaFeature }}
        rows={rows}
        columns={columns}
        initialState={{
          computedColumns: { model: computedColumns },
          pinnedColumns: { right: computedColumns.map((column) => column.field) },
        }}
        showToolbar
        rowSelection={false}
        disablePivoting
      />
    </div>
  );
}
