import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';

const rows = [
  {
    id: 1,
    username: 'defunkt',
    age: 38,
  },
];

export default function ColumnSizingGrid() {
  return (
      <XGrid
        columns={[
          { field: 'id' },
          { field: 'username' },
          { field: 'age', resizable: false },
        ]}
        rows={rows}
        autoHeight
        hideFooter
      />
  );
}
