import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const otherProps = {
  autoHeight: true,
  showCellRightBorder: true,
  showColumnRightBorder: true,
};

export default function ColumnSpanningNumber() {
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        columns={[
          { field: 'username', colSpan: 2 },
          { field: 'organization', sortable: false, filterable: false },
          { field: 'age' },
        ]}
        rows={[
          { id: 1, username: '@MUI', age: 20 },
          { id: 2, username: '@MUI-X', age: 25 },
        ]}
        {...otherProps}
      />
    </div>
  );
}
