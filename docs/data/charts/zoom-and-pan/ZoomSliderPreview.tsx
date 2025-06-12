import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { XAxis } from '@mui/x-charts/models';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { usUnemploymentRate } from '../dataset/usUnemploymentRate';

const data = usUnemploymentRate.map((d) => d.rate / 100);

const percentageFormatter = new Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumSignificantDigits: 1,
  maximumSignificantDigits: 3,
});

const xAxis = {
  scaleType: 'time',
  id: 'x',
  data: usUnemploymentRate.map((d) => d.date),
  valueFormatter: (v: Date, context) =>
    v.toLocaleDateString(undefined, {
      month:
        // eslint-disable-next-line no-nested-ternary
        context.location === 'tick'
          ? undefined
          : context.location === 'tooltip'
            ? 'long'
            : 'short',
      year: 'numeric',
    }),
  zoom: {
    filterMode: 'discard',
    minSpan: 10,
    panning: true,
    slider: { enabled: true, preview: true },
  },
} satisfies XAxis;

const settings = {
  yAxis: [
    {
      id: 'y',
      width: 48,
      valueFormatter: (v: number | null) => percentageFormatter.format(v!),
      min: 0,
    },
  ],
  series: [
    {
      data,
      showMark: false,
      valueFormatter: (v: number | null) => percentageFormatter.format(v!),
    },
  ],
  height: 400,
} as const;

export default function ZoomSliderPreview() {
  return (
    <Stack width="100%">
      <Typography variant="h6" sx={{ alignSelf: 'center' }}>
        Unemployment Rate in United States (1948-2025)
      </Typography>
      <LineChartPro
        {...settings}
        xAxis={[{ ...xAxis, zoom: { slider: { enabled: true, preview: true } } }]}
      />
      <Typography variant="caption">
        Source: Federal Reserve Bank of St. Louis. Updated: Jun 6, 2025 7:46 AM CDT.
      </Typography>
    </Stack>
  );
}
