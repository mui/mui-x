import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { BarChart } from '@mui/x-charts/BarChart';

import HighlightedCode from 'docs/src/modules/components/HighlightedCode';

const barChartsParams = {
  series: [
    {
      id: 'series-1',
      data: [3, 4, 1, 6, 5],
      label: 'A',
      stack: 'total',
      highlightScope: {
        highlighted: 'item',
      },
    },
    {
      id: 'series-2',
      data: [4, 3, 1, 5, 8],
      label: 'B',
      stack: 'total',
      highlightScope: {
        highlighted: 'item',
      },
    },
    {
      id: 'series-3',
      data: [4, 2, 5, 4, 1],
      label: 'C',
      highlightScope: {
        highlighted: 'item',
      },
    },
  ],
  xAxis: [{ data: ['0', '3', '6', '9', '12'], scaleType: 'band', id: 'axis1' }],
  height: 400,
};

export default function BarClickNoSnap() {
  const [itemData, setItemData] = React.useState();
  const [axisData, setAxisData] = React.useState();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <BarChart
          {...barChartsParams}
          onItemClick={(event, d) => setItemData(d)}
          onAxisClick={(event, d) => setAxisData(d)}
        />
      </Box>

      <Stack direction="column" sx={{ width: { xs: '100%', md: '40%' } }}>
        <Typography>click data</Typography>
        <HighlightedCode
          code={`// Data from item click
${itemData ? JSON.stringify(itemData, null, 2) : '// click on the chart'}

// Data from item click
${axisData ? JSON.stringify(axisData, null, 2) : '// click on the chart'}
`}
          language="json"
          copyButtonHidden
        />
      </Stack>
    </Stack>
  );
}
