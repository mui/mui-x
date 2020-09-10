import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

const rows = [
  {
    id: 1,
    username: 'defunkt',
    age: 38,
  },
];

export default function ColumnWidthGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[
          { field: 'id', resizable: false },
          { field: 'username' },
          { field: 'age', resizable: false },
        ]}
        rows={rows}
      />
    </div>
  );
}
