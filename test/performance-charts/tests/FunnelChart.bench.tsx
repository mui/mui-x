import * as React from 'react';
import { page } from '@vitest/browser/context';
import { render } from 'vitest-browser-react';
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
      render(<FunnelChart series={series} width={500} height={300} />);

      page.getByText(dataLength.toLocaleString());
    },
    options,
  );
});
