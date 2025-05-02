import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Stack, Typography } from '@mui/material';

const ageGroups = [
  '0-4 yrs',
  '5-9 yrs',
  '10-14 yrs',
  '15-19 yrs',
  '20-24 yrs',
  '25-29 yrs',
  '30-34 yrs',
  '35-39 yrs',
  '40-44 yrs',
  '45-49 yrs',
  '50-54 yrs',
  '55-59 yrs',
  '60-64 yrs',
  '65-69 yrs',
  '70-74 yrs',
  '75-79 yrs',
  '80-84 yrs',
  '85-89 yrs',
  '90-94 yrs',
  '95-99 yrs',
  '100+ yrs',
];
const male = [
  766227, 1097221, 1189663, 1183580, 1620461, 1933726, 1796779, 1808706, 2067075,
  2061862, 2258061, 2068112, 2042614, 1478069, 1012668, 696606, 476263, 201240,
  50323, 8291, 1139,
];
const female = [
  727814, 1044863, 1122176, 1104293, 1484776, 1695058, 1593655, 1673805, 1967944,
  2000130, 2231491, 2045845, 2105499, 1585781, 1152098, 899933, 762492, 445118,
  168603, 36739, 5770,
];

const numberFormatter = Intl.NumberFormat(undefined, {
  useGrouping: true,
});

export default function PopulationPyramidBarChart() {
  return (
    <Stack width="100%">
      <Typography variant="h6" textAlign="center">
        South Korea Population Pyramid - 2022
      </Typography>
      <BarChart
        height={500}
        series={[
          {
            data: male.map((d) => -d),
            label: 'Male',
            type: 'bar',
            valueFormatter: (d: number | null) => `${numberFormatter.format(-d!)}`,
            stack: 'stack',
          },
          {
            data: female,
            label: 'Female',
            type: 'bar',
            stack: 'stack',
          },
        ]}
        yAxis={[{ data: ageGroups, width: 70 }]}
        xAxis={[
          {
            valueFormatter: (d: number) => `${numberFormatter.format(Math.abs(d))}`,
          },
        ]}
        layout="horizontal"
        margin={{ right: 70 }}
      />
      <Typography variant="caption">Source: KOSIS</Typography>
    </Stack>
  );
}
