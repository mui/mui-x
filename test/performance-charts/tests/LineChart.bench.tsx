import * as React from 'react';
import { render } from 'vitest-browser-react/pure';
import { describe, expect } from 'vitest';
import { LineChart } from '@mui/x-charts/LineChart';
import { options } from '../utils/options';
import { bench } from '../utils/bench';

describe('LineChart', () => {
  const dataLength = 5_000;
  const data = Array.from({ length: dataLength }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);
  const yData = data.map((d) => d.y);

  bench(
    'LineChart with big data amount (with marks)',
    async () => {
      const page = render(
        <LineChart
          xAxis={[{ data: xData }]}
          series={[{ data: yData, showMark: true }]}
          width={500}
          height={300}
        />,
      );

      expect(page.getByText(dataLength.toLocaleString())).toBeInTheDocument();
    },
    options,
  );

  bench(
    'Area chart with big data amount (no marks)',
    async () => {
      const page = render(
        <LineChart
          xAxis={[{ data: xData }]}
          series={[{ area: true, data: yData, showMark: false }]}
          width={500}
          height={300}
        />,
      );

      expect(page.getByText(dataLength.toLocaleString())).toBeInTheDocument();
    },
    options,
  );
});
