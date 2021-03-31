import { XGrid } from '@material-ui/x-grid';
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useGridApiRef } from '@material-ui/data-grid';
import {
  randomCreatedDate,
  randomEmail,
  randomTraderName,
  randomUpdatedDate,
} from '@material-ui/x-grid-data-generator';

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

const useStyles = makeStyles({
  root: {
    '& .MuiDataGrid-cellEditing': {
      backgroundColor: 'rgb(255,215,115, 0.19)',
      color: '#1a3e72',
    },
    '& .Mui-error': {
      backgroundColor: 'rgb(126,10,15, 0.1)',
      color: '#750f0f',
    },
  },
});

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function ValidateCellApiRefGrid() {
  const apiRef = useGridApiRef();
  const classes = useStyles();

  const onEditCellChange = React.useCallback(
    ({ id, field, props }, event) => {
      if (field === 'email') {
        const isValid = validateEmail(props.value);
        apiRef.current.setEditCellProps({
          id,
          field,
          props: { ...props, error: !isValid },
        });

        // Prevent the native behavior.
        event?.stopPropagation();
      }
    },
    [apiRef],
  );

  return (
    <XGrid
      rows={rows}
      columns={columns}
      autoHeight
      className={classes.root}
      apiRef={apiRef}
      onEditCellChange={onEditCellChange}
    />
  );
}
