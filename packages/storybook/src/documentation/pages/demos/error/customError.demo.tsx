import { GridColumns, GridOverlay, GridRowsProp, DataGridPro } from '@mui/x-data-grid-pro';
import * as React from 'react';
import { randomCreatedDate, randomUpdatedDate } from '@mui/x-data-grid-generator';

function CustomErrorOverlay(props) {
  return (
    <GridOverlay className="custom-error-overlay">
      <div>
        <h1>Oops! An error occurred!</h1>
        <p>{typeof props.error === 'string' ? props.error : props.error.message}</p>
      </div>
    </GridOverlay>
  );
}

export default function CustomErrorDemo() {
  const columns: GridColumns = [
    { field: 'name', type: 'string' },
    {
      field: 'age',
      type: 'number',
      valueGetter: () => {
        throw new Error('Bad column throws exception');
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
  return (
    <DataGridPro
      rows={rows}
      columns={columns}
      autoHeight
      components={{
        ErrorOverlay: CustomErrorOverlay,
      }}
      className="demo"
    />
  );
}
