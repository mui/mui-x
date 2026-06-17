import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const columns = [
  { field: 'item', headerName: 'Item', width: 150 },
  { field: 'price', headerName: 'Price', type: 'number', width: 90, editable: true },
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
    width: 130,
    allowFormulas: true,
    editable: true,
    valueFormatter: (value) =>
      typeof value === 'number' ? currencyFormatter.format(value) : value,
  },
  { field: 'description', headerName: 'Formula explanation', width: 380 },
];

// The stored formula is always canonical (REF/ROW/COLUMN_VALUES/RANGE…). With
// `formulaA1Notation` on, editing a cell shows the A1 form noted in each row's
// description. Same-row references (price, quantity) keep their column names in
// A1; only cross-row and positional references use A1 cell addresses.
const rows = [
  {
    id: 1,
    item: 'Keyboard',
    price: 89,
    quantity: 3,
    total: '=price * quantity',
    description:
      'Inline same-row arithmetic. Same-row fields keep their names in A1 notation.',
  },
  {
    id: 2,
    item: 'Mouse',
    price: 45,
    quantity: 5,
    total: '=ROUND(price * quantity * 0.9, 2)',
    description: 'Function (ROUND): 10% off, rounded to 2 decimals.',
  },
  {
    id: 3,
    item: 'Monitor',
    price: 320,
    quantity: 2,
    total: '=IF(price > 100, price * quantity * 0.9, price * quantity)',
    description: 'Conditional (IF): 10% off when the price is above 100.',
  },
  {
    id: 4,
    item: 'Webcam',
    price: 60,
    quantity: 2,
    total: '=price * quantity + REF(COLUMN("price"), ROW(1))',
    description:
      "Cross-row reference to row 1's price. Edits as: price * quantity + B1.",
  },
  {
    id: 5,
    item: 'USB-C cable',
    price: 12,
    quantity: 10,
    total: '=REF(COLUMN("price"), ROW_POSITION(1)) * quantity',
    description:
      'Positional row (top visible row). Edits as B$1 * quantity; follows re-sorts.',
  },
  {
    id: 6,
    item: 'Laptop stand',
    price: 40,
    quantity: 3,
    total: '=REF(COLUMN_POSITION(2), ROW(6)) * quantity',
    description:
      'Positional column (column 2 = price) of this row. Edits as $B6 * quantity.',
  },
  {
    id: 7,
    item: 'Desk mat',
    price: 25,
    quantity: 4,
    total: '=REF(COLUMN_POSITION(2), ROW_POSITION(1))',
    description: 'Both axes positional: column 2, top visible row. Edits as $B$1.',
  },
  {
    id: 8,
    item: 'Cable pack',
    price: 18,
    quantity: 6,
    total: '=REF(COLUMN("price"), ROW_POSITION(2)) * quantity',
    description: 'Mixed: field column + positional row. Edits as B$2 * quantity.',
  },
  {
    id: 9,
    item: 'Webcam stand',
    price: 35,
    quantity: 2,
    total: '=SUM(COLUMN_VALUES("price"))',
    description: 'Whole column: sum of every price. Edits as SUM(B:B).',
  },
  {
    id: 10,
    item: 'HDMI adapter',
    price: 15,
    quantity: 7,
    total: '=AVERAGE(COLUMN_VALUES("price"))',
    description: 'Whole column with AVERAGE. Edits as AVERAGE(B:B).',
  },
  {
    id: 11,
    item: 'Laptop sleeve',
    price: 30,
    quantity: 3,
    total: '=SUM(RANGE(REF(COLUMN("price"), ROW(1)), REF(COLUMN("price"), ROW(3))))',
    description: 'Range: sum of prices in rows 1–3. Edits as SUM(B1:B3).',
  },
  {
    id: 12,
    item: 'Power bank',
    price: 50,
    quantity: 0,
    total: '=IFERROR(price / quantity, 0)',
    description: 'IFERROR: returns 0 instead of #DIV/0! when quantity is 0.',
  },
  {
    id: 13,
    item: 'Shipping',
    price: 25,
    quantity: 1,
    total: 25,
    description: 'Plain value — not a formula.',
  },
];

export default function FormulaBasic() {
  return (
    <div style={{ height: 440, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        initialState={{ aggregation: { model: { total: 'sum' } } }}
        formulaA1Notation
        showCellVerticalBorder
        showColumnVerticalBorder
        density="compact"
      />
    </div>
  );
}
