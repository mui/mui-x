import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { unstable_joySlots } from '@mui/x-data-grid/joy';
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';
import DeleteIcon from '@mui/icons-material/Delete';

const materialTheme = materialExtendTheme({
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: ({ ownerState }) => {
          return {
            color: 'var(--Icon-color)',
            margin: 'var(--Icon-margin)',
            ...(ownerState.fontSize &&
              ownerState.fontSize !== 'inherit' && {
                fontSize: `var(--Icon-fontSize, 1.5rem)`,
              }),
          };
        },
      },
    },
  },
});

const columns: GridColDef[] = [
  { field: 'name', editable: true, type: 'string' },
  { field: 'number', editable: true, type: 'number' },
  { field: 'date', editable: true, type: 'date' },
  { field: 'dateTime', editable: true, type: 'dateTime' },
  { field: 'boolean', editable: true, type: 'boolean' },
  {
    field: 'singleSelect',
    editable: true,
    type: 'singleSelect',
    valueOptions: ['Item1', 'Item2', 'Item3'],
  },
  {
    field: 'actions',
    type: 'actions',
    getActions: () => [
      <GridActionsCellItem
        icon={<DeleteIcon />}
        onClick={() => {}}
        label="Delete"
      />,
      <GridActionsCellItem onClick={() => {}} label="Print" showInMenu />,
      <GridActionsCellItem label="Duplicate User" showInMenu />,
    ],
  },
];
const rows = [
  {
    id: 1,
    name: 'Data Grid x Joy UI',
    number: 1,
    date: new Date(),
    dateTime: new Date(),
    boolean: true,
    singleSelect: 'Item1',
  },
];

export default function GridJoyUISlots() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 20,
    editable: true,
  });
  console.log('data', data);

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            pagination
            slots={{
              ...unstable_joySlots,
              toolbar: GridToolbar,
            }}
            columns={columns}
            rows={rows}
            checkboxSelection
            disableRowSelectionOnClick
            slotProps={{
              filterPanel: {
                sx: {
                  '& .MuiDataGrid-filterForm': {
                    alignItems: 'flex-end',
                  },
                },
              },
            }}
          />
        </Box>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
