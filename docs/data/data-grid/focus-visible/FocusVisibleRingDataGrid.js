import * as React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
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

export default function FocusVisibleRingDataGrid() {
  // Inherit the theme from the docs site (dark/light mode)
  const existingTheme = useTheme();
  const theme = React.useMemo(() => {
    const surface = (existingTheme.vars || existingTheme).palette.background.paper;
    return createTheme(
      {
        focusVisible: {
          outlineWidth: 2,
          outlineOffset: 1,
          boxShadow: `0 0 0 1px ${surface}`,
          insetOverrides: { boxShadow: `inset 0 0 0 3px ${surface}` },
        },
        components: {
          MuiButtonBase: { defaultProps: { disableRipple: true } },
          MuiCheckbox: { defaultProps: { disableRipple: true } },
        },
      },
      existingTheme,
    );
  }, [existingTheme]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: 260, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} checkboxSelection hideFooter />
      </Box>
    </ThemeProvider>
  );
}
