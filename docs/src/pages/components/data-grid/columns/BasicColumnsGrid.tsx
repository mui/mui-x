import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

export default function BasicColumnsGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[{ field: 'username' }, { field: 'age' }]}
        rows={[
          {
            id: 1,
            username: '@MaterialUI',
            age: 20,
          },
        ]}
      />
    </div>
  );
}
