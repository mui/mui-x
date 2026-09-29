import * as React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

const MUI_X_PRODUCTS = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
];

export default function FocusVisibleTreeView() {
  // Inherit the theme from the docs site (dark/light mode)
  const existingTheme = useTheme();
  const theme = React.useMemo(
    () =>
      createTheme(
        {
          focusVisible: true,
          components: { MuiButtonBase: { defaultProps: { disableRipple: true } } },
        },
        existingTheme,
      ),
    [existingTheme],
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: 260, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          defaultExpandedItems={['grid']}
          defaultSelectedItems={['grid-pro']}
          checkboxSelection
          multiSelect
        />
      </Box>
    </ThemeProvider>
  );
}
