import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import { RadialBarChart, RadialBarSeries } from '@mui/x-charts-premium/RadialBarChart';
import { HighlightedCode } from '@mui/internal-core-docs/HighlightedCode';
import { ChartsAxisData } from '@mui/x-charts/models';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

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

const bandAxis = {
  data: ['0', '3', '6', '9', '12'],
  id: 'axis1',
  scaleType: 'band' as const,
  disableLine: true,
  disableTicks: true,
};

const valueAxis = {
  tickLabelPosition: 'center' as const,
  disableLine: true,
  disableTicks: true,
};

const getRadialChartParams = (layout: 'vertical' | 'horizontal') => ({
  series: series.map((s) => ({ ...s, layout })),
  rotationAxis: [
    layout === 'vertical'
      ? bandAxis
      : { ...valueAxis, tickLabelPosition: 'after' as const },
  ],
  radiusAxis: [layout === 'vertical' ? valueAxis : bandAxis],
  grid: { rotation: true, radius: true },
  height: 400,
});

export default function RadialBarClick() {
  const [axisData, setAxisData] = React.useState<ChartsAxisData | null>();
  const [layout, setLayout] = React.useState<'vertical' | 'horizontal'>('vertical');

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <ToggleButtonGroup
          value={layout}
          exclusive
          onChange={(event, newLayout) => {
            if (newLayout !== null) {
              setLayout(newLayout);
            }
          }}
          aria-label="chart layout"
        >
          <ToggleButton key="vertical" value="vertical">
            vertical
          </ToggleButton>
          <ToggleButton key="horizontal" value="horizontal">
            horizontal
          </ToggleButton>
        </ToggleButtonGroup>
        <Box sx={{ flexGrow: 1 }}>
          <RadialBarChart
            {...getRadialChartParams(layout)}
            onAxisClick={(event, d) => setAxisData(d)}
          />
        </Box>
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
