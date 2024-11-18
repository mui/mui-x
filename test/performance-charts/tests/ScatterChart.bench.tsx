import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { afterEach, bench, describe } from 'vitest';
import { ScatterChart, ScatterChartProps } from '@mui/x-charts/ScatterChart';
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

  const props: ScatterChartProps = {
    xAxis: [
      {
        data: xData,
        valueFormatter: (v) => `n${v}`,
      },
    ],
    series: [{ data }],
    width: 500,
    height: 300,
  };

  bench(
    'ScatterChart with big data amount',
    async () => {
      const { findByText } = render(<ScatterChart {...props} />);

      await findByText('60', { ignore: 'span' });
    },
    options,
  );
});
