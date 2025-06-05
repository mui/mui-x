import * as React from 'react';
import { ChartProApi } from '@mui/x-charts-pro/ChartContainerPro';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { inflationData } from './inflationData';

const yAxisFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  maximumSignificantDigits: 1,
});
const percentageFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const seriesValueFormatter = (value: number | null) =>
  percentageFormatter.format(value! / 100);

const series = [
  {
    label: 'Germany',
    data: inflationData.map((p) => p.rateDE),
    valueFormatter: seriesValueFormatter,
    showMark: false,
  },
  {
    label: 'United Kingdom',
    data: inflationData.map((p) => p.rateUK),
    valueFormatter: seriesValueFormatter,
    showMark: false,
  },
  {
    label: 'France',
    data: inflationData.map((p) => p.rateFR),
    valueFormatter: seriesValueFormatter,
    showMark: false,
  },
];

export default function ExportChartToolbar() {
  const apiRef = React.useRef<ChartProApi>(undefined);

  return (
    <Stack width="100%">
      <LineChartPro
        apiRef={apiRef}
        height={300}
        xAxis={[
          {
            data: inflationData.map((p) => p.year),
            valueFormatter: (value: number) => `${value}`,
            zoom: true,
          },
        ]}
        series={series}
        yAxis={[
          {
            valueFormatter: (value: number) => yAxisFormatter.format(value / 100),
          },
        ]}
        showToolbar
        grid={{ horizontal: true }}
      />
      <Typography variant="caption">Source: World Bank</Typography>
    </Stack>
  );
}
