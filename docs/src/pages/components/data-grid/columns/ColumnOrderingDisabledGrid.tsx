import * as React from 'react';
import { DataGridPro, GridRowData } from '@mui/x-data-grid-pro';

interface ColumnOrderingDisabledGridRow {
  id: number;
  username: string;
  age: number;
}

const rows: GridRowData<ColumnOrderingDisabledGridRow>[] = [
  {
    id: 1,
    username: '@MaterialUI',
    age: 20,
  },
];

export default function ColumnOrderingDisabledGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGridPro
        columns={[
          { field: 'id' },
          { field: 'username' },
          { field: 'age', disableReorder: true },
        ]}
        rows={rows}
      />
    </div>
  );
}
