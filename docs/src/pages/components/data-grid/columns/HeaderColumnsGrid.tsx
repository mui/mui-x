import * as React from 'react';
import { DataGrid, GridRowData } from '@mui/x-data-grid';

interface HeaderColumnsGridRow {
  id: number;
  username: string;
  age: number;
}

const rows: GridRowData<HeaderColumnsGridRow>[] = [
  {
    id: 1,
    username: '@MaterialUI',
    age: 20,
  },
];

export default function HeaderColumnsGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[
          {
            field: 'username',
            headerName: 'Username',
            description:
              'The identification used by the person with access to the online service.',
          },
          { field: 'age', headerName: 'Age' },
        ]}
        rows={rows}
      />
    </div>
  );
}
