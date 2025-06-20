import * as React from 'react';
import { ScatterSeriesType } from '@mui/x-charts/models';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ChartsTooltipContainer, useItemTooltip } from '@mui/x-charts/ChartsTooltip';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import data from '../data/transistorCPU';
import ChartDemoWrapper from '../ChartDemoWrapper';

const chartSetting = {
  yAxis: [{ label: 'processor density', width: 60, scaleType: 'log' as const }],
  xAxis: [{ valueFormatter: (v: number | null) => (v ? v.toString() : '') }],
};

const constructors = ['Intel', 'Apple', 'AMD'];

const series: ScatterSeriesType[] = [
  {
    type: 'scatter',
    label: 'Other',
    highlightScope: { highlight: 'item', fade: 'global' },
    data: data
      .filter((item) => !constructors.includes(item.constructor) && item.density !== null)
      .map((item) => ({ x: item.year, y: item.density as number, id: item.id })),
  },
  ...constructors.map(
    (constructor): ScatterSeriesType => ({
      type: 'scatter',
      label: constructor,
      highlightScope: { highlight: 'item', fade: 'global' },
      data: data
        .filter((item) => item.constructor === constructor && item.density !== null)
        .map((item) => ({ x: item.year, y: item.density as number, id: item.id })),
    }),
  ),
];

const numberFormatter = new Intl.NumberFormat('en-US').format;

function CustomTooltip() {
  const item = useItemTooltip<'scatter'>();

  return (
    <ChartsTooltipContainer trigger="item">
      <Paper sx={{ p: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Box
            sx={{ width: 20, height: 20, backgroundColor: item?.color, borderRadius: 1, mr: 2 }}
          />
          <Typography>{item?.label}</Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography sx={{ mr: 3 }}>{item?.value.x}</Typography>
          <Typography>{item?.value.y == null ? 'NaN' : numberFormatter(item?.value.y)}</Typography>
        </Box>
      </Paper>
    </ChartsTooltipContainer>
  );
}

function Scatter() {
  return (
    <ScatterChart
      series={series}
      grid={{ horizontal: true, vertical: true }}
      voronoiMaxRadius={20}
      slots={{ tooltip: CustomTooltip }}
      {...chartSetting}
    />
  );
}

export default function ScatterChartDemo() {
  return (
    <ChartDemoWrapper
      link="/x/react-charts/scatter/"
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
    >
      <Scatter />
    </ChartDemoWrapper>
  );
}
