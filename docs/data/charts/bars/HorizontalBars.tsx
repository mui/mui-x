import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { dataset, valueFormatter } from '../dataset/weather';

const chartSetting = {
  xAxis: [
    {
      label: 'rainfall (mm)',
    },
  ],
  width: 500,
  height: 400,
};

export default function HorizontalBars() {
  return (
    <BarChart
      dataset={dataset}
      yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      series={[{ dataKey: 'seoul', label: 'Seoul rainfall', valueFormatter }]}
      layout="horizontal"
      {...chartSetting}
    />
  );
}
