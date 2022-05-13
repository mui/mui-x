import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

const rows = [
  {
    id: 1,
    username: '@MUI',
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
