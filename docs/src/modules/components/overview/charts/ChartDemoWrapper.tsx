import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { createTheme, ThemeOptions, ThemeProvider, useTheme } from '@mui/material/styles';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import DemoWrapper from '../DemoWrapper';
import { getTheme } from './theme/getTheme';

export default function ChartDemoWrapper(
  props: React.PropsWithChildren<{
    code?: string;
    link: string;
  }>,
) {
  const { code, link, children } = props;
  const currentTheme = useTheme();
  const theme = createTheme(currentTheme as ThemeOptions, getTheme(currentTheme.palette.mode));

  return (
    <DemoWrapper link={link}>
      <Stack
        spacing={1}
        sx={{
          width: '100%',
          padding: 2,
          minHeight: { md: 500 },
        }}
        justifyContent={code ? 'space-between' : 'space-around'}
      >
        <Box
          sx={{
            height: code ? 300 : 400,
            overflow: 'auto',
            minWidth: 260,
            py: 2,
            width: '100%',
            alignSelf: 'center',
          }}
        >
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </Box>

        {code && (
          <HighlightedCode code={code} language="js" sx={{ overflowX: 'hidden', maxHeight: 300 }} />
        )}
      </Stack>
    </DemoWrapper>
  );
}
