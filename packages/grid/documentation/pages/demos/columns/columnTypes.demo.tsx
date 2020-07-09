import * as React from 'react';
import { Columns, RowsProp, XGrid } from '@material-ui/x-grid';
import { randomCreatedDate, randomUpdatedDate } from '@material-ui/x-grid-data-generator';
import '../demo.css';

export default function ColumnTypesDemo() {
  const columns: Columns = [
    { field: 'id', hide: true },
    { field: 'name', type: 'string' },
    { field: 'age', type: 'number' },
    { field: 'dateCreated', type: 'date', width: 180 },
    { field: 'lastLogin', type: 'dateTime', width: 180 },
  ];

  const rows: RowsProp = [
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
    {
      id: 4,
      name: 'Sebastien',
      age: 28,
      dateCreated: randomCreatedDate(),
      lastLogin: randomUpdatedDate(),
    },
    {
      id: 5,
      name: 'Louise',
      age: 23,
      dateCreated: randomCreatedDate(),
      lastLogin: randomUpdatedDate(),
    },
  ];

  return (
    <XGrid
      rows={rows}
      columns={columns}
      options={{ hideFooter: true, autoHeight: true }}
      className={'demo'}
    />
  );
}
