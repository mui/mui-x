import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

import { usAirportPassengersData } from './airportData';

const defaultXAxis = {
  dataKey: 'code',
  height: 80,
  valueFormatter: (value) =>
    usAirportPassengersData.find((item) => item.code === value).fullName,
  label: '0deg Axis Title',
};

const degrees = [-180, -135, -90, -45, 0, 45, 90, 135, 180];

const xAxes = degrees
  .map((angle) => ({
    ...defaultXAxis,
    position: 'bottom',
    id: `angle${angle}`,
    label: `${angle}deg Axis Title`,
    tickLabelStyle: { angle },
  }))
  .concat(
    degrees.map((angle) => ({
      ...defaultXAxis,
      id: `top-angle${angle}`,
      label: `${angle}deg Axis Title`,
      position: 'top',
      tickLabelStyle: { angle },
    })),
  );

export default function XAxisTickLabelOverflow() {
  return (
    <BarChartPro
      xAxis={xAxes}
      // Other props
      height={1600}
      dataset={usAirportPassengersData}
      series={[
        { dataKey: '2018', label: '2018' },
        { dataKey: '2019', label: '2019' },
        { dataKey: '2020', label: '2020' },
        { dataKey: '2021', label: '2021' },
        { dataKey: '2022', label: '2022' },
      ]}
      hideLegend
      yAxis={[
        {
          valueFormatter: (value) => `${(value / 1000).toLocaleString()}k`,
          width: 60,
        },
      ]}
    />
  );
}
