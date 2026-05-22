import * as React from 'react';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { scatterClasses } from '@mui/x-charts-pro/ScatterChart';
import { ChartsTooltipContainer, useItemTooltip } from '@mui/x-charts/ChartsTooltip';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { globalCo2GdpPopulation } from '../dataset/globalCo2GdpPopulation';

const regions = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America',
];

const regionColors = [
  '#e6194B',
  '#3cb44b',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#42d4f4',
];

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
});

function TooltipRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}
    >
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
        {value}
      </Typography>
    </Stack>
  );
}

function CountryBubbleTooltipContent() {
  const item = useItemTooltip<'scatter'>();

  if (!item) {
    return null;
  }
  const country = globalCo2GdpPopulation[item.identifier.dataIndex];
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        border: 'solid 1px',
        borderColor: 'divider',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: item.color,
          }}
        />
        <Typography sx={{ fontWeight: 'medium' }}>{country.name}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {country.region}
        </Typography>
      </Stack>
      <Stack spacing={0.5}>
        <TooltipRow
          label="GDP per capita"
          value={compactCurrencyFormatter.format(item.value.x)}
        />
        <TooltipRow label="CO₂ emissions" value={`${item.value.y.toFixed(1)} t`} />
        <TooltipRow
          label="Population"
          value={compactNumberFormatter.format(country.population)}
        />
      </Stack>
    </Paper>
  );
}

function CountryBubbleTooltip() {
  return (
    <ChartsTooltipContainer trigger="item">
      <CountryBubbleTooltipContent />
    </ChartsTooltipContainer>
  );
}

export default function BubbleChartCO2Emissions() {
  return (
    <Stack sx={{ width: '100%' }}>
      <ScatterChartPro
        height={300}
        hideLegend
        dataset={globalCo2GdpPopulation}
        grid={{ horizontal: true, vertical: true }}
        slots={{ tooltip: CountryBubbleTooltip }}
        sx={{
          [`& .${scatterClasses.series} .${scatterClasses.marker}`]: {
            fillOpacity: 0.5,
          },
        }}
        xAxis={[
          {
            scaleType: 'log',
            label: 'GDP per capita (international-$)',
            max: 200_000,
            valueFormatter: (value: number) =>
              compactCurrencyFormatter.format(value),
            zoom: true,
          },
        ]}
        yAxis={[
          {
            label: 'CO₂ emissions (t per person)',
            width: 50,
            zoom: true,
          },
        ]}
        zAxis={[
          {
            // Maps the population to the marker radius (continuous scale).
            id: 'population',
            dataKey: 'population',
            sizeMap: {
              type: 'continuous',
              min: 0,
              max: 1_500_000_000,
              // Use a square-root interpolation so the bubble area stays
              // roughly proportional to the population.
              size: (t) => 3 + 15 * Math.sqrt(t),
            },
          },
          {
            // Maps the region to a marker color (ordinal scale).
            id: 'region',
            dataKey: 'region',
            colorMap: {
              type: 'ordinal',
              values: regions,
              colors: regionColors,
            },
          },
        ]}
        hitAreaRadius="item"
        series={[
          {
            datasetKeys: { x: 'gdpPerCapita', y: 'co2_emission', id: 'code' },
            sizeAxisId: 'population',
            colorAxisId: 'region',
            highlightScope: { highlight: 'item', fade: 'none' },
          },
        ]}
      />
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {regions.map((region, index) => (
          <Stack
            key={region}
            direction="row"
            spacing={0.5}
            sx={{ alignItems: 'center' }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: regionColors[index],
              }}
            />
            <Typography variant="caption">{region}</Typography>
          </Stack>
        ))}
      </Stack>
      <Typography variant="caption" sx={{ textAlign: 'center' }}>
        Bubble size is proportional to the population · Data for 2023, Our World in
        Data
      </Typography>
    </Stack>
  );
}
