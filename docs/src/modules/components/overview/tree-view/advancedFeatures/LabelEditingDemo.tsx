import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS } from './products';
import DemoWrapper from '../../DemoWrapper';

export default function LabelEditingDemo() {
  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });
  const [showIndicator, setShowIndicator] = React.useState(true);

  return (
    <DemoWrapper link="/x/react-tree-view/rich-tree-view/editing/">
      <Stack
        spacing={1}
        sx={{ width: '100%', padding: 2, minHeight: '600px' }}
        justifyContent="space-between"
        onMouseEnter={() => {
          setShowIndicator(false);
        }}
      >
        <Box
          sx={{
            minHeight: 352,
            minWidth: 260,
            padding: 2,
            width: 'fit-content',
            alignSelf: 'center',
            position: 'relative',
          }}
        >
          <ThemeProvider theme={theme}>
            <RichTreeView
              items={MUI_X_PRODUCTS}
              isItemEditable
              defaultExpandedItems={['grid', 'pickers']}
              defaultSelectedItems={'grid-community'}
            />
          </ThemeProvider>
          {showIndicator && (
            <Paper
              variant="outlined"
              sx={{ position: 'absolute', top: 70, left: -95, px: 2, py: 0.5 }}
            >
              {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Double click me to edit
              </Typography>
            </Paper>
          )}
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
