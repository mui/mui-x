// https://github.com/mui/mui-x/issues/16136

/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomTraderName,
  randomEmail,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

export default function DataGridPinnedColumnsNoVirtualization() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    if (apiRef.current) {
      apiRef.current.unstable_setColumnVirtualization(false);
    }
  }, [apiRef]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        initialState={{ pinnedColumns: { left: ['name'], right: ['email'] } }}
      />
    </div>
  );
}

const columns = [
  { field: 'name', headerName: 'Name', width: 160 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'age', headerName: 'Age', type: 'number' },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
  },
];

const rows = [
  {
    id: 1,
    name: randomTraderName(),
    email: randomEmail(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    email: randomEmail(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    email: randomEmail(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];
