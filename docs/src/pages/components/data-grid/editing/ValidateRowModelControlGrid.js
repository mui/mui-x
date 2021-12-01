import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomEmail,
  randomTraderName,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function ValidateRowModelControlGrid() {
  return (
    <Box
      sx={{
        height: 400,
        width: 1,
        '& .MuiDataGrid-cell--editing': {
          bgcolor: 'rgb(255,215,115, 0.19)',
          color: '#1a3e72',
        },
        '& .Mui-error': {
          bgcolor: (theme) =>
            `rgb(126,10,15, ${theme.palette.mode === 'dark' ? 0 : 0.1})`,
          color: (theme) => (theme.palette.mode === 'dark' ? '#ff4343' : '#750f0f'),
        },
      }}
    >
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
}

const columns = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
    editable: true,
    preProcessEditCellProps: (params) => {
      const isValid = validateEmail(params.props.value);
      return { ...params.props, error: !isValid };
    },
  },
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
