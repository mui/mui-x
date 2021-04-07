import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

const rows = [
  {
    id: 1,
    username: '@MaterialUI',
    age: 20,
  },
];

export default function HeaderColumnsGrid() {
  return (
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
      autoHeight
      hideFooter
    />
  );
}
