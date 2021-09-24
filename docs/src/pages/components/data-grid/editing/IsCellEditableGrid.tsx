import * as React from 'react';
import { createTheme, Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { DataGrid, GridColumns, GridRowsProp } from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme: Theme) => {
    const backgroundColor =
      theme.palette.mode === 'dark' ? '#376331' : 'rgb(217 243 190)';
    return {
      root: {
        '& .MuiDataGrid-cell--editable': {
          backgroundColor,
        },
      },
    };
  },
  { defaultTheme },
);

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

const columns: GridColumns = [
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

const rows: GridRowsProp = [
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
