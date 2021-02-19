import { GridColumns, GridRowsProp, XGrid } from '@material-ui/x-grid';
import * as React from 'react';
import { randomCreatedDate, randomUpdatedDate } from '@material-ui/x-grid-data-generator';

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
  return <XGrid rows={rows} columns={columns} autoHeight />;
}
