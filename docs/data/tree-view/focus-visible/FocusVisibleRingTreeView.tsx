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
    ],
  },
];

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

export default function FocusVisibleRingTreeView() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: 120, minWidth: 300 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          defaultExpandedItems={['grid']}
          defaultSelectedItems="grid-pro"
          isItemEditable
        />
      </Box>
    </ThemeProvider>
  );
}
