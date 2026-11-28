import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 140, editable: true },
  { field: 'team', headerName: 'Team', width: 120 },
  { field: 'score', headerName: 'Score', type: 'number', width: 100 },
];

const rows = Array.from({ length: 4 }, (_, index) => ({
  id: index,
  name: `Person ${index}`,
  team: index % 2 ? 'Alpha' : 'Beta',
  score: (index * 7) % 40,
}));

const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'data-mui-color-scheme' },
  colorSchemes: { light: true, dark: true },
  focusVisible: {
    outlineWidth: 2,
    outlineOffset: 1,
    boxShadow: '0 0 0 1px var(--mui-palette-background-paper)',
    insetOverrides: {
      boxShadow: 'inset 0 0 0 3px var(--mui-palette-background-paper)',
    },
  },
  components: { MuiButtonBase: { defaultProps: { disableRipple: true } } },
});

export default function FocusVisibleRingDataGrid() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: 260, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} checkboxSelection hideFooter />
      </Box>
    </ThemeProvider>
  );
}
