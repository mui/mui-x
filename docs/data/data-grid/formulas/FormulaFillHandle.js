import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const columns = [
  { field: 'order', headerName: 'Order', width: 140 },
  {
    field: 'amount',
    headerName: 'Amount',
    type: 'number',
    width: 110,
    editable: true,
    valueFormatter: (value) =>
      typeof value === 'number' ? currencyFormatter.format(value) : value,
  },
  {
    field: 'rate',
    headerName: 'Tax %',
    type: 'number',
    width: 90,
    editable: true,
  },
  {
    field: 'total',
    headerName: 'Total with tax',
    type: 'number',
    width: 160,
    allowFormulas: true,
    editable: true,
    valueFormatter: (value) =>
      typeof value === 'number' ? currencyFormatter.format(value) : value,
  },
];

// Only the first row holds a formula: `=ROUND(amount * (1 + $C$1 / 100), 2)`
// in A1 notation. The `amount` reference is relative and the `$C$1` tax-rate
// reference is absolute. Select the first "Total with tax" cell and drag the
// fill handle down (or press Ctrl+D): `amount` follows each row while `$C$1`
// stays pinned to the shared tax rate.
const rows = [
  {
    id: 1,
    order: 'INV-2401',
    amount: 1250,
    rate: 8.25,
    total:
      '=ROUND(amount * (1 + REF(COLUMN_POSITION(3), ROW_POSITION(1)) / 100), 2)',
  },
  { id: 2, order: 'INV-2402', amount: 890 },
  { id: 3, order: 'INV-2403', amount: 2140 },
  { id: 4, order: 'INV-2404', amount: 655 },
  { id: 5, order: 'INV-2405', amount: 1780 },
  { id: 6, order: 'INV-2406', amount: 990 },
];

export default function FormulaFillHandle() {
  return (
    <div style={{ height: 340, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        formulaA1Notation
        cellSelection
        cellSelectionFillHandle
        rowSelection={false}
        density="compact"
        showCellVerticalBorder
        showColumnVerticalBorder
        disablePivoting
      />
    </div>
  );
}
