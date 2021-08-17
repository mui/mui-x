import * as React from 'react';
import { XGrid } from '@mui/x-data-grid-pro';

const baselineProps = {
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
  ],
  columns: [
    { field: 'brand', width: 120 },
    { field: 'year', width: 120 },
  ],
};

export default function ColumnReorder() {
  return (
    <div style={{ width: 300, height: 300 }}>
      <XGrid {...baselineProps} />
    </div>
  );
}
