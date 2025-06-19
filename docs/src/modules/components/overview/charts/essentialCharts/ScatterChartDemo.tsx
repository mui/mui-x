import * as React from 'react';
import { ScatterSeriesType } from '@mui/x-charts/models';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
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
