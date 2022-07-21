import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

const columns = [
  { field: 'id', headerName: 'ID', width: 200 },
  { field: 'firstName', headerName: 'First name', width: 200 },
  { field: 'lastName', headerName: 'Last name', width: 200 },
  { field: 'occupation', headerName: 'Occupation', width: 200 },
  { field: 'birthday', headerName: 'Birthday', width: 200, type: 'date' },
];

const data = [
  {
    id: 1,
    firstName: 'Walter',
    lastName: 'White',
    occupation: 'Chemistry teacher',
    birthday: '09-07-1958',
  },
  {
    id: 2,
    firstName: 'Jesse',
    lastName: 'Pinkman',
    occupation: 'Dealer',
    birthday: '09-24-1984',
  },
  {
    id: 3,
    firstName: 'Skyler',
    lastName: 'White',
    occupation: 'Bookkeeper',
    birthday: '08-11-1970',
  },
  {
    id: 4,
    firstName: 'Saul',
    lastName: 'Goodman',
    occupation: 'Lawyer',
    birthday: '',
  },
  {
    id: 5,
    firstName: 'Hank',
    lastName: 'Schrader',
    occupation: 'DEA Agent',
    birthday: '',
  },
  {
    id: 6,
    firstName: 'Gus',
    lastName: 'Fring',
    occupation: 'Restaurant owner',
    birthday: '',
  },
  {
    id: 7,
    firstName: 'Mike',
    lastName: 'Ehrmantraut',
    occupation: 'Private Investigator',
    birthday: '',
  },
  {
    id: 8,
    firstName: 'Walter',
    lastName: 'White',
    occupation: 'Chemistry teacher',
    birthday: '09-07-1958',
  },
  {
    id: 9,
    firstName: 'Jesse',
    lastName: 'Pinkman',
    occupation: 'Dealer',
    birthday: '09-24-1984',
  },
  {
    id: 10,
    firstName: 'Skyler',
    lastName: 'White',
    occupation: 'Bookkeeper',
    birthday: '08-11-1970',
  },
  {
    id: 11,
    firstName: 'Saul',
    lastName: 'Goodman',
    occupation: 'Lawyer',
    birthday: '',
  },
  {
    id: 12,
    firstName: 'Hank',
    lastName: 'Schrader',
    occupation: 'DEA Agent',
    birthday: '',
  },
  {
    id: 13,
    firstName: 'Gus',
    lastName: 'Fring',
    occupation: 'Restaurant owner',
    birthday: '',
  },
  {
    id: 14,
    firstName: 'Mike',
    lastName: 'Ehrmantraut',
    occupation: 'Private Investigator',
    birthday: '',
  },
  {
    id: 15,
    firstName: 'Walter',
    lastName: 'White',
    occupation: 'Chemistry teacher',
    birthday: '09-07-1958',
  },
  {
    id: 16,
    firstName: 'Jesse',
    lastName: 'Pinkman',
    occupation: 'Dealer',
    birthday: '09-24-1984',
  },
  {
    id: 17,
    firstName: 'Skyler',
    lastName: 'White',
    occupation: 'Bookkeeper',
    birthday: '08-11-1970',
  },
  {
    id: 18,
    firstName: 'Saul',
    lastName: 'Goodman',
    occupation: 'Lawyer',
    birthday: '',
  },
  {
    id: 19,
    firstName: 'Hank',
    lastName: 'Schrader',
    occupation: 'DEA Agent',
    birthday: '',
  },
  {
    id: 20,
    firstName: 'Gus',
    lastName: 'Fring',
    occupation: 'Restaurant owner',
    birthday: '',
  },
  {
    id: 21,
    firstName: 'Mike',
    lastName: 'Ehrmantraut',
    occupation: 'Private Investigator',
    birthday: '',
  },
];

const pinnedRowsTop = [1, 20];
const pinnedRowsBottom = [3, 2];

const rows = [];
const pinnedRows = {
  top: [],
  bottom: [],
};

data.forEach((row) => {
  if (pinnedRowsTop.includes(row.id)) {
    pinnedRows.top.push(row);
  } else if (pinnedRowsBottom.includes(row.id)) {
    pinnedRows.bottom.push(row);
  } else {
    rows.push(row);
  }
});

export default function RowPinning() {
  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPro
        columns={columns}
        pinnedRows={pinnedRows}
        rows={rows}
        initialState={{
          pinnedColumns: { left: ['id'], right: ['birthday'] },
          pagination: {
            pageSize: 10,
          },
        }}
        pagination
        rowsPerPageOptions={[5, 10]}
      />
    </div>
  );
}
