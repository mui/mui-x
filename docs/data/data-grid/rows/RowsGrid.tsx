import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function RowsGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[{ field: 'name' }]}
        rows={[
          { id: 1, name: 'React' },
          { id: 2, name: 'MUI' },
        ]}
      />
    </div>
  );
}
