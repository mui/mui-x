import * as React from 'react';
import Box from '@mui/material/Box';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot } from '@mui/x-charts/LineChart';

import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';

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

const config = {
  series: [
    { type: 'line', data: y1 },
    { type: 'line', data: y2 },
  ],
  height: 400,
  xAxis: [
    {
      data: timeData,
      scaleType: 'time',
      valueFormatter: (date) =>
        date.getHours() === 0
          ? date.toLocaleDateString('fr-FR', {
              month: '2-digit',
              day: '2-digit',
            })
          : date.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
            }),
    },
  ],
};

export default function ReferenceLine() {
  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <ResponsiveChartContainer {...config}>
        <LinePlot />
        <ChartsReferenceLine
          x={new Date(2023, 8, 2, 9)}
          lineStyle={{ strokeDasharray: '10 5' }}
          labelStyle={{ fontSize: '10' }}
          label={`Wake up\n9AM`}
          labelAlign="start"
        />
        <ChartsReferenceLine y={50} label="Middle value" labelAlign="end" />
        <ChartsXAxis />
        <ChartsYAxis />
      </ResponsiveChartContainer>
    </Box>
  );
}
