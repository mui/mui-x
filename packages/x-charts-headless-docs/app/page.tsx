'use client';
import * as React from 'react';
import { PieChart as PieChartBase } from 'packages/x-charts-headless/src';
// import { PieChart as PieChartMaterial } from '@mui/x-charts-material';
import type { PieChartProps } from '@mui/x-charts/PieChart';

const data: PieChartProps = {
  height: 300,
  series: [
    {
      arcLabel: 'value',
      arcLabelMinAngle: 10,
      innerRadius: '70%',
      data: [
        { value: 15, label: 'A' },
        { value: 20, label: 'B' },
      ],
    },
    {
      outerRadius: '70%',
      innerRadius: '40%',
      cx: '100%',
      startAngle: 180,
      arcLabel: 'value',
      data: [
        { value: 15, label: 'D', color: 'rgb(135, 120, 255)' },
        { value: 25, label: 'E', color: 'rgb(160, 143, 255)' },
        { value: 35, label: 'F', color: 'rgb(185, 166, 255)' },
      ],
    },
    {
      outerRadius: '70%',
      innerRadius: '40%',
      cx: '0%',
      endAngle: 180,
      arcLabel: 'value',
      data: [
        { value: 15, label: 'D', color: 'rgb(255, 194, 163)' },
        { value: 25, label: 'E', color: 'rgb(255, 186, 138)' },
        { value: 35, label: 'F', color: 'rgb(255, 177, 112)' },
      ],
    },
  ],
};

export default function Home() {
  return (
    <div>
      <h2>POC: Base and Material UI packages</h2>
      <p>
        This example demonstrates the proposed architecture where charts functionality is split into
        two packages:
      </p>
      <ul>
        <li>
          <strong>@mui/x-charts-headless</strong>: Framework-agnostic core with inline styles and a
          custom theme system
        </li>
        <li>
          <strong>@mui/x-charts-material</strong>: Material UI integration layer using material
          components and theming
        </li>
      </ul>

      <PieChartBase.Root {...data}>
        <PieChartBase.Surface>
          <PieChartBase.Plot />
          <PieChartBase.LabelPlot />
        </PieChartBase.Surface>
      </PieChartBase.Root>
      {/* <PieChartMaterial {...data} /> */}
    </div>
  );
}
