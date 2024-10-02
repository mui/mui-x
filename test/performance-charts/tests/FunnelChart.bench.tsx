import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { afterEach, bench, describe } from 'vitest';
import { FunnelChart } from '@mui/x-charts/FunnelChart';
import { options } from '../utils/options';

describe('FunnelChart', () => {
  afterEach(() => {
    cleanup();
  });

  const dataLength = 1000;
  const series = Array.from({ length: dataLength + 1 }).map((_, i) => ({
    label: `test ${i}`,
    data: [1000 / (i + 1)],
  }));

  bench(
    'FunnelChart with big data amount',
    async () => {
      const { findByText } = render(<FunnelChart series={series} width={500} height={300} />);

      await findByText((1000).toLocaleString(), { ignore: 'span' });
    },
    options,
  );
});
