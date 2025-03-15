import * as React from 'react';
import { bench, describe } from 'vitest';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { options } from '../utils/options';
import { directRender } from '../utils/directRender';

describe('ScatterChart', () => {
  const dataLength = 800;
  const data = Array.from({ length: dataLength }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);

  bench(
    'ScatterChart with big data amount',
    async () => {
      const { unmount, findByText } = directRender(
        <ScatterChart
          xAxis={[{ data: xData, valueFormatter: (v) => v.toLocaleString('en-US') }]}
          series={[
            {
              data,
            },
          ]}
          width={500}
          height={300}
        />,
      );

      await findByText(dataLength.toLocaleString('en-US'), { ignore: 'span' });

      unmount();
    },
    options,
  );
});
