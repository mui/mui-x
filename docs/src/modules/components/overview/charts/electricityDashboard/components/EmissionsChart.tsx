import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { lineElementClasses, areaElementClasses } from '@mui/x-charts/LineChart';
import { COUNTRIES } from '../data/countries';
import type { ChartDataPoint } from '../types/electricity';

interface EmissionsChartProps {
  data: ChartDataPoint[];
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
const EMISSION_COLORS = [
  '#2e7d32', // Norway, Sweden (low)
  '#388e3c',
  '#43a047',
  '#66bb6a',
  '#9ccc65',
  '#d4e157',
  '#ffee58',
  '#ffca28',
  '#ffa726',
  '#ff7043',
  '#e53935', // Poland (high)
];

export function EmissionsChart({ data }: EmissionsChartProps) {
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Carbon Intensity (gCO₂eq/kWh)
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <LineChartPro
          dataset={data}
          colors={EMISSION_COLORS}
          series={COUNTRIES.map((country) => ({
            dataKey: `${country.code}_co2`,
            label: country.name,
            showMark: false,
            area: true,
            valueFormatter,
          }))}
          xAxis={[
            {
              dataKey: 'date',
              scaleType: 'time',
              valueFormatter: (value: Date) => dateFormatter(value),
              zoom: true,
            },
          ]}
          yAxis={[
            {
              valueFormatter: (value: number) => `${Math.round(value)}`,
            },
          ]}
          hideLegend
          margin={{ left: 50, right: 10, top: 10, bottom: 30 }}
          sx={{
            [`& .${lineElementClasses.root}`]: {
              strokeWidth: 1,
            },
            [`& .${areaElementClasses.root}`]: {
              opacity: 0.1,
            },
          }}
        />
      </Box>
    </Box>
  );
}
