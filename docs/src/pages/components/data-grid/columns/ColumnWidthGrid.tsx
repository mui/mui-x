import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

const rows = [
  {
    id: 1,
    username: '@MaterialUI',
    age: 38,
  },
];

export default function ColumnWidthGrid() {
  return (
      <DataGrid
        columns={[
          { field: 'username', width: 200 },
          { field: 'age' },
        ]}
        rows={rows}
        autoHeight
        hideFooter
      />
  );
}
