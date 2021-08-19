import { GridColumns, GridRowsProp, DataGridPro } from '@mui/x-data-grid-pro';
import * as React from 'react';
import { randomCreatedDate, randomUpdatedDate } from '@mui/x-data-grid-generator';

export default function ExceptionDemo() {
  const columns: GridColumns = [
    { field: 'name', type: 'string' },
    {
      field: 'age',
      type: 'number',
      valueGetter: () => {
        throw new Error('Bad column throw exception');
      },
    },
    { field: 'dateCreated', type: 'date', width: 180 },
    { field: 'lastLogin', type: 'dateTime', width: 180 },
  ];
  const rows: GridRowsProp = [
    {
      id: 1,
      name: 'Damien',
      age: 25,
      dateCreated: randomCreatedDate(),
      lastLogin: randomUpdatedDate(),
    },
    {
      id: 2,
      name: 'Nicolas',
      age: 36,
      dateCreated: randomCreatedDate(),
      lastLogin: randomUpdatedDate(),
    },
    {
      id: 3,
      name: 'Kate',
      age: 19,
      dateCreated: randomCreatedDate(),
      lastLogin: randomUpdatedDate(),
    },
  ];
  return <DataGridPro rows={rows} columns={columns} autoHeight />;
}
