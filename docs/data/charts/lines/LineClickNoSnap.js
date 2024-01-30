import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { LineChart } from '@mui/x-charts/LineChart';

import HighlightedCode from 'docs/src/modules/components/HighlightedCode';

const lineChartsParams = {
  series: [
    {
      id: 'series-1',
      data: [3, 4, 1, 6, 5],
      label: 'A',
      area: true,
      stack: 'total',
      highlightScope: {
        highlighted: 'item',
      },
    },
    {
      id: 'series-2',
      data: [4, 3, 1, 5, 8],
      label: 'B',
      area: true,
      stack: 'total',
      highlightScope: {
        highlighted: 'item',
      },
    },
    {
      id: 'series-3',
      data: [4, 2, 5, 4, 1],
      label: 'C',
      area: true,
      stack: 'total',
      highlightScope: {
        highlighted: 'item',
      },
    },
  ],
  xAxis: [{ data: [0, 3, 6, 9, 12], scaleType: 'linear', id: 'axis1' }],
  height: 400,
};

export default function LineClickNoSnap() {
  const [itemData, setItemData] = React.useState();
  const [axisData, setAxisData] = React.useState();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <LineChart
          {...lineChartsParams}
          onAreaClick={(event, d) => setItemData(d)}
          onMarkClick={(event, d) => setItemData(d)}
          onLineClick={(event, d) => setItemData(d)}
          onAxisClick={(event, d) => setAxisData(d)}
        />
      </Box>

      <Stack direction="column" sx={{ width: { xs: '100%', md: '40%' } }}>
        <Typography>click data</Typography>
        <HighlightedCode
          code={`// Data from item click
${itemData ? JSON.stringify(itemData, null, 2) : '// click on the chart'}

// Data from axis click
${axisData ? JSON.stringify(axisData, null, 2) : '// click on the chart'}
`}
          language="json"
          copyButtonHidden
        />
      </Stack>
    </Stack>
  );
}
