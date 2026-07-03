import * as React from 'react';
import { DataGridPremium, GridColDef, GridRowsProp } from '@mui/x-data-grid-premium';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const columns: GridColDef[] = [
  { field: 'item', headerName: 'Line item', width: 190 },
  {
    field: 'quantity',
    headerName: 'Qty',
    type: 'number',
    width: 70,
    editable: true,
  },
  {
    field: 'unitPrice',
    headerName: 'Unit price',
    type: 'number',
    width: 110,
    editable: true,
    valueFormatter: (value) =>
      typeof value === 'number' ? currencyFormatter.format(value) : value,
  },
  {
    field: 'discount',
    headerName: 'Discount %',
    type: 'number',
    width: 100,
    editable: true,
  },
  {
    field: 'total',
    headerName: 'Amount',
    type: 'number',
    width: 150,
    allowFormulas: true,
    editable: true,
    valueFormatter: (value) =>
      typeof value === 'number' ? currencyFormatter.format(value) : value,
  },
];

const rows: GridRowsProp = [
  {
    id: 1,
    item: 'Laptop workstation',
    quantity: 4,
    unitPrice: 1650,
    total: '=quantity * unitPrice',
  },
  {
    id: 2,
    item: 'Ultrawide monitor',
    quantity: 8,
    unitPrice: 420,
    discount: 10,
    total: '=ROUND(quantity * unitPrice * (1 - discount / 100), 2)',
  },
  {
    id: 3,
    item: 'Docking station',
    quantity: 8,
    unitPrice: 185,
    total: '=quantity * unitPrice',
  },
  {
    id: 4,
    item: 'Mechanical keyboard',
    quantity: 8,
    unitPrice: 95,
    discount: 5,
    total: '=ROUND(quantity * unitPrice * (1 - discount / 100), 2)',
  },
  {
    id: 5,
    item: 'Wireless mouse',
    quantity: 8,
    unitPrice: 45,
    discount: 5,
    total: '=ROUND(quantity * unitPrice * (1 - discount / 100), 2)',
  },
  {
    id: 6,
    item: 'Thunderbolt cable',
    quantity: 12,
    unitPrice: 29,
    total: '=quantity * unitPrice',
  },
  {
    id: 7,
    item: 'On-site setup (hours)',
    quantity: 6,
    unitPrice: 120,
    total: '=quantity * unitPrice',
  },
  {
    id: 8,
    item: 'Extended warranty',
    quantity: 4,
    unitPrice: 210,
    discount: 15,
    total: '=ROUND(quantity * unitPrice * (1 - discount / 100), 2)',
  },
  // The summary rows reference the Amount cells of the line items above.
  // Row data always stores the canonical syntax; with `formulaA1Notation`
  // enabled, the editor displays the subtotal as `=SUM(E1:E8)`.
  {
    id: 9,
    item: 'Subtotal',
    total: '=SUM(RANGE(REF(COLUMN("total"), ROW(1)), REF(COLUMN("total"), ROW(8))))',
  },
  {
    id: 10,
    item: 'Sales tax (8.25%)',
    total: '=ROUND(REF(COLUMN("total"), ROW(9)) * 0.0825, 2)',
  },
  {
    id: 11,
    item: 'Total due',
    total: '=REF(COLUMN("total"), ROW(9)) + REF(COLUMN("total"), ROW(10))',
  },
];

export default function FormulaBasic() {
  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        formulaA1Notation
        rowSelection={false}
        density="compact"
        showCellVerticalBorder
        showColumnVerticalBorder
        disablePivoting
      />
    </div>
  );
}
