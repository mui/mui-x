import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

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

export default function CheckboxSelection() {
  return (
    <div style={{ width: 300, height: 300 }}>
      <DataGrid {...baselineProps} checkboxSelection />
    </div>
  );
}
