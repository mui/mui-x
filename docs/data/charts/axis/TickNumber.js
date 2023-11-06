import * as React from 'react';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';

const timeData = [
  new Date(2023, 7, 31),
  new Date(2023, 7, 31, 12),
  new Date(2023, 8, 1),
  new Date(2023, 8, 1, 12),
  new Date(2023, 8, 2),
  new Date(2023, 8, 2, 12),
  new Date(2023, 8, 3),
  new Date(2023, 8, 3, 12),
  new Date(2023, 8, 4),
];

const y1 = [5, 5, 10, 90, 85, 70, 30, 25, 25];
const y2 = [90, 85, 70, 25, 23, 40, 45, 40, 50];

const valueFormatter = (date) =>
  date.getHours() === 0
    ? date.toLocaleDateString('fr-FR', {
        month: '2-digit',
        day: '2-digit',
      })
    : date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
      });

const config = {
  series: [{ data: y1 }, { data: y2 }],
  height: 300,
  topAxis: 'half days',
  leftAxis: null,
};
const xAxisCommon = {
  data: timeData,
  scaleType: 'time',
  valueFormatter,
};
export default function TickNumber() {
  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <LineChart
        xAxis={[
          {
            ...xAxisCommon,
            tickMinStep: 3600 * 1000 * 24, // min step: 24h
          },
          {
            ...xAxisCommon,
            id: 'half days',
            tickMinStep: 3600 * 1000 * 12, // min step: 12hu
          },
        ]}
        {...config}
      />
    </Box>
  );
}
