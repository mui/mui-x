import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import {
  randomCity,
  randomEmail,
  randomId,
  randomInt,
  randomTraderName,
  randomUserName,
} from '@mui/x-data-grid-generator';

const columns = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'city', headerName: 'City', width: 150 },
  { field: 'username', headerName: 'Username' },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'age', type: 'number', headerName: 'Age' },
];

const rows = [];

function getRow() {
  return {
    id: randomId(),
    name: randomTraderName(),
    city: randomCity(),
    username: randomUserName(),
    email: randomEmail(),
    age: randomInt(10, 80),
  };
}

const pinnedRows = {
  top: [getRow()],
  bottom: [getRow()],
};

export default function RowPinning() {
  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPro columns={columns} rows={rows} pinnedRows={pinnedRows} />
    </div>
  );
}
