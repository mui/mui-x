import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Chance } from 'chance';

const chance = new Chance(42);

const data = Array.from({ length: 50 }, () => ({
  x: chance.floating({ min: -20, max: 20 }),
  y: chance.floating({ min: -20, max: 20 }),
})).map((d, index) => ({ ...d, id: index }));

export default function BasicLegend() {
  return (
    <ScatterChart
      series={[
        { type: 'scatter', label: 'var A', data: data.slice(0, 25) },
        { type: 'scatter', label: 'var B', data: data.slice(25) },
      ]}
      width={400}
      height={300}
    />
  );
}
