import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';

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
          { field: 'username' },
          { field: 'age', resizable: false },
        ]}
        rows={rows}
      />
    </div>
  );
}
