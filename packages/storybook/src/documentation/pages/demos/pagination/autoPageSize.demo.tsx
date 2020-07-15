import * as React from 'react';
import { Columns, RowsProp, XGrid } from '@material-ui/x-grid';
import { randomCreatedDate, randomUpdatedDate } from '@material-ui/x-grid-data-generator';
import '../demo.css';

export default function AutoPageSizeDemo() {
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
    {
      id: 6,
      name: 'George',
      age: 10,
      dateCreated: randomCreatedDate(),
      lastLogin: randomUpdatedDate(),
    },
    {
      id: 7,
      name: 'Anna',
      age: 31,
      dateCreated: randomCreatedDate(),
      lastLogin: randomUpdatedDate(),
    },
    {
      id: 8,
      name: 'Kim',
      age: 20,
      dateCreated: randomCreatedDate(),
      lastLogin: randomUpdatedDate(),
    },
    {
      id: 9,
      name: 'Paul',
      age: 29,
      dateCreated: randomCreatedDate(),
      lastLogin: randomUpdatedDate(),
    },
    {
      id: 10,
      name: 'Jack',
      age: 25,
      dateCreated: randomCreatedDate(),
      lastLogin: randomUpdatedDate(),
    },
  ];

  return (
    <div style={{ height: 280 }}>
      <XGrid
        rows={rows}
        columns={columns}
        options={{ pagination: true, paginationAutoPageSize: true }}
        className="demo"
      />
    </div>
  );
}
