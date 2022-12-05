import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function RowsGridWithGetRowId() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[{ field: 'name' }]}
        rows={[
          { internalId: 1, name: 'React' },
          { internalId: 2, name: 'MUI' },
        ]}
        getRowId={(row) => row.internalId}
      />
    </div>
  );
}
