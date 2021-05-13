import * as React from 'react';
import { DataGrid, GridRowParams } from '@material-ui/data-grid';
import { randomUserName, randomInt } from '@material-ui/x-grid-data-generator';

const columns = [
  { field: 'id' },
  { field: 'username', width: 150 },
  { field: 'age', width: 80, type: 'number' },
];

const rows = [
  { id: 1, username: randomUserName(), age: randomInt(10, 80) },
  { id: 2, username: randomUserName(), age: randomInt(10, 80) },
  { id: 3, username: randomUserName(), age: randomInt(10, 80) },
  { id: 4, username: randomUserName(), age: randomInt(10, 80) },
  { id: 5, username: randomUserName(), age: randomInt(10, 80) },
  { id: 6, username: randomUserName(), age: randomInt(10, 80) },
  { id: 7, username: randomUserName(), age: randomInt(10, 80) },
  { id: 8, username: randomUserName(), age: randomInt(10, 80) },
];

export default function DisableRowSelection() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        columns={columns}
        rows={rows}
        isRowSelectable={(params: GridRowParams) => Number(params.id) % 2 === 0}
        checkboxSelection
      />
    </div>
  );
}
