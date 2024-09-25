/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomTraderName,
  randomEmail,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';
import { Box, Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material';

export default function ControlPinnedColumns() {
  const [pinnedColumns, setPinnedColumns] = React.useState({
    left: ['name'],
    right: ['dateCreated'],
  });

  const handlePinnedColumnsChange = React.useCallback(
    (updatedPinnedColumns) => {
      setPinnedColumns(updatedPinnedColumns);
    },
    [setPinnedColumns],
  );

  return (
    <Box sx={{ height: 400, width: 400 }}>
      <CssVarsProvider>
        <DataGridPro
          rows={rows}
          hideFooter
          columns={columns}
          pinnedColumns={pinnedColumns}
          onPinnedColumnsChange={handlePinnedColumnsChange}
        />
      </CssVarsProvider>
    </Box>
  );
}

const columns = [
  { field: 'name', headerName: 'Name', width: 80, editable: true },
  { field: 'email', headerName: 'Email', width: 150, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 80,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 180,
    editable: true,
  },
];

const rows = [
  {
    id: 1,
    name: randomTraderName(),
    email: randomEmail(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];
