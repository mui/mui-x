import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

const rows = [
  {
    id: 1,
    username: '@MUI',
    age: 38,
    desk: 'D-546',
  },
  {
    id: 2,
    username: '@MUI-X',
    age: 25,
    desk: 'D-042',
  },
];

export default function RowOrderingDisabledGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGridPro
        columns={[{ field: 'username' }, { field: 'age' }, { field: 'desk' }]}
        rows={rows}
        disableRowReorder
      />
    </div>
  );
}
