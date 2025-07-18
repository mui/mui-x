import * as React from 'react';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { cartesianDrawingAreaClasses } from '@mui/x-charts/ChartsCartesianDrawingArea';

const labels: string[] = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E'];
const lData: number[] = [42, 24, 56, 45, 3];
const rData: number[] = [57, 7, 19, 16, 22];

const settings = {
  xAxis: [{ data: labels }],
  series: [
    { data: lData, label: 'A', id: 'l_id' },
    { data: rData, label: 'B', id: 'r_id' },
  ],
  height: 300,
} satisfies BarChartProps;

export default function BackgroundStyling(): React.JSX.Element {
  return (
    <BarChart
      {...settings}
      sx={(theme) => ({
        [`.${cartesianDrawingAreaClasses.root}`]: {
          fill: theme.palette.mode === 'dark' ? '#294036' : '#D0F0C0',
        },
      })}
    />
  );
}
