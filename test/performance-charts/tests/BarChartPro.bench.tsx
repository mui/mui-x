import * as React from 'react';
import { bench, describe } from 'vitest';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { options } from '../utils/options';
import { directRender } from '../utils/directRender';

describe('BarChartPro', () => {
  const dataLength = 400;
  const data = Array.from({ length: dataLength + 1 }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);
  const yData = data.map((d) => d.y);

  bench(
    'BarChartPro with big data amount',
    async () => {
      const { unmount, findByText } = directRender(
        <BarChartPro
          xAxis={[{ id: 'x', scaleType: 'band', data: xData, zoom: { filterMode: 'discard' } }]}
          initialZoom={[{ axisId: 'x', start: 25, end: 75 }]}
          series={[
            {
              data: yData,
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
