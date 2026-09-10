import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

const baselineProps = {
  rows: [
    { id: 0, brand: 'Nike' },
    { id: 1, brand: 'Adidas' },
    { id: 2, brand: 'Puma' },
  ],
  columns: [{ field: 'brand', width: 120 }],
};

export default function RowReorder() {
  return (
    <div style={{ width: 300, height: 300 }}>
      <DataGridPro {...baselineProps} rowReordering />
    </div>
  );
}
