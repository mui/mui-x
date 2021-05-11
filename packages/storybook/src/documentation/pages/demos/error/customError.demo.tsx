import { GridColumns, GridOverlay, GridRowsProp, XGrid } from '@material-ui/x-grid';
import * as React from 'react';
import { randomCreatedDate, randomUpdatedDate } from '@material-ui/x-grid-data-generator';

function CustomErrorOverlay(props) {
  return (
    <GridOverlay className="custom-error-overlay">
      <div>
        <h1>Oops! An error occured!</h1>
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
    <XGrid
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
