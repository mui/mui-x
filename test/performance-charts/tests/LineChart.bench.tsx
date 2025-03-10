import * as React from 'react';
import { bench, describe } from 'vitest';
import { LineChart } from '@mui/x-charts/LineChart';
import { options } from '../utils/options';
import { directRender } from '../utils/directRender';

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
      const { unmount, findByText } = directRender(
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

      unmount();
    },
    options,
  );
});
