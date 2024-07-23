import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { afterEach, bench, describe } from 'vitest';
import { LineChart } from '@mui/x-charts/LineChart';

describe('LineChart', () => {
  afterEach(() => {
    cleanup();
  });

  const data = Array.from({ length: 10_000 }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);
  const yData = data.map((d) => d.y);

  bench('10_000 data', async () => {
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

    await findByText('5,000');
  });
});
