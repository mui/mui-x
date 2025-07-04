import * as React from 'react';
import { render, cleanup } from 'vitest-browser-react/pure';
import { describe, expect } from 'vitest';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { options } from '../utils/options';
import { bench } from '../utils/bench';

describe('ScatterChartPro', () => {
  const dataLength = 50;
  const data = Array.from({ length: dataLength }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);

  bench(
    'ScatterChartPro with big data amount',
    async () => {
      const page = render(
        <ScatterChartPro
          xAxis={[
            {
              id: 'x',
              data: xData,
              zoom: { filterMode: 'discard' },
              valueFormatter: (v: number) => v.toLocaleString('en-US'),
            },
          ]}
          initialZoom={[{ axisId: 'x', start: 20, end: 70 }]}
          series={[
            {
              data,
            },
          ]}
          width={500}
          height={300}
        />,
      );

      expect(page.getByText('60')).toBeInTheDocument();

      cleanup();
    },
    options,
  );

  bench(
    'ScatterChartPro with big data amount and zoomed in',
    async () => {
      const page = render(
        <ScatterChartPro
          xAxis={[
            {
              id: 'x',
              data: xData,
              valueFormatter: (v: number) => v.toLocaleString('en-US'),
              zoom: { minSpan: 0 },
            },
          ]}
          yAxis={[{ id: 'y', zoom: { minSpan: 0 } }]}
          series={[{ data }]}
          width={500}
          height={300}
          initialZoom={[
            { axisId: 'x', start: 50, end: 50.1 },
            { axisId: 'y', start: 50, end: 50.1 },
          ]}
        />,
      );

      expect(page.getByText('50.06')).toBeInTheDocument();

      cleanup();
    },
    options,
  );
});
