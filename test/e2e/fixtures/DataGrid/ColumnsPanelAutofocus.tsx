import * as React from 'react';
import { DataGrid, DataGridProps, GridToolbar } from '@mui/x-data-grid';

const baselineProps: DataGridProps = {
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
  components: {
    Toolbar: GridToolbar,
  },
  componentsProps: {
    columnsPanel: {
      autoFocusSearchField: false,
    },
  },
};

export default function ColumnsPanelAutoFocus() {
  return (
    <React.Fragment>
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...baselineProps} />
      </div>
    </React.Fragment>
  );
}
