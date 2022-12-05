import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const other = {
  autoHeight: true,
  showCellRightBorder: true,
  showColumnRightBorder: true,
};

const rows = [
  { id: 1, username: '@MUI', age: 20 },
  { id: 2, username: '@MUI-X', age: 25 },
];

export default function ColumnSpanningNumber() {
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        columns={[
          { field: 'username', colSpan: 2, hideable: false },
          {
            field: 'organization',
            sortable: false,
            filterable: false,
            hideable: false,
          },
          { field: 'age', hideable: false },
        ]}
        rows={rows}
        {...other}
      />
    </div>
  );
}
