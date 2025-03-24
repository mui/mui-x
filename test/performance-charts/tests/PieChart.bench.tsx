import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { bench, describe } from 'vitest';
import { PieChart } from '@mui/x-charts/PieChart';
import { options } from '../utils/options';

describe('PieChart', () => {
  const dataLength = 10;
  const data = Array.from({ length: dataLength + 1 }).map((_, i) => ({
    value: 50 + Math.sin(i / 5) * 100,
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

      const result = 150;
      await findByText(result.toLocaleString());

      cleanup();
    },
    options,
  );
});
