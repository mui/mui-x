import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { AxisValueFormatterContext } from '@mui/x-charts/models';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function BasicBarRange() {
  return (
    <Stack width="100%" spacing={2}>
      <Typography textAlign="center">
        Average monthly temperature ranges in °C for Porto and Berlin in 1991-2020
      </Typography>
      <BarChart
        xAxis={[
          {
            data: months,
            valueFormatter: (v: string, context: AxisValueFormatterContext) =>
              context.location === 'tick' ? v.slice(0, 3) : v,
          },
        ]}
        yAxis={[{ valueFormatter: (value: number) => `${value}°C` }]}
        series={[
          {
            id: 'porto',
            type: 'barRange',
            label: 'Porto, Portugal',
            valueFormatter: (value) =>
              value === null ? null : `${value.start}°C - ${value.end}°C`,
            data: [
              { end: 14.0, start: 6.4 },
              { end: 15.0, start: 6.8 },
              { end: 17.0, start: 8.8 },
              { end: 18.1, start: 10.1 },
              { end: 20.3, start: 12.3 },
              { end: 22.7, start: 14.5 },
              { end: 24.3, start: 15.5 },
              { end: 24.8, start: 15.7 },
              { end: 23.5, start: 14.8 },
              { end: 20.7, start: 12.9 },
              { end: 16.8, start: 9.4 },
              { end: 14.7, start: 7.6 },
            ],
          },
          {
            id: 'berlin',
            type: 'barRange',
            label: 'Berlin, Germany',
            valueFormatter: (value) =>
              value === null ? null : `${value.start}°C - ${value.end}°C`,
            data: [
              { start: -1.9, end: 2.8 },
              { start: -1.4, end: 4.4 },
              { start: 0.6, end: 8.4 },
              { start: 4.6, end: 14.4 },
              { start: 9.4, end: 18.9 },
              { start: 12.9, end: 22.1 },
              { start: 15.2, end: 24.0 },
              { start: 14.9, end: 23.9 },
              { start: 11.4, end: 19.6 },
              { start: 7.3, end: 13.8 },
              { start: 3.2, end: 8.0 },
              { start: 0.1, end: 4.2 },
            ],
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
