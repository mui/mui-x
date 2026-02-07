import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { lineElementClasses } from '@mui/x-charts/LineChart';
import { COUNTRIES } from '../data/countries';
import type { ChartDataPoint } from '../types/electricity';

interface GenerationChartProps {
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
  return `${Math.round(value).toLocaleString()} MW`;
};

export function GenerationChart({ data }: GenerationChartProps) {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Electricity Generation (MW)
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <LineChartPro
          dataset={data}
          series={COUNTRIES.map((country) => ({
            dataKey: `${country.code}_gen`,
            label: country.name,
            showMark: false,
            valueFormatter,
          }))}
          xAxis={[
            {
              dataKey: 'date',
              scaleType: 'time',
              domainLimit: 'strict',
              valueFormatter: (value: Date) => dateFormatter(value),
              zoom: true,
            },
          ]}
          yAxis={[
            {
              valueFormatter: (value: number) => `${(value / 1000).toFixed(0)}k`,
            },
          ]}
          hideLegend
          margin={{ top: 20, bottom: 20, left: 5, right: 5 }}
          sx={{
            [`& .${lineElementClasses.root}`]: {
              strokeWidth: 1,
            },
          }}
        />
      </Box>
    </Box>
  );
}
