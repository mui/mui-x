import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import DemoWrapper from '../../DemoWrapper';
import data from '../data/transistorCPU';
import { ScatterSeriesType } from '@mui/x-charts/models';

const chartSetting = {
  yAxis: [{ label: 'processor density', width: 60, scaleType: 'log' as const }],
  xAxis: [{ valueFormatter: (v: number | null) => (v ? v.toString() : '') }],
};

const constructors = ['Intel', 'Apple', 'AMD'];

const series: ScatterSeriesType[] = [
  {
    type: 'scatter',
    label: 'Other',
    // highlightScope: { highlight: 'item', fade: 'global' },
    data: data
      .filter((item) => !constructors.includes(item.constructor) && item.density !== null)
      .map((item) => ({ x: item.year, y: item.density as number, id: item.id })),
  },
  ...constructors.map(
    (constructor): ScatterSeriesType => ({
      type: 'scatter',
      label: constructor,
      // highlightScope: { highlight: 'series', fade: 'global' },
      data: data
        .filter((item) => item.constructor === constructor && item.density !== null)
        .map((item) => ({ x: item.year, y: item.density as number, id: item.id })),
    }),
  ),
];

function Scatter() {
  return (
    <ScatterChart
      series={series}
      grid={{ horizontal: true, vertical: true }}
      voronoiMaxRadius={20}
      slotProps={{ tooltip: { trigger: 'none' } }}
      {...chartSetting}
    />
  );
}

export default function ScatterChartDemo() {
  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  return (
    <DemoWrapper link="/x/react-charts/bar/">
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
            width: '100%',
            alignSelf: 'center',
          }}
        >
          <ThemeProvider theme={theme}>
            <Scatter />
          </ThemeProvider>
        </Box>

        <HighlightedCode
          code={`
<ScatterChart
  series={[
    { label: 'Other', data },
    { label: 'Intel', data },
    { label: 'Apple', data },
    { label: 'IBM', data },
  ]}
  yAxis={[{ scaleType: 'log', label: 'processor density' }]}
/>`}
          language="js"
          sx={{ overflowX: 'hidden' }}
        />
      </Stack>
    </DemoWrapper>
  );
}
