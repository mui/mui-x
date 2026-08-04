import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const columns = [
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

const rows = [
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
    total: '=quantity * unitPrice',
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
    item: 'Thunderbolt cable',
    quantity: 12,
    unitPrice: 29,
    total: '=quantity * unitPrice',
  },
  {
    id: 5,
    item: 'Total due',
    total: '=SUM(RANGE(REF(COLUMN("total"), ROW(1)), REF(COLUMN("total"), ROW(4))))',
  },
];

export default function FormulaBarBasic() {
  return (
    <div style={{ height: 480, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        formulaA1Notation
        showToolbar
        slotProps={{ toolbar: { formulaBar: true } }}
        rowSelection={false}
        density="compact"
        showCellVerticalBorder
        showColumnVerticalBorder
        disablePivoting
      />
    </div>
  );
}
