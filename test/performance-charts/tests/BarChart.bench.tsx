import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { afterEach, bench, describe } from 'vitest';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { options } from '../utils/options';

describe('BarChart', () => {
  afterEach(() => {
    cleanup();
  });

  const dataLength = 250;
  const data = Array.from({ length: dataLength + 1 }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => `n${d.x}`);
  const yData = data.map((d) => d.y);

  const props: BarChartProps = {
    xAxis: [
      {
        id: 'x',
        scaleType: 'band',
        data: xData,
      },
    ],
    series: [
      {
        data: yData,
      },
    ],
    width: 500,
    height: 300,
  };

  bench(
    'BarChart with big data amount',
    async () => {
      const { findByText } = render(<BarChart {...props} />);

      await findByText('60', { ignore: 'span' });
    },
    options,
  );
});
