import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { useScatterSeries, useXScale, useYScale } from '@mui/x-charts/hooks';

const data1 = [
  { x: 100, y: 200, id: 1 },
  { x: 120, y: 100, id: 2 },
  { x: 170, y: 300, id: 3 },
  { x: 140, y: 250, id: 4 },
  { x: 150, y: 400, id: 5 },
  { x: 110, y: 280, id: 6 },
];
const data2 = [
  { x: 300, y: 300, id: 1 },
  { x: 200, y: 700, id: 2 },
  { x: 400, y: 500, id: 3 },
  { x: 340, y: 350, id: 4 },
  { x: 420, y: 280, id: 5 },
];

const chartSetting = {
  width: 500,
  height: 300,
};

function LinkPoints({ seriesId, close }: { seriesId: string; close?: boolean }) {
  const scatter = useScatterSeries();
  const xScale = useXScale();
  const yScale = useYScale();

  if (!scatter) {
    return null;
  }

  const color = scatter.series[seriesId]?.color;
  const data = scatter.series[seriesId]?.data;

  if (!data) {
    return null;
  }

  return (
    <path
      fill="none"
      stroke={color}
      strokeWidth={2}
      d={`M ${data.map(({ x, y }) => `${xScale(x)}, ${yScale(y)}`).join(' L')}${
        close ? 'Z' : ''
      }`}
    />
  );
}

export default function LinkPointsScatterChart() {
  return (
    <ScatterChart
      series={[
        {
          id: 's1',
          data: data1,
          label: 'Open',
        },
        {
          data: data2,
          id: 's2',
          label: 'Closed',
        },
      ]}
      xAxis={[{ min: 0 }]}
      {...chartSetting}
    >
      <LinkPoints seriesId="s1" />
      <LinkPoints seriesId="s2" close />
    </ScatterChart>
  );
}
