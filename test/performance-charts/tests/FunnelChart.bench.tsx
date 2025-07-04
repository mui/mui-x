import * as React from 'react';
import { render, cleanup } from 'vitest-browser-react/pure';
import { describe, expect } from 'vitest';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { options } from '../utils/options';
import { bench } from '../utils/bench';

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
      const page = render(<FunnelChart series={series} width={500} height={300} />);

      expect(page.getByText(dataLength.toLocaleString())).toBeInTheDocument();

      cleanup();
    },
    options,
  );
});
