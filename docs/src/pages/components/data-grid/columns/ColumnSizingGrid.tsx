import * as React from 'react';
import { XGrid } from '@mui/x-data-grid-pro';

const rows = [
  {
    id: 1,
    username: '@MaterialUI',
    age: 20,
  },
];

export default function ColumnSizingGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <XGrid
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
