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
    ],
  },
];

export default function FocusVisibleRingTreeView() {
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
        components: { MuiButtonBase: { defaultProps: { disableRipple: true } } },
      },
      existingTheme,
    );
  }, [existingTheme]);

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
