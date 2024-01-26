import * as React from 'react';
import Box from '@mui/material/Box';

import { LineChart } from '@mui/x-charts/LineChart';

export default function TickPosition() {
  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <LineChart
        xAxis={[
          {
            ...xAxisCommon,
            id: 'bottomAxis',
            scaleType: 'point',
            tickInterval: (time) => time.getHours() === 0,
          },
          {
            ...xAxisCommon,
            id: 'topAxis',
            scaleType: 'point',
          },
        ]}
        {...config}
      />
    </Box>
  );
}

const valueFormatter = (date) =>
  date.toLocaleDateString('fr-FR', {
    month: '2-digit',
    day: '2-digit',
  });

const timeData = [
  new Date(2023, 7, 31),
  new Date(2023, 7, 31, 3),
  new Date(2023, 7, 31, 6),
  new Date(2023, 7, 31, 9),
  new Date(2023, 7, 31, 12),
  new Date(2023, 7, 31, 15),
  new Date(2023, 7, 31, 18),
  new Date(2023, 8, 1),
  new Date(2023, 8, 1, 3),
  new Date(2023, 8, 1, 6),
  new Date(2023, 8, 1, 9),
  new Date(2023, 8, 1, 12),
  new Date(2023, 8, 1, 15),
  new Date(2023, 8, 1, 18),
  new Date(2023, 8, 2),
  new Date(2023, 8, 2, 3),
  new Date(2023, 8, 2, 6),
  new Date(2023, 8, 2, 9),
  new Date(2023, 8, 2, 12),
  new Date(2023, 8, 2, 15),
  new Date(2023, 8, 2, 18),
  new Date(2023, 8, 3),
  new Date(2023, 8, 3, 3),
  new Date(2023, 8, 3, 6),
  new Date(2023, 8, 3, 9),
  new Date(2023, 8, 3, 12),
  new Date(2023, 8, 3, 15),
  new Date(2023, 8, 3, 18),
  new Date(2023, 8, 4),
];

const y1 = [
  5, 5.5, 5.3, 4.9, 5, 6.2, 8.9, 10, 15, 30, 80, 90, 94, 93, 85, 86, 75, 70, 68, 50,
  20, 30, 35, 28, 25, 27, 30, 28, 25,
];

const y2 = [
  90, 93, 89, 84, 85, 83, 73, 70, 63, 32, 30, 25, 18, 19, 23, 30, 32, 36, 40, 40, 42,
  45, 46, 42, 39, 40, 41, 43, 50,
];

const showMark = (params) => {
  const { position } = params;
  return position.getHours() === 0;
};

const config = {
  series: [
    { data: y1, showMark },
    { data: y2, showMark },
  ],
  height: 300,
  topAxis: 'topAxis',
  bottomAxis: 'bottomAxis',
  leftAxis: null,
};
const xAxisCommon = {
  data: timeData,
  scaleType: 'time',
  valueFormatter,
};
