/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid, getThemePaletteMode } from '@material-ui/data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@material-ui/x-grid-data-generator';

const useStyles = makeStyles((theme) => {
  const backgroundColor =
    getThemePaletteMode(theme.palette) === 'dark' ? '#376331' : 'rgb(217 243 190)';
  return {
    root: {
      '& .MuiDataGrid-cellEditable': {
        backgroundColor,
      },
    },
  };
});

export default function IsCellEditableGrid() {
  const classes = useStyles();
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        className={classes.root}
        rows={rows}
        columns={columns}
        isCellEditable={(params) => params.row.age % 2 === 0}
      />
    </div>
  );
}

const columns = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },
];

const rows = [
  {
    id: 1,
    name: randomTraderName(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];
