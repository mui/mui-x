import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { bench, describe } from 'vitest';
import { PieChart } from '@mui/x-charts/PieChart';
import { options } from '../utils/options';

describe('PieChart', () => {
  const dataLength = 50;
  const data = Array.from({ length: dataLength + 1 }).map((_, i) => ({
    value: 50 + Math.sin(i / 5) * 1000,
  }));

  bench(
    'PieChart with big data amount',
    async () => {
      const { findByText } = render(
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

      const result = 1050;
      await findByText(result);

      cleanup();
    },
    options,
  );
});
