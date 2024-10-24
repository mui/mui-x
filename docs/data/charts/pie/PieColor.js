import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
import { platforms } from './webUsageStats';

const palette = ['lightcoral', 'slateblue'];

const colorPerItem = [
  { ...platforms[0], color: 'orange' },
  { ...platforms[1], color: 'gray' },
];

export default function PieColor() {
  return (
    <Stack direction="row" width="100%" textAlign="center" spacing={2}>
      <Box flexGrow={1}>
        <Typography>Default</Typography>
        <PieChart
          series={[
            {
              data: platforms,
            },
          ]}
          {...pieParams}
        />
      </Box>
      <Box flexGrow={1}>
        <Typography>Palette</Typography>
        <PieChart
          colors={palette}
          series={[
            {
              data: platforms,
            },
          ]}
          {...pieParams}
        />
      </Box>
      <Box flexGrow={1}>
        <Typography>Item</Typography>
        <PieChart
          series={[
            {
              data: colorPerItem,
            },
          ]}
          {...pieParams}
        />
      </Box>
    </Stack>
  );
}

const pieParams = {
  height: 200,
  margin: { right: 5 },
  hideLegend: true,
};
