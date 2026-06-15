import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowsProp,
  GRID_FORMULA_FUNCTIONS,
  GridFormulaFunctionDefinition,
} from '@mui/x-data-grid-premium';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// A custom function appears in the suggestion dropdown with the optional
// `signature`, `description` and `category` metadata it declares.
const DISCOUNT: GridFormulaFunctionDefinition = {
  name: 'DISCOUNT',
  minArgs: 2,
  maxArgs: 2,
  signature: 'DISCOUNT(amount, percent)',
  description: 'Subtracts a percentage from an amount.',
  category: 'Custom',
  apply: ([amount, percent], context) => {
    const base = context.coerce.toNumber(amount);
    const rate = context.coerce.toNumber(percent);
    if (typeof base !== 'number') {
      return base;
    }
    if (typeof rate !== 'number') {
      return rate;
    }
    return base * (1 - rate / 100);
  },
};

const formulaFunctions = { ...GRID_FORMULA_FUNCTIONS, DISCOUNT };

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
    width: 220,
    allowFormulas: true,
    editable: true,
    valueFormatter: (value) =>
      typeof value === 'number' ? currencyFormatter.format(value) : value,
  },
];

const rows: GridRowsProp = [
  { id: 1, item: 'Keyboard', price: 89, quantity: 3, total: '=price * quantity' },
  {
    id: 2,
    item: 'Mouse',
    price: 45,
    quantity: 5,
    total: '=DISCOUNT(price * quantity, 10)',
  },
  {
    id: 3,
    item: 'Monitor',
    price: 320,
    quantity: 2,
    total: '=ROUND(price * quantity, 2)',
  },
  {
    id: 4,
    item: 'Webcam',
    price: 60,
    quantity: 2,
    total: '=SUM(COLUMN_VALUES("price"))',
  },
];

export default function FormulaAutocomplete() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        formulaFunctions={formulaFunctions}
      />
    </div>
  );
}
