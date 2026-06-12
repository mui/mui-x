import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const columns = [
  { field: 'item', headerName: 'Item', width: 160 },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'total',
    headerName: 'Total',
    type: 'number',
    width: 160,
    allowFormulas: true,
    editable: true,
    valueFormatter: (value) =>
      typeof value === 'number' ? currencyFormatter.format(value) : value,
  },
];

const rows = [
  { id: 1, item: 'Keyboard', price: 89, quantity: 3, total: '=price * quantity' },
  { id: 2, item: 'Mouse', price: 45, quantity: 5, total: '=price * quantity' },
  { id: 3, item: 'Monitor', price: 320, quantity: 2, total: '=price * quantity' },
  {
    id: 4,
    item: 'Headset',
    price: 119,
    quantity: 4,
    total: '=ROUND(price * quantity * 0.9, 2)',
  },
  { id: 5, item: 'Shipping', price: 25, quantity: 1, total: 25 },
];

export default function FormulaBasic() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        initialState={{ aggregation: { model: { total: 'sum' } } }}
      />
    </div>
  );
}
