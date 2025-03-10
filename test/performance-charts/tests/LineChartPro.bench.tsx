import * as React from 'react';
import { bench, describe } from 'vitest';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { options } from '../utils/options';
import { directRender } from '../utils/directRender';

describe('LineChartPro', () => {
  const dataLength = 200;
  const data = Array.from({ length: dataLength }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);
  const yData = data.map((d) => d.y);

  bench(
    'LineChartPro with big data amount',
    async () => {
      const { unmount, findByText } = directRender(
        <LineChartPro
          xAxis={[{ id: 'x', data: xData, zoom: { filterMode: 'discard' } }]}
          initialZoom={[{ axisId: 'x', start: 50, end: 75 }]}
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
