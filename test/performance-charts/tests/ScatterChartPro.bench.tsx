import * as React from 'react';
import { bench, describe } from 'vitest';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { options } from '../utils/options';
import { directRender } from '../utils/directRender';

describe('ScatterChartPro', () => {
  const dataLength = 50;
  const data = Array.from({ length: dataLength }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);

  bench(
    'ScatterChartPro with big data amount',
    async () => {
      const { unmount, findByText } = directRender(
        <ScatterChartPro
          xAxis={[
            {
              id: 'x',
              data: xData,
              zoom: { filterMode: 'discard' },
              valueFormatter: (v) => v.toLocaleString('en-US'),
            },
          ]}
          initialZoom={[{ axisId: 'x', start: 20, end: 70 }]}
          series={[
            {
              data,
            },
          ]}
          width={500}
          height={300}
        />,
      );

      await findByText('60', { ignore: 'span' });

      unmount();
    },
    options,
  );
});
