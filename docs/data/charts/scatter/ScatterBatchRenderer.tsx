import * as React from 'react';
import Stack from '@mui/material/Stack';
import { ScatterChart, ScatterChartProps } from '@mui/x-charts/ScatterChart';
import Typography from '@mui/material/Typography';
import { schemePaired } from 'd3-scale-chromatic';
import { electricityGeneration2024Every6Hours } from '../dataset/electricityGeneration2024Every6Hours';
import { carbonEmissions2024Every6Hours } from '../dataset/carbonEmissions2024Every6Hours';
import { countryData } from '../dataset/countryData';

const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});
function formatAsDateRange(index: number): string {
  const from = new Date(2024, 0, 1, index * 6);
  const to = new Date(2024, 0, 1, index * 6 + 6);
  return dateTimeFormat.formatRange(from, to);
}

const scatterChartsParams = {
  series: Object.entries(electricityGeneration2024Every6Hours).map(
    ([countryCode, electricity]) => ({
      data: electricity.map((value, index) => ({
        x: value / 1000,
        y: carbonEmissions2024Every6Hours[
          countryCode as keyof typeof electricityGeneration2024Every6Hours
        ][index],
      })),
      markerSize: 1,
      label:
        countryData[countryCode as keyof typeof electricityGeneration2024Every6Hours]
          .country,
      highlightScope: {
        highlight: 'series',
        fade: 'global',
      },
      valueFormatter: (value, { dataIndex }) =>
        `generated ${value!.x.toFixed(2)} GWh emitting ${value!.y.toFixed(2)} gCO₂eq/kWh on ${formatAsDateRange(dataIndex)}`,
    }),
  ),
  xAxis: [{ min: 0, label: 'Electricity Generation (GWh)' }],
  yAxis: [{ min: 0, width: 60, label: 'Life-cycle Carbon Intensity (gCO₂eq/kWh)' }],
  height: 400,
  colors: schemePaired,
  slotProps: {
    legend: {
      position: { vertical: 'bottom' },
      sx: { justifyContent: 'center' },
    },
  },
} satisfies ScatterChartProps;

export default function ScatterBatchRenderer() {
  return (
    <Stack spacing={{ xs: 0, md: 2 }} sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ alignSelf: 'center', textAlign: 'center' }}>
        Life-cycle Carbon Intensity of Electricity Generation - 2024
      </Typography>
      <ScatterChart {...scatterChartsParams} renderer="svg-batch" />
      <Typography variant="caption">Source: ENTSO-E, ElectricityMaps.com</Typography>
    </Stack>
  );
}
