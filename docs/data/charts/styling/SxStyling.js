import * as React from 'react';
import { BarChart, barElementClasses } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const labels = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E'];
const lData = [42, 24, 56, 45, 3];
const rData = [57, 7, 19, 16, 22];
const colors = ['#006BD6', '#EC407A'];

export default function SxStyling() {
  return (
    <BarChart
      sx={{
        [`.${barElementClasses.root}`]: {
          fill: '#0D0D0D',
          stroke: colors[1],
          strokeWidth: 2,
        },
        [`.${barElementClasses.root}:nth-child(-n+${lData.length})`]: {
          stroke: colors[0],
        },
        [`.${axisClasses.root}`]: {
          [`.${axisClasses.tick}`]: {
            stroke: '#006BD6',
          },
          [`.${axisClasses.line}`]: {
            stroke: '#006BD6',
          },
        },
        [`.${axisClasses.bottom} .${axisClasses.tickContainer}`]: {
          stroke: '#006BD6',
        },
        [`.${axisClasses.left} .${axisClasses.tickContainer}`]: {
          stroke: '#006BD6',
        },
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundImage:
          'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '35px 35px',
        backgroundPosition: '20px 20px, 20px 20px',
      }}
      xAxis={[{ scaleType: 'band', data: labels }]}
      series={[
        { data: lData, label: 'l', id: 'lId' },
        { data: rData, label: 'r', id: 'rId' },
      ]}
      colors={colors}
      width={500}
      height={300}
    />
  );
}
