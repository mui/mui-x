import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { afterEach, bench, describe } from 'vitest';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { options } from '../utils/options';

describe('ScatterChartPro', () => {
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
    'ScatterChartPro with big data amount',
    async () => {
      const { findByText } = render(
        <ScatterChartPro
          xAxis={[{ id: 'x', data: xData, zoom: { filterMode: 'discard' } }]}
          zoom={[{ axisId: 'x', start: 0.25, end: 0.75 }]}
          series={[
            {
              data,
            },
          ]}
          width={500}
          height={300}
        />,
      );

      await findByText('70', { ignore: 'span' });
    },
    options,
  );
});
