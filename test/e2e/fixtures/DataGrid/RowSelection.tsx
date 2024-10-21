import * as React from 'react';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';

const baselineProps: DataGridProps = {
  rows: [
    {
      id: 0,
      brand: 'Nike',
      year: 1990,
    },
    {
      id: 1,
      brand: 'Adidas',
      year: 1995,
    },
    {
      id: 2,
      brand: 'Puma',
      year: 1993,
    },
    {
      id: 3,
      brand: 'Gucci',
      year: 1996,
    },
  ],
  columns: [
    { field: 'brand', width: 120 },
    { field: 'year', width: 120 },
  ],
};

export default function RowSelection() {
  return (
    <div style={{ width: 400, height: 200 }}>
      <DataGrid
        {...baselineProps}
        columnHeaderHeight={50}
        rowHeight={50}
        hideFooter
        disableVirtualization
      />
    </div>
  );
}
