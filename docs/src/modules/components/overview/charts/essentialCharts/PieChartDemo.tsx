/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ChartDemoWrapper from '../ChartDemoWrapper';

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
    <Stack height="100%">
      <Typography align="center">Desktop OS market share</Typography>
      <PieChart
        series={[
          {
            data: desktopOS,
            valueFormatter,
            arcLabel: 'label',
            arcLabelMinAngle: 35,
            arcLabelRadius: '50%',
            outerRadius: '90%',
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack>
  );
}

export default function PieChartDemo() {
  return (
    <ChartDemoWrapper
      link="/x/react-charts/pie/"
      code={`
<PieChart
  series={[{
    data: desktopOS,
    valueFormatter,
  }]}
/>`}
    >
      <Pie />
    </ChartDemoWrapper>
  );
}
