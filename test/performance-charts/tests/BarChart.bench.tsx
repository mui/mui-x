import * as React from 'react';
import { render } from 'vitest-browser-react/pure';
import { describe, expect } from 'vitest';
import { BarChart } from '@mui/x-charts/BarChart';
import { options } from '../utils/options';
import { bench } from '../utils/bench';

describe('BarChart', () => {
  const dataLength = 1_200;
  const data = Array.from({ length: dataLength + 1 }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);
  const yData = data.map((d) => d.y);

  bench(
    'BarChart with big data amount',
    async () => {
      const page = render(
        <BarChart xAxis={[{ data: xData }]} series={[{ data: yData }]} width={500} height={300} />,
      );

      expect(page.getByText('96')).toBeInTheDocument();
    },
    options,
  );
});
