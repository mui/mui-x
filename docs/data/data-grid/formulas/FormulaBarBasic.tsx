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
];

const pinnedRows = {
  bottom: [
    {
      id: 5,
      item: 'Total due',
      // The window covers view positions D1:D4 — pinned rows sit outside the
      // sortable data band, so the total can never be swept into its own range.
      total: '=SUM(RANGE_REF(COLUMN_FROM(4), ROW_FROM(1), COLUMN_TO(4), ROW_TO(4)))',
    },
  ],
};

export default function FormulaBarBasic() {
  return (
    <div style={{ height: 480, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        pinnedRows={pinnedRows}
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
