import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { afterEach, bench, describe } from 'vitest';
import { BarChart } from '@mui/x-charts/BarChart';
import { options } from '../utils/options';

describe('BarChart', () => {
  afterEach(() => {
    cleanup();
  });

  const data = Array.from({ length: 2_000 }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);
  const yData = data.map((d) => d.y);

  bench(
    'Big data amount',
    async () => {
      const { findByText } = render(
        <BarChart
          xAxis={[
            {
              scaleType: 'band',
              data: xData,
              tickInterval: (v, i) => i % 100 === 0,
            },
          ]}
          series={[{ data: yData }]}
          width={500}
          height={300}
        />,
      );

      await findByText('1100');
    },
    options,
  );
});
