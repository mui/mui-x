import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';

const columns = [
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
    width: 150,
    allowFormulas: true,
    editable: true,
  },
];

const rows = [
  { id: 1, item: 'Keyboard', price: 89, quantity: 3, total: '=price * quantity' },
  { id: 2, item: 'Mouse', price: 45, quantity: 5, total: '=price * quantity' },
  { id: 3, item: 'Monitor', price: 320, quantity: 2, total: '=price * quantity' },
  {
    id: 4,
    item: 'Total spend',
    price: 0,
    quantity: 0,
    total: '=SUM(COLUMN_VALUES("price"))',
  },
];

export default function FormulaExcelExport() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        rowSelection={false}
        density="compact"
        showToolbar
        formulaA1Notation
        showCellVerticalBorder
        showColumnVerticalBorder
        disablePivoting
        slotProps={{
          toolbar: {
            excelOptions: {
              escapeFormulas: false,
            },
          },
        }}
      />
    </div>
  );
}
