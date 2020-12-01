import * as React from 'react';
import {
  Columns,
  RowsProp,
  DataGrid,
  SortDirection,
  ValueGetterParams,
} from '@material-ui/data-grid';
import {
  randomCreatedDate,
  randomUpdatedDate,
} from '@material-ui/x-grid-data-generator';

const columns: Columns = [
  { field: 'name' },
  { field: 'age', type: 'number' },
  {
    field: 'username',
    valueGetter: (params: ValueGetterParams) =>
      `${params.getValue('name') || 'unknown'} - ${
        params.getValue('age') || 'x'
      }`,
    sortComparator: (v1, v2, param1, param2) => param1.row.age - param2.row.age,
    width: 150,
  },
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
];

const sortModel = [
  {
    field: 'username',
    sort: 'asc' as SortDirection,
  },
];

export default function ComparatorSortingGrid() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid sortModel={sortModel} rows={rows} columns={columns} />
    </div>
  );
}
