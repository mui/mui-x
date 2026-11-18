import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';

const columns = [
  { field: 'product', headerName: 'Product', width: 160, editable: true },
  { field: 'category', headerName: 'Category', width: 140, editable: true },
  { field: 'quantity', headerName: 'Quantity', type: 'number', editable: true },
  { field: 'price', headerName: 'Price', type: 'number', editable: true },
];

const initialRows = [
  { id: 1, product: 'Desk', category: 'Furniture', quantity: 4, price: 250 },
  { id: 2, product: 'Chair', category: 'Furniture', quantity: 12, price: 90 },
  { id: 3, product: 'Monitor', category: 'Electronics', quantity: 8, price: 180 },
  { id: 4, product: 'Keyboard', category: 'Electronics', quantity: 15, price: 45 },
];

export default function ClipboardPasteCreateRows() {
  const nextId = React.useRef(initialRows.length + 1);

  const clipboardPasteOptions = React.useMemo(
    () => ({
      createRows: ({ count }) =>
        Array.from({ length: count }, () => {
          const id = nextId.current;
          nextId.current += 1;
          return { id, quantity: 1 };
        }),
    }),
    [],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        rows={initialRows}
        columns={columns}
        clipboardPasteOptions={clipboardPasteOptions}
        cellSelection
        disableRowSelectionOnClick
        ignoreValueFormatterDuringExport
      />
    </div>
  );
}
