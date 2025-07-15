import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { useScatterSeries, useXScale, useYScale } from '@mui/x-charts/hooks';

const data1 = [
  { x: 95, y: 200, id: 1 },
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

const series = [
  { id: 's1', data: data1, label: 'Open' },
  { id: 's2', data: data2, label: 'Closed' },
];

function LinkPoints({ seriesId, close }) {
  const scatter = useScatterSeries(seriesId);
  const xScale = useXScale();
  const yScale = useYScale();

  if (!scatter) {
    return null;
  }
  const { color, data } = scatter;

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

export default function CustomScatter() {
  return (
    <ScatterChart series={series} height={300}>
      <LinkPoints seriesId="s1" />
      <LinkPoints seriesId="s2" close />
    </ScatterChart>
  );
}
