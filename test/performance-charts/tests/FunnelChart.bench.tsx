import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { bench, describe } from 'vitest';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { options } from '../utils/options';

describe('FunnelChart', () => {
  const dataLength = 10;
  const series = [
    {
      data: Array.from({ length: dataLength }, (_, i) => ({ value: dataLength / (i + 1) })),
    },
  ];

  bench(
    'FunnelChart with big data amount',
    async () => {
      const { findByText } = render(<FunnelChart series={series} width={500} height={300} />);

      await findByText(dataLength.toLocaleString(), { ignore: 'span' });

      cleanup();
    },
    options,
  );
});
