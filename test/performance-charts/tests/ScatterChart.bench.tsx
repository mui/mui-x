import * as React from 'react';
import { page } from '@vitest/browser/context';
import { render } from 'vitest-browser-react';
import { bench, describe } from 'vitest';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { options } from '../utils/options';

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
      render(
        <ScatterChart
          xAxis={[{ data: xData, valueFormatter: (v: number) => v.toLocaleString('en-US') }]}
          series={[
            {
              data,
            },
          ]}
          width={500}
          height={300}
        />,
      );

      page.getByText(dataLength.toLocaleString('en-US'));
    },
    options,
  );
});
