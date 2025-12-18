import * as React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { AxisValueFormatterContext } from '@mui/x-charts/models';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';
import { temperatureBerlinPorto } from '../dataset/temperatureBerlinPorto';

export default function BasicRangeBar() {
  return (
    <Stack width="100%" spacing={2}>
      <Typography textAlign="center">
        Average monthly temperature ranges in °C for Porto and Berlin in 1991-2020
      </Typography>
      <BarChartPremium
        xAxis={[
          {
            data: temperatureBerlinPorto.months,
            valueFormatter: (v: string, context: AxisValueFormatterContext) =>
              context.location === 'tick' ? v.slice(0, 3) : v,
          },
        ]}
        yAxis={[{ valueFormatter: (value: number) => `${value}°C` }]}
        series={[
          {
            id: 'porto',
            type: 'rangeBar',
            label: 'Porto, Portugal',
            valueFormatter: (value) =>
              value === null ? null : `${value[0]}°C - ${value[1]}°C`,
            data: temperatureBerlinPorto.porto,
          },
          {
            id: 'berlin',
            type: 'rangeBar',
            label: 'Berlin, Germany',
            valueFormatter: (value) =>
              value === null ? null : `${value[0]}°C - ${value[1]}°C`,
            data: temperatureBerlinPorto.berlin,
          },
        ]}
        height={300}
      />
      <Typography variant="caption">
        Source: IPMA (Porto), climate-data.org (Berlin)
      </Typography>
    </Stack>
  );
}
