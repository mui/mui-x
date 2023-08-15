import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

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
  columns: [{ field: 'brand', width: 100 }],
};

export default function KeyboardNavigationFocus() {
  return (
    <React.Fragment>
      <button type="button" autoFocus data-testid="initial-focus">
        initial focus
      </button>
      <div style={{ width: 400, height: 300 }}>
        <DataGrid {...baselineProps} />
      </div>
    </React.Fragment>
  );
}
