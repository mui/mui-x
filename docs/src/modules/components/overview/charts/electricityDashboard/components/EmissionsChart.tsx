import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { lineElementClasses } from '@mui/x-charts/LineChart';
import { COUNTRIES } from '../data/countries';
import type { ChartDataPoint } from '../types/electricity';

interface EmissionsChartProps {
  data: ChartDataPoint[];
  selectedCountries: Set<string>;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
}).format;

const valueFormatter = (value: number | null) => {
  if (value === null) {
    return '';
  }
  return `${Math.round(value)} gCO₂/kWh`;
};

// Color scale from green (low emissions) to red (high emissions)
// Color scale from green (low emissions) to red (high emissions)
const EMISSION_COLORS = [
  '#2e7d32', // (low)
  '#388e3c',
  '#43a047',
  '#66bb6a',
  '#9ccc65',
  '#d4e157',
  '#ffee58',
  '#ffca28',
  '#ffa726',
  '#ff7043',
  '#e53935', // (high)
];

const series = COUNTRIES.map((country) => ({
  id: country.code,
  dataKey: `${country.code}_co2`,
  label: country.name,
  showMark: false,
  valueFormatter,
}));

const xAxis = [
  {
    dataKey: 'date',
    scaleType: 'time' as const,
    valueFormatter: (value: Date) => dateFormatter(value),
    zoom: true,
  },
];

const yAxis = [{ valueFormatter: (value: number) => `${Math.round(value)}` }];

const chartSx = {
  [`& .${lineElementClasses.root}`]: {
    strokeWidth: 1,
  },
};

const margin = { top: 20, bottom: 20, left: 5, right: 5 };

export function EmissionsChart({ data, selectedCountries }: EmissionsChartProps) {
  const hiddenItems = COUNTRIES.filter(
    (country) => !selectedCountries.has(country.code),
  ).map((country) => ({
    type: 'line' as const,
    seriesId: country.code,
  }));

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Carbon Intensity (gCO₂eq/kWh)
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <LineChartPro
          dataset={data}
          hiddenItems={hiddenItems}
          colors={EMISSION_COLORS}
          series={series}
          xAxis={xAxis}
          yAxis={yAxis}
          margin={margin}
          hideLegend
          sx={chartSx}
        />
      </Box>
    </Box>
  );
}
