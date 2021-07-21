import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

const rows = [
  {
    id: 1,
    username: '@MaterialUI',
    age: 38,
  },
];

export default function ColumnMinWidthGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[{ field: 'username', minWidth: 150 }, { field: 'age' }]}
        rows={rows}
      />
    </div>
  );
}
