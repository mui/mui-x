import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';

import {
  Unstable_RadialBarChart as RadialBarChart,
  RadialBarSeries,
} from '@mui/x-charts-premium/RadialBarChart';

import { HighlightedCode } from '@mui/internal-core-docs/HighlightedCode';
import { ChartsAxisData } from '@mui/x-charts/models';

const highlightScope = { highlight: 'item' } as const;

const series: RadialBarSeries[] = [
  {
    id: 'series-1',
    data: [3, 4, 1, 6, 5],
    label: 'A',
    stack: 'total',
    highlightScope,
  },
  {
    id: 'series-2',
    data: [4, 3, 1, 5, 8],
    label: 'B',
    stack: 'total',
    highlightScope,
  },
  {
    id: 'series-3',
    data: [4, 2, 5, 4, 1],
    label: 'C',
    highlightScope,
  },
];

const radialChartParams = {
  series,
  rotationAxis: [
    { data: ['0', '3', '6', '9', '12'], id: 'axis1', scaleType: 'band' as const },
  ],
  height: 400,
};

export default function RadialBarClick() {
  const [axisData, setAxisData] = React.useState<ChartsAxisData | null>();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <RadialBarChart
          {...radialChartParams}
          onAxisClick={(event, d) => setAxisData(d)}
        />
      </Box>

      <Stack direction="column" sx={{ width: { xs: '100%', md: '40%' } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography>Click on the chart</Typography>
          <IconButton
            aria-label="reset"
            size="small"
            onClick={() => setAxisData(null)}
          >
            <UndoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <HighlightedCode
          code={`// Data from axis click
${axisData ? JSON.stringify(axisData, null, 2) : '// The data will appear here'}
`}
          language="json"
          copyButtonHidden
        />
      </Stack>
    </Stack>
  );
}
