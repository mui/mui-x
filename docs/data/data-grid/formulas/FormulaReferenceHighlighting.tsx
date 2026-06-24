import * as React from 'react';
import { DataGridPremium, GridColDef, GridRowsProp } from '@mui/x-data-grid-premium';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const columns: GridColDef[] = [
  { field: 'item', headerName: 'Item', width: 150 },
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
  {
    field: 'total',
    headerName: 'Total',
    type: 'number',
    width: 200,
    allowFormulas: true,
    editable: true,
    valueFormatter: (value) =>
      typeof value === 'number' ? currencyFormatter.format(value) : value,
  },
];

const rows: GridRowsProp = [
  { id: 1, item: 'Keyboard', price: 89, quantity: 3, total: '=price * quantity' },
  { id: 2, item: 'Mouse', price: 45, quantity: 5, total: '=price * quantity' },
  { id: 3, item: 'Monitor', price: 320, quantity: 2, total: '=price * quantity' },
  // A1 references: a range and a single cell, each colored in the editor and
  // outlined in the grid with a matching dashed rectangle.
  { id: 4, item: 'Grand total', price: 0, quantity: 0, total: '=SUM(D1:D3) + D3' },
];

export default function FormulaReferenceHighlighting() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGridPremium rows={rows} columns={columns} formulaA1Notation />
    </div>
  );
}
