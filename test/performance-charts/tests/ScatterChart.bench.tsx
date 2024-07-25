import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { afterEach, bench, describe } from 'vitest';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { options } from '../utils/options';

describe('ScatterChart', () => {
  afterEach(() => {
    cleanup();
  });

  const data = Array.from({ length: 20_000 }).map((_, i) => ({
    id: i,
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);

  bench(
    'Big data amount',
    async () => {
      const { findByText } = render(
        <ScatterChart
          xAxis={[{ data: xData }]}
          series={[
            {
              data,
            },
          ]}
          width={500}
          height={300}
        />,
      );

      await findByText('15,000');
    },
    options,
  );
});
