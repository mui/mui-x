import * as React from 'react';
import {
  LineChartPro,
  type LineChartProProps,
} from '@mui/x-charts-pro/LineChartPro';
import { inflationData } from '../dataset/inflationRates';

const percentageFormatter = (v: number | null) =>
  v == null ? '' : `${v.toFixed(1)}%`;

const dataset = inflationData.map((d) => ({
  ...d,
  average: (d.rateDE + d.rateUK + d.rateFR) / 3,
}));

const chartConfig = {
  height: 400,
  dataset,
  yAxis: [{ valueFormatter: percentageFormatter }],
  series: [
    {
      id: 'germany',
      dataKey: 'rateDE',
      label: 'Germany',
      valueFormatter: percentageFormatter,
    },
    {
      id: 'uk',
      dataKey: 'rateUK',
      label: 'United Kingdom',
      valueFormatter: percentageFormatter,
    },
    {
      id: 'average',
      dataKey: 'average',
      label: 'Average',
      valueFormatter: percentageFormatter,
    },
  ],
} satisfies LineChartProProps;

export default function ZoomSliderPreviewSeriesFilter() {
  return (
    <LineChartPro
      {...chartConfig}
      xAxis={[
        {
          dataKey: 'year',
          zoom: {
            slider: {
              enabled: true,
              preview: { seriesIds: ['average'] },
            },
          },
        },
      ]}
    />
  );
}
