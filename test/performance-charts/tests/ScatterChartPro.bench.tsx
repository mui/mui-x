import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { describe } from 'vitest';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { FastScatter } from '@mui/x-charts/ScatterChart/FastScatter';
import { options } from '../utils/options';
import { bench } from '../utils/bench';

describe('ScatterChartPro', () => {
  const dataLength = 1_400;
  const data = Array.from({ length: dataLength }).map((_, i) => ({
    x: i,
    y: 50 + Math.sin(i / 5) * 25,
  }));

  const xData = data.map((d) => d.x);

  bench(
    'ScatterChartPro with big data amount',
    async () => {
      const { findByText } = render(
        <ScatterChartPro
          xAxis={[
            {
              id: 'x',
              data: xData,
              zoom: { filterMode: 'discard' },
              valueFormatter: (v: number) => v.toLocaleString('en-US'),
            },
          ]}
          initialZoom={[{ axisId: 'x', start: 20, end: 70 }]}
          series={[{ data }]}
          width={500}
          height={300}
        />,
      );

      await findByText('60', { ignore: 'span' });

      cleanup();
    },
    options,
  );

  bench(
    'ScatterChartPro with big data amount and zoomed in',
    async () => {
      const { findByText } = render(
        <ScatterChartPro
          xAxis={[
            {
              id: 'x',
              data: xData,
              valueFormatter: (v: number) => v.toLocaleString('en-US'),
              zoom: { minSpan: 0 },
            },
          ]}
          yAxis={[{ id: 'y', zoom: { minSpan: 0 } }]}
          series={[{ data }]}
          width={500}
          height={300}
          initialZoom={[
            { axisId: 'x', start: 50, end: 50.1 },
            { axisId: 'y', start: 50, end: 50.1 },
          ]}
        />,
      );

      await findByText('50.06', { ignore: 'span' });

      cleanup();
    },
    options,
  );

  describe('using FastScatter slot', () => {
    bench(
      'ScatterChartPro with big data amount',
      async () => {
        const { findByText } = render(
          <ScatterChartPro
            xAxis={[
              {
                id: 'x',
                data: xData,
                zoom: { filterMode: 'discard' },
                valueFormatter: (v: number) => v.toLocaleString('en-US'),
              },
            ]}
            initialZoom={[{ axisId: 'x', start: 20, end: 70 }]}
            series={[{ data }]}
            width={500}
            height={300}
            slots={{ scatter: FastScatter }}
          />,
        );

        await findByText('60', { ignore: 'span' });

        cleanup();
      },
      options,
    );

    bench(
      'ScatterChartPro with big data amount and zoomed in',
      async () => {
        const { findByText } = render(
          <ScatterChartPro
            xAxis={[
              {
                id: 'x',
                data: xData,
                valueFormatter: (v: number) => v.toLocaleString('en-US'),
                zoom: { minSpan: 0 },
              },
            ]}
            yAxis={[{ id: 'y', zoom: { minSpan: 0 } }]}
            series={[{ data }]}
            width={500}
            height={300}
            initialZoom={[
              { axisId: 'x', start: 50, end: 50.1 },
              { axisId: 'y', start: 50, end: 50.1 },
            ]}
            slots={{ scatter: FastScatter }}
          />,
        );

        await findByText('50.06', { ignore: 'span' });

        cleanup();
      },
      options,
    );
  });
});
