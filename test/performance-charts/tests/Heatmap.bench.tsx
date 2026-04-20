import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { describe } from 'vitest';
import { Heatmap, HeatmapValueType } from '@mui/x-charts-pro';
import { options } from '../utils/options';
import { bench } from '../utils/bench';

describe('Heatmap', () => {
  const dataLength = 100;
  const xData = Array.from({ length: dataLength }).map((_, i) => `${i + 1}`);

  const yData = Array.from({ length: dataLength }).map((_, i) => `${i + 1}`);

  const data = xData.flatMap((_, i) =>
    yData.map(
      (__, j) => [i, j, Math.sin(((i + j) * Math.PI) / 16) * 100] satisfies HeatmapValueType,
    ),
  );

  // https://github.com/mui/mui-x/issues/18015#issuecomment-3665782200
  bench(
    'Heatmap: 100x100 grid',
    async () => {
      const { findAllByText } = render(
        <Heatmap
          xAxis={[{ data: xData }]}
          yAxis={[{ data: yData }]}
          series={[{ data }]}
          width={500}
          height={300}
        />,
      );

      await findAllByText('60', { ignore: 'span' });

      cleanup();
    },
    options,
  );
});
