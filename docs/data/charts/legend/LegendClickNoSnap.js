// @ts-check

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';

import { ChartsLegend, PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';

import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { ChartDataProvider } from '@mui/x-charts/context';

/** @type {import('@mui/x-charts/PieChart').PieChartProps['series']} */
const pieSeries = [
  {
    type: 'pie',
    id: 'series-1',
    data: [
      { label: 'Pie A', id: 'P1-A', value: 400 },
      { label: 'Pie B', id: 'P2-B', value: 300 },
    ],
  },
];

/** @type {import('@mui/x-charts/BarChart').BarChartProps['series']} */
const barSeries = [
  {
    type: 'bar',
    id: 'series-1',
    label: 'Series 1',
    data: [0, 1, 2],
  },
  {
    type: 'bar',
    id: 'series-2',
    label: 'Series 2',
    data: [0, 1, 2],
  },
];

/** @type {import('@mui/x-charts/LineChart').LineChartProps['series']} */
const lineSeries = [
  {
    type: 'line',
    id: 'series-1',
    label: 'Series 1',
    data: [0, 1, 2],
  },
  {
    type: 'line',
    id: 'series-2',
    label: 'Series 2',
    data: [0, 1, 2],
  },
];

export default function LegendClickNoSnap() {
  const [itemData, setItemData] = React.useState();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'start',
        }}
      >
        <Typography>Chart Legend</Typography>
        <ChartDataProvider
          // @ts-ignore
          series={barSeries}
          width={400}
          height={60}
        >
          <ChartsLegend
            direction="horizontal"
            // @ts-ignore
            onItemClick={(event, context, index) => setItemData([context, index])}
          />
        </ChartDataProvider>
        <Typography>Pie Chart Legend</Typography>
        <ChartDataProvider
          // @ts-ignore
          series={pieSeries}
          width={400}
          height={60}
        >
          <ChartsLegend
            direction="horizontal"
            // @ts-ignore
            onItemClick={(event, context, index) => setItemData([context, index])}
          />
        </ChartDataProvider>
        <Typography>Piecewise Color Legend</Typography>
        <ChartDataProvider
          // @ts-ignore
          series={lineSeries}
          width={400}
          height={60}
          xAxis={[
            {
              scaleType: 'linear',
              data: [0, 1, 3],
              disableLine: true,
              colorMap: {
                type: 'piecewise',
                thresholds: [0, 2],
                colors: ['blue', 'gray', 'red'],
              },
            },
          ]}
        >
          <PiecewiseColorLegend
            direction="horizontal"
            axisDirection="x"
            // @ts-ignore
            onItemClick={(event, context, index) => setItemData([context, index])}
          />
        </ChartDataProvider>
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
            onClick={() => {
              // @ts-ignore
              setItemData(null);
            }}
          >
            <UndoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <HighlightedCode
          code={`// Index from item click: ${itemData ? itemData[1] : ''}

// Context from item click
${itemData ? JSON.stringify(itemData[0], null, 2) : '// The data will appear here'}
`}
          language="json"
          copyButtonHidden
        />
      </Stack>
    </Stack>
  );
}
