import * as React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 140 },
  { field: 'team', headerName: 'Team', width: 120 },
  { field: 'score', headerName: 'Score', type: 'number', width: 100 },
];

const rows = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  name: `Person ${index}`,
  team: index % 2 ? 'Alpha' : 'Beta',
  score: (index * 7) % 40,
}));

export default function FocusVisibleDataGrid() {
  // Inherit the theme from the docs site (dark/light mode)
  const existingTheme = useTheme();
  const theme = React.useMemo(
    () =>
      createTheme(
        {
          focusVisible: true,
          components: {
            MuiButtonBase: { defaultProps: { disableRipple: true } },
            MuiCheckbox: { defaultProps: { disableRipple: true } },
          },
        },
        existingTheme,
      ),
    [existingTheme],
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: 460, width: '100%' }}>
        <DataGridPremium
          rows={rows}
          columns={columns}
          showToolbar
          pivotPanelOpen
          checkboxSelection
          pagination
          pageSizeOptions={[5, 10]}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        />
      </Box>
    </ThemeProvider>
  );
}
