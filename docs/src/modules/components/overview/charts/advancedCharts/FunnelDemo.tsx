import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import DemoWrapper from '../../DemoWrapper';

function Funnel() {
  return (
    <FunnelChart
      series={[
        {
          curve: 'linear',
          variant: 'outlined',
          borderRadius: 2,
          valueFormatter: ({ value }) => `${value}%`,
          data: [
            { value: 100, label: 'Visitors' },
            { value: 68, label: 'Pick item' },
            { value: 21, label: 'Start payment' },
            { value: 5, label: 'Paid' },
          ],
        },
      ]}
      gap={6}
    />
  );
}

export default function FunnelDemo() {
  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  return (
    <DemoWrapper link="/x/react-charts/pie/">
      <Stack spacing={1} sx={{ width: '100%', padding: 2 }} justifyContent="space-between">
        <Box
          sx={{
            height: 352,
            overflow: 'auto',
            minWidth: 260,
            padding: 2,
            width: '100%',
            alignSelf: 'center',
          }}
        >
          <ThemeProvider theme={theme}>
            <Funnel />
          </ThemeProvider>
        </Box>

        <HighlightedCode
          code={`
<FunnelChart
  series={[{
    data: desktopOS,
    valueFormatter,
  }]}
/>`}
          language="js"
          sx={{ overflowX: 'hidden' }}
        />
      </Stack>
    </DemoWrapper>
  );
}
