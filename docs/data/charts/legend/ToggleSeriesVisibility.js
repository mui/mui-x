import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const chartSetting = {
  xAxis: [
    {
      label: 'rainfall (mm)',
    },
  ],
  height: 300,
};

const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    seoul: 21,
    month: 'Jan',
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    month: 'Feb',
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    month: 'Mar',
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    month: 'Apr',
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    month: 'May',
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    month: 'June',
  },
];

const valueFormatter = (value) => `${value}mm`;

export default function ToggleSeriesVisibility() {
  return (
    <BarChart
      dataset={dataset}
      yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      series={[
        { dataKey: 'london', label: 'London', valueFormatter },
        { dataKey: 'paris', label: 'Paris', valueFormatter },
        { dataKey: 'newYork', label: 'New York', valueFormatter },
      ]}
      layout="horizontal"
      slotProps={{
        legend: {
          toggleVisibilityOnClick: true,
        },
      }}
      {...chartSetting}
    />
  );
}
