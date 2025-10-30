import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { ChartsTooltipContainer, useItemTooltip } from '@mui/x-charts/ChartsTooltip';
import { ScatterChart, ScatterChartProps } from '@mui/x-charts/ScatterChart';
import Typography from '@mui/material/Typography';
import { schemePaired } from 'd3-scale-chromatic';
import { electricityGeneration2024Every6Hours } from '../dataset/electricityGeneration2024Every6Hours';
import { carbonEmissions2024Every6Hours } from '../dataset/carbonEmissions2024Every6Hours';
import { countryData, flags } from '../dataset/countryData';

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
});

const timeRangeFormat = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
});

function getDatesFromIndex(index: number): [Date, Date] {
  const from = new Date(2024, 0, 1, index * 6);
  const to = new Date(2024, 0, 1, index * 6 + 6);
  return [from, to];
}

const scatterChartsParams = {
  series: Object.entries(electricityGeneration2024Every6Hours).map(
    ([countryCode, electricity]) => ({
      id: countryCode,
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
  slots: {
    tooltip: ElectricityTooltip,
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

function ElectricityTooltip() {
  return (
    <ChartsTooltipContainer trigger="item">
      <ElectricityTooltipContent />
    </ChartsTooltipContainer>
  );
}

function ElectricityTooltipContent() {
  const item = useItemTooltip<'scatter'>();

  if (!item) {
    return null;
  }

  const [from, to] = getDatesFromIndex(item.identifier.dataIndex);

  return (
    <Paper sx={{ p: 1.5 }} elevation={4}>
      <Typography
        variant="subtitle2"
        justifyContent={'space-between'}
        display="flex"
      >
        {item.label} {flags[item.identifier.seriesId as keyof typeof flags]}
      </Typography>
      <Typography variant="body2">
        {`${dateFormat.format(from)} ${timeRangeFormat.format(from)} - ${timeRangeFormat.format(to)}`}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Typography variant="body1">
        Generated:{' '}
        <Typography component="span" variant="body2">
          {item.value.x.toFixed(2)} GWh
        </Typography>
      </Typography>
      <Typography variant="body1">
        Emitting:{' '}
        <Typography component="span" variant="body2">
          {item.value.y.toFixed(2)} gCO₂eq/kWh
        </Typography>
      </Typography>
    </Paper>
  );
}
