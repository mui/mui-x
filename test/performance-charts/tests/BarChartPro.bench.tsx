import * as React from 'react';
import { render, cleanup } from 'vitest-browser-react/pure';
import { describe, expect } from 'vitest';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { options } from '../utils/options';
import { bench } from '../utils/bench';

describe('BarChartPro', () => {
  const dataLength = 400;
  const data = Array.from({ length: dataLength + 1 }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);
  const yData = data.map((d) => d.y);

  bench(
    'BarChartPro with big data amount',
    async () => {
      const page = render(
        <BarChartPro
          xAxis={[{ id: 'x', data: xData, zoom: { filterMode: 'discard' } }]}
          initialZoom={[{ axisId: 'x', start: 25, end: 75 }]}
          series={[
            {
              data: yData,
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
});
