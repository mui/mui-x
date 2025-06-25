import * as React from 'react';
import { render } from 'vitest-browser-react/pure';
import { describe, expect } from 'vitest';
import { PieChart } from '@mui/x-charts/PieChart';
import { options } from '../utils/options';
import { bench } from '../utils/bench';

describe('PieChart', () => {
  const dataLength = 100;
  const data = Array.from({ length: dataLength + 1 }).map((_, i) => ({
    value: 50 + Math.sin(i / 5) * 1000,
  }));

  bench(
    'PieChart with big data amount',
    async () => {
      const page = render(
        <PieChart
          series={[
            {
              data,
              arcLabel: (v) => v.value.toFixed(0),
            },
          ]}
          width={500}
          height={300}
        />,
      );

      expect(page.getByText('50', { exact: true })).toBeInTheDocument();
    },
    options,
  );
});
