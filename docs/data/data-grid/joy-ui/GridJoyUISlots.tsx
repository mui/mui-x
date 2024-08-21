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
import {
  randomCompanyName,
  randomRating,
  randomCreatedDate,
  randomBoolean,
  randomArrayItem,
} from '@mui/x-data-grid-generator';
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

const singleSelectValueOptions = ['Item1', 'Item2', 'Item3'];

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
    valueOptions: singleSelectValueOptions,
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
type Row = {
  id: number;
  name: string;
  number: number;
  date: Date;
  dateTime: Date;
  boolean: boolean;
  singleSelect: string;
};
const initialRows: Row[] = [];
for (let i = 0; i < 20; i += 1) {
  initialRows.push({
    id: i,
    name: randomCompanyName(),
    number: randomRating(),
    date: randomCreatedDate(),
    dateTime: randomCreatedDate(),
    boolean: randomBoolean(),
    singleSelect: randomArrayItem(singleSelectValueOptions),
  });
}

export default function GridJoyUISlots() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      setRows(initialRows);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timeoutId);
  }, []);

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
            loading={loading}
            columns={columns}
            rows={rows}
            checkboxSelection
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
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
