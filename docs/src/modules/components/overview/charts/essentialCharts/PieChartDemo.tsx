import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import DemoWrapper from '../../DemoWrapper';

// Data derived from https://gs.statcounter.com/os-market-share/desktop/worldwide/2023
// And https://gs.statcounter.com/os-market-share/mobile/worldwide/2023
// And https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/worldwide/2023
// For the month of December 2023

const desktopOS = [
  {
    label: 'Windows',
    value: 72.72,
  },
  {
    label: 'OS X',
    value: 16.38,
  },
  {
    label: 'Linux',
    value: 3.83,
  },
  {
    label: 'Chrome OS',
    value: 2.42,
  },
  {
    label: 'Other',
    value: 4.65,
  },
];

const valueFormatter = (item: { value: number }) => `${item.value}%`;

function Pie() {
  return (
    <PieChart
      series={[
        {
          data: desktopOS,
          valueFormatter,
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fontWeight: 'bold',
        },
      }}
    />
  );
}

export default function PieChartDemo() {
  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  return (
    <DemoWrapper link="/x/react-charts/pie/">
      <Stack
        spacing={1}
        sx={{ width: '100%', padding: 2, minHeight: '600px' }}
        justifyContent="space-between"
      >
        <Box
          sx={{
            height: 352,
            overflow: 'auto',
            minWidth: 260,
            padding: 2,
            width: 'fit-content',
            alignSelf: 'center',
          }}
        >
          <ThemeProvider theme={theme}>
            <Pie />
          </ThemeProvider>
        </Box>

        <HighlightedCode
          code={`
<PieChart
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
