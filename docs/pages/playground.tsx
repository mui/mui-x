import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function BasicColumnsGrid() {
  return (
    <div style={{ height: '116px', width: '800px' }}>
      <DataGrid
        hideFooter
        // autoHeight
        columns={[
          { field: 'username1', flex: 1 },
          { field: 'username2', flex: 1 },
          { field: 'username3', flex: 1 },
          { field: 'username4', flex: 1 },
          { field: 'username5', flex: 1 },
          { field: 'username6', flex: 1 },
          { field: 'username7', flex: 1 },
          { field: 'age', width: 50 },
        ]}
        rows={[
          {
            id: 1,
            username1: '@MaterialUI',
            username2: '@MaterialUI',
            username3: '@MaterialUI',
            username4: '@MaterialUI',
            username5: '@MaterialUI',
            username6: '@MaterialUI',
            username7: '@MaterialUI',
            age: 20,
          },
        ]}
      />
    </div>
  );
}
