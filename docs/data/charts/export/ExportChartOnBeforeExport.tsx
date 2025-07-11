import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { defaultOnBeforeExport } from '@mui/x-charts-pro/models';
import { inflationData } from '../dataset/inflationRates';

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

const xAxis = [
  {
    data: inflationData.map((p) => p.year),
    valueFormatter: (value: number) => `${value}`,
    zoom: true,
  },
];

const yAxis = [
  { valueFormatter: (value: number) => yAxisFormatter.format(value / 100) },
];

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

const settings = {
  height: 300,
  xAxis,
  yAxis,
  series,
  grid: { horizontal: true },
};

function onBeforeExport(iframe: HTMLIFrameElement) {
  defaultOnBeforeExport(iframe);
  const document = iframe.contentDocument!;

  // Show legend
  const legend = document.querySelector(
    `.${legendClasses.root}`,
  ) as HTMLElement | null;

  if (legend) {
    legend.style.display = 'flex';
  }
}

export default function ExportChartOnBeforeExport() {
  return (
    <Stack width="100%">
      <Typography sx={{ alignSelf: 'center', my: 1 }}>
        Inflation rate in France, Germany and the UK, 1960-2024
      </Typography>
      <LineChartPro
        {...settings}
        showToolbar
        slotProps={{
          toolbar: {
            printOptions: { onBeforeExport },
            imageExportOptions: [{ type: 'image/png', onBeforeExport }],
          },
        }}
        sx={{ [`& .${legendClasses.root}`]: { display: 'none' } }}
      />
      <Typography variant="caption">Source: World Bank</Typography>
    </Stack>
  );
}
