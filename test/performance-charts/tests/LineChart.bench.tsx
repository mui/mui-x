import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { describe } from 'vitest';
import { LineChart } from '@mui/x-charts/LineChart';
import { options } from '../utils/options';
import { bench } from '../utils/bench';

describe('LineChart', () => {
  const dataLength = 1_400;
  const data = Array.from({ length: dataLength }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);
  const yData = data.map((d) => d.y);

  bench(
    'LineChart with big data amount (with marks)',
    async () => {
      const { findByText } = render(
        <LineChart
          xAxis={[{ data: xData }]}
          series={[{ data: yData, showMark: true }]}
          width={500}
          height={300}
        />,
      );

      await findByText(dataLength.toLocaleString(), { ignore: 'span' });

      cleanup();
    },
    options,
  );

  bench(
    'Area chart with big data amount (no marks)',
    async () => {
      const { findByText } = render(
        <LineChart
          xAxis={[{ data: xData }]}
          series={[{ area: true, data: yData, showMark: false }]}
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
