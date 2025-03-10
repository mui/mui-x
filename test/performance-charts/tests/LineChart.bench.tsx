import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { bench, describe, vi } from 'vitest';
import { LineChart } from '@mui/x-charts/LineChart';
import { options } from '../utils/options';

vi.spyOn(React, 'act').mockImplementation(async (cb) => {
  await cb();
});

describe('LineChart', () => {
  const dataLength = 200;
  const data = Array.from({ length: dataLength }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);
  const yData = data.map((d) => d.y);

  bench(
    'LineChart with big data amount',
    async () => {
      const { findByText } = render(
        <LineChart
          xAxis={[{ data: xData }]}
          series={[
            {
              data: yData,
            },
          ]}
          width={500}
          height={300}
        />,
      );

      await findByText(dataLength.toLocaleString(), { ignore: 'span' });

      cleanup();
    },
    options,
  );
});
