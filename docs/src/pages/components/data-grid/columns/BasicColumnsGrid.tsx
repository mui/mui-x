import * as React from 'react';
import { DataGrid, ColDef } from '@material-ui/data-grid';

export default function BasicColumnsGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={
          [{ field: 'id' }, { field: 'username' }, { field: 'age' }] as ColDef[]
        }
        rows={[
          {
            id: 1,
            username: 'defunkt',
            age: 38,
          },
        ]}
      />
    </div>
  );
}
