import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { unstable_joySlots } from '@mui/x-data-grid/joy';
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import type { GridColDef } from '@mui/x-data-grid';
import type {} from '@mui/material/themeCssVarsAugmentation';

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
  { field: 'name', editable: true, type: 'string', minWidth: 140 },
  { field: 'number', editable: true, type: 'number', flex: 1 },
  { field: 'date', editable: true, type: 'date', minWidth: 100 },
  { field: 'dateTime', editable: true, type: 'dateTime', minWidth: 160 },
  { field: 'boolean', editable: true, type: 'boolean', flex: 1 },
  {
    field: 'singleSelect',
    editable: true,
    type: 'singleSelect',
    valueOptions: ['Item1', 'Item2', 'Item3'],
    minWidth: 100,
    flex: 1,
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
    minWidth: 80,
    flex: 1,
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
                  '& .MuiDataGrid-panelContent': {
                    // To prevent the Select popup being hidden by the panel
                    overflow: 'visible',
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
