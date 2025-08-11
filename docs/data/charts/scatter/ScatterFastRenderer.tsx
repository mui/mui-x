import * as React from 'react';
import Stack from '@mui/material/Stack';
import { ScatterChart, ScatterChartProps } from '@mui/x-charts/ScatterChart';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import {
  mangoFusionPalette,
  rainbowSurgePalette,
} from '@mui/x-charts/colorPalettes';
import Button from '@mui/material/Button';
import { electricityGeneration2024 } from '../dataset/electricityGeneration2024';
import { carbonEmissions2024 } from '../dataset/carbonEmissions2024';
import { countryData } from '../dataset/countryData';

const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});
function formatAsDateRange(index: number): string {
  const from = new Date(2024, 0, 1, index);
  const to = new Date(2024, 0, 1, index + 1);
  return dateTimeFormat.formatRange(from, to);
}

const scatterChartsParams = {
  series: Object.entries(electricityGeneration2024).map(
    ([countryCode, electricity]) => ({
      data: electricity.map((value, index) => ({
        x: value / 1000,
        y: carbonEmissions2024[
          countryCode as keyof typeof electricityGeneration2024
        ][index],
      })),
      markerSize: 1,
      label:
        countryData[countryCode as keyof typeof electricityGeneration2024].country,
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
  slotProps: {
    legend: {
      position: { vertical: 'bottom' },
      sx: { justifyContent: 'center' },
    },
  },
} satisfies ScatterChartProps;

export default function ScatterFastRenderer() {
  const { palette } = useTheme();
  const [render, setRender] = React.useState(false);

  const colors = React.useMemo(
    () => rainbowSurgePalette(palette.mode).concat(mangoFusionPalette(palette.mode)),
    [palette.mode],
  );

  return (
    <Stack spacing={{ xs: 0, md: 2 }} sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ alignSelf: 'center', textAlign: 'center' }}>
        Life-cycle Carbon Intensity of Electricity Generation - Hourly, 2024
      </Typography>
      {render ? (
        <ScatterChart {...scatterChartsParams} useFastRenderer colors={colors} />
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ height: scatterChartsParams.height }}
        >
          <Button onClick={() => setRender(true)}>Render Chart</Button>
        </Stack>
      )}
      <Typography variant="caption">Source: ENTSO-E, EletricityMaps.com</Typography>
    </Stack>
  );
}
