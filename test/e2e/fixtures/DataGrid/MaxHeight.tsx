import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function MaxHeightDataGrid() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 250 }}>
      <DataGrid
        columns={[{ field: 'id' }]}
        rows={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }]}
      />
    </div>
  );
}
