import * as React from 'react';
import { DataGridPro, GridRowData } from '@mui/x-data-grid-pro';

interface ColumnSizingGridRow {
  id: number;
  username: string;
  age: number;
}

const rows: GridRowData<ColumnSizingGridRow>[] = [
  {
    id: 1,
    username: '@MaterialUI',
    age: 20,
  },
];

export default function ColumnSizingGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGridPro
        columns={[
          { field: 'id' },
          { field: 'username', minWidth: 150 },
          { field: 'age', resizable: false },
        ]}
        rows={rows}
      />
    </div>
  );
}
