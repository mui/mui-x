import { Columns, GridOverlay, RowsProp, XGrid } from '@material-ui/x-grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import * as React from 'react';
import { randomCreatedDate, randomUpdatedDate } from '@material-ui/x-grid-data-generator';

function LoadingComponent() {
  return (
    <GridOverlay className="custom-overlay">
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

export default function LoadingOverrideDemo() {
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
  ];
  return (
    <XGrid
      rows={rows}
      columns={columns}
      components={{ loadingOverlay: LoadingComponent }}
      autoHeight
      loading
    />
  );
}
