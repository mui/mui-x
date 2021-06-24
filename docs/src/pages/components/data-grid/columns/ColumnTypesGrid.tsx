import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import {
  randomCreatedDate,
  randomUpdatedDate,
} from '@material-ui/x-grid-data-generator';

const rows = [
  {
    id: 1,
    name: 'Damien',
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
    isAdmin: true,
    country: 'Spain',
  },
  {
    id: 2,
    name: 'Nicolas',
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
    isAdmin: true,
    country: 'France',
  },
  {
    id: 3,
    name: 'Kate',
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
    isAdmin: false,
    country: 'Brazil',
  },
];

export default function ColumnTypesGrid() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        columns={[
          { field: 'name', type: 'string' },
          { field: 'age', type: 'number' },
          { field: 'dateCreated', type: 'date', width: 130 },
          { field: 'lastLogin', type: 'dateTime', width: 180 },
          { field: 'isAdmin', type: 'boolean', width: 120 },
          {
            field: 'country',
            type: 'select',
            width: 150,
            valueOptions: [
              'Bulgaria',
              'Netherlands',
              'France',
              'United Kingdom',
              'Spain',
              'Brazil',
            ],
          },
        ]}
        rows={rows}
      />
    </div>
  );
}
