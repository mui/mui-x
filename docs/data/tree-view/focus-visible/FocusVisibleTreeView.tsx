import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import type { TreeViewDefaultItemModelProperties } from '@mui/x-tree-view/models';

const MUI_X_PRODUCTS: TreeViewDefaultItemModelProperties[] = [
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

const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'data-mui-color-scheme' },
  colorSchemes: { light: true, dark: true },
  focusVisible: true,
  components: { MuiButtonBase: { defaultProps: { disableRipple: true } } },
});

export default function FocusVisibleTreeView() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: 260, minWidth: 300 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          defaultExpandedItems={['grid']}
          defaultSelectedItems={['grid-pro']}
          checkboxSelection
          multiSelect
          isItemEditable
        />
      </Box>
    </ThemeProvider>
  );
}
