/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import { createTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { DataGrid } from '@material-ui/data-grid';
import {
  randomCreatedDate,
  randomEmail,
  randomTraderName,
  randomUpdatedDate,
} from '@material-ui/x-grid-data-generator';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) => {
    const isDark = theme.palette.mode === 'dark';

    return {
      root: {
        '& .MuiDataGrid-cell--editing': {
          backgroundColor: 'rgb(255,215,115, 0.19)',
          color: '#1a3e72',
        },
        '& .Mui-error': {
          backgroundColor: `rgb(126,10,15, ${isDark ? 0 : 0.1})`,
          color: isDark ? '#ff4343' : '#750f0f',
        },
      },
    };
  },
  { defaultTheme },
);

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function ValidateRowModelControlGrid() {
  const [editRowsModel, setEditRowsModel] = React.useState({});
  const classes = useStyles();

  const handleEditRowsModelChange = React.useCallback((newModel) => {
    const updatedModel = { ...newModel };
    Object.keys(updatedModel).forEach((id) => {
      if (updatedModel[id].email) {
        const isValid = validateEmail(updatedModel[id].email.value);
        updatedModel[id].email = { ...updatedModel[id].email, error: !isValid };
      }
    });
    setEditRowsModel(updatedModel);
  }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        className={classes.root}
        rows={rows}
        columns={columns}
        editRowsModel={editRowsModel}
        onEditRowsModelChange={handleEditRowsModelChange}
      />
    </div>
  );
}

const columns = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  { field: 'email', headerName: 'Email', width: 200, editable: true },
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
    email: randomEmail(),
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    email: randomEmail(),
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    email: randomEmail(),
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    email: randomEmail(),
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    email: randomEmail(),
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];
