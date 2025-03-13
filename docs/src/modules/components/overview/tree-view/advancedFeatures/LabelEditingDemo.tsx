import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS } from './products';
import DemoWrapper from '../../DemoWrapper';

export default function LabelEditingDemo() {
  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });
  return (
    <DemoWrapper link="/x/react-tree-view/rich-tree-view/editing/">
      <Stack
        spacing={1}
        sx={{ width: '100%', padding: 2, minHeight: '600px' }}
        justifyContent="space-between"
      >
        <Box
          sx={{
            minHeight: 352,
            minWidth: 260,
            padding: 2,
            width: 'fit-content',
            alignSelf: 'center',
          }}
        >
          <ThemeProvider theme={theme}>
            <RichTreeView
              items={MUI_X_PRODUCTS}
              isItemEditable
              defaultExpandedItems={['grid', 'pickers']}
            />
          </ThemeProvider>
        </Box>

        <HighlightedCode
          code={'<RichTreeView\n  items={MUI_X_PRODUCTS}\n  isItemEditable\n/>'}
          language="js"
          sx={{ overflowX: 'hidden' }}
        />
      </Stack>
    </DemoWrapper>
  );
}
