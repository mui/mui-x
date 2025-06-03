import * as React from 'react';
import { page } from '@vitest/browser/context';
import { render } from 'vitest-browser-react';
import { bench, describe } from 'vitest';
import { BarChart } from '@mui/x-charts/BarChart';
import { options } from '../utils/options';

describe('BarChart', () => {
  const dataLength = 150;
  const data = Array.from({ length: dataLength + 1 }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);
  const yData = data.map((d) => d.y);

  bench(
    'BarChart with big data amount',
    async () => {
      render(
        <BarChart xAxis={[{ data: xData }]} series={[{ data: yData }]} width={500} height={300} />,
      );

      page.getByText(dataLength.toLocaleString());
    },
    options,
  );
});
