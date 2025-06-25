import * as React from 'react';
import { render } from 'vitest-browser-react/pure';
import { describe, expect } from 'vitest';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { options } from '../utils/options';
import { bench } from '../utils/bench';

describe('LineChartPro', () => {
  const dataLength = 5_000;
  const data = Array.from({ length: dataLength }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);
  const yData = data.map((d) => d.y);

  bench(
    'LineChartPro with big data amount and zoomed in (with marks)',
    async () => {
      const page = render(
        <LineChartPro
          xAxis={[{ id: 'x', data: xData, zoom: { filterMode: 'discard' } }]}
          initialZoom={[{ axisId: 'x', start: 50, end: 75 }]}
          series={[{ data: yData, showMark: true }]}
          width={500}
          height={300}
        />,
      );

      expect(page.getByText('2,600')).toBeInTheDocument();
    },
    options,
  );
});
