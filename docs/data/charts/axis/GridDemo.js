import * as React from 'react';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { BarChart } from '@mui/x-charts/BarChart';
import { dataset, valueFormatter } from '../dataset/weather';

const chartSetting = {
  yAxis: [{ label: 'rainfall (mm)', width: 60 }],
  height: 300,
};

export default function GridDemo() {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      series={[{ dataKey: 'seoul', label: 'Seoul rainfall', valueFormatter }]}
      grid={{ horizontal: true }}
      sx={{
        [`& .${chartsGridClasses.line}`]: { strokeDasharray: '5 3', strokeWidth: 2 },
      }}
      {...chartSetting}
    />
  );
}
