import * as React from 'react';
import { render } from 'vitest-browser-react/pure';
import { describe, expect } from 'vitest';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { options } from '../utils/options';
import { bench } from '../utils/bench';

describe('ScatterChart', () => {
  const dataLength = 5_000;
  const data = Array.from({ length: dataLength }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);

  bench(
    'ScatterChart with big data amount',
    async () => {
      const page = render(
        <ScatterChart
          xAxis={[{ data: xData, valueFormatter: (v: number) => v.toLocaleString('en-US') }]}
          series={[{ data }]}
          width={500}
          height={300}
        />,
      );

      expect(page.getByText(dataLength.toLocaleString('en-US'))).toBeInTheDocument();
    },
    options,
  );
});
