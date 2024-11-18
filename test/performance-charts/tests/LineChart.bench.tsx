import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { afterEach, bench, describe } from 'vitest';
import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';
import { options } from '../utils/options';

describe('LineChart', () => {
  afterEach(() => {
    cleanup();
  });

  const dataLength = 600;
  const data = Array.from({ length: dataLength }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);
  const yData = data.map((d) => d.y);

  const props: LineChartProps = {
    xAxis: [{ data: xData }],
    series: [{ data: yData }],
    width: 500,
    height: 300,
    experimentalMarkRendering: true,
  };

  bench(
    'LineChart with big data amount',
    async () => {
      const { findByText } = render(<LineChart {...props} />);

      await findByText('60', { ignore: 'span' });
    },
    options,
  );
});
