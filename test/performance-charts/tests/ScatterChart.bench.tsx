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

  const dataLength = 1_000;
  const data = Array.from({ length: dataLength }).map((_, i) => ({
    id: i,
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);

  bench(
    'ScatterChart with big data amount',
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

      await findByText(dataLength.toLocaleString(), { ignore: 'span' });
    },
    options,
  );
});
