import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

const baselineProps = {
  rows: [
    {
      id: 0,
      brand: 'Nike',
    },
    {
      id: 1,
      brand: 'Adidas',
    },
    {
      id: 2,
      brand: 'Puma',
    },
  ],
  columns: [
    { field: 'id', minWidth: 100 },
    { field: 'brand', width: 100 },
  ],
};

export default function NotResize() {
  return (
    <div style={{ width: 300, height: 300 }}>
      <DataGridPro
        {...baselineProps}
        initialState={{
          sorting: {
            sortModel: [{ field: 'brand', sort: 'asc' }],
          },
        }}
      />
    </div>
  );
}
