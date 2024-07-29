import * as React from 'react';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { BarChart } from '@mui/x-charts/BarChart';
import { dataset } from '../dataset/weather';

const chartSetting = {
  yAxis: [{ label: 'rainfall (mm)' }],
  height: 300,
};

const valueFormatter = (value: number | null) => `${value}mm`;

export default function GridDemo() {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      series={[{ dataKey: 'seoul', label: 'Seoul rainfall', valueFormatter }]}
      grid={{ horizontal: true }}
      sx={{
        [`& .${axisClasses.left} .${axisClasses.label}`]: {
          transform: 'translateX(-10px)',
        },
        [`& .${chartsGridClasses.line}`]: { strokeDasharray: '5 3', strokeWidth: 2 },
      }}
      {...chartSetting}
    />
  );
}
