import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { PieChart } from '@mui/x-charts/PieChart';

import HighlightedCode from 'docs/src/modules/components/HighlightedCode';

const data1 = [
  { label: 'Group A', value: 400 },
  { label: 'Group B', value: 300 },
  { label: 'Group C', value: 300 },
  { label: 'Group D', value: 200 },
];

const data2 = [
  { label: 'A1', value: 100 },
  { label: 'A2', value: 300 },
  { label: 'B1', value: 100 },
  { label: 'B2', value: 80 },
  { label: 'B3', value: 40 },
  { label: 'B4', value: 30 },
  { label: 'B5', value: 50 },
  { label: 'C1', value: 100 },
  { label: 'C2', value: 200 },
  { label: 'D1', value: 150 },
  { label: 'D2', value: 50 },
];
const series = [
  {
    innerRadius: 0,
    outerRadius: 80,
    id: 'series-1',
    data: data1,
  },
  {
    innerRadius: 100,
    outerRadius: 120,
    id: 'series-2',
    data: data2,
  },
];

export default function PieClickNoSnap() {
  const [itemData, setItemData] = React.useState();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <PieChart
          series={series}
          width={400}
          height={300}
          slotProps={{
            legend: { hidden: true },
          }}
          onItemClick={(event, d) => setItemData(d)}
        />{' '}
      </Box>

      <Stack direction="column" sx={{ width: { xs: '100%', md: '40%' } }}>
        <Typography>click data</Typography>
        <HighlightedCode
          code={`// Data from item click
${itemData ? JSON.stringify(itemData, null, 2) : '// click on the chart'}
`}
          language="json"
          copyButtonHidden
        />
      </Stack>
    </Stack>
  );
}
