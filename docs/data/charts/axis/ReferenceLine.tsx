import * as React from 'react';
import Box from '@mui/material/Box';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot } from '@mui/x-charts/LineChart';
import { LineSeriesType } from '@mui/x-charts/models';
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
  ] as LineSeriesType[],
  height: 400,
  xAxis: [
    {
      data: timeData,
      scaleType: 'time',
      valueFormatter: (date: Date) =>
        date.getHours() === 0
          ? date.toLocaleDateString('fr-FR', {
              month: '2-digit',
              day: '2-digit',
            })
          : date.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
            }),
    } as const,
  ],
};

export default function ReferenceLine() {
  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <ResponsiveChartContainer {...config}>
        <LinePlot />
        <ChartsReferenceLine x={new Date(2023, 8, 2, 5)} />
        <ChartsReferenceLine y={50} />
        <ChartsXAxis />
        <ChartsYAxis />
      </ResponsiveChartContainer>
    </Box>
  );
}
