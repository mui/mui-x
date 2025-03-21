import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

import { usAirportPassengersData } from './airportData';

const defaultYAxis = {
  scaleType: 'band',
  dataKey: 'code',
  width: 100,
  valueFormatter: (value) =>
    usAirportPassengersData.find((item) => item.code === value).fullName,
  label: '0deg Axis Title',
};

const degrees = [-180, -135, -90, -45, 0, 45, 90, 135, 180];

const yAxes = degrees
  .map((angle) => ({
    ...defaultYAxis,
    position: 'left',
    id: `angle${angle}`,
    label: `${angle}deg Axis Title`,
    tickLabelStyle: { angle },
  }))
  .concat(
    degrees.map((angle) => ({
      ...defaultYAxis,
      id: `right-angle${angle}`,
      label: `${angle}deg Axis Title`,
      position: 'right',
      tickLabelStyle: { angle },
    })),
  );

export default function YAxisTickLabelOverflow() {
  return (
    <BarChartPro
      yAxis={yAxes}
      // Other props
      width={2000}
      height={400}
      dataset={usAirportPassengersData}
      layout="horizontal"
      series={[
        { dataKey: '2018', label: '2018' },
        { dataKey: '2019', label: '2019' },
        { dataKey: '2020', label: '2020' },
        { dataKey: '2021', label: '2021' },
        { dataKey: '2022', label: '2022' },
      ]}
      hideLegend
      xAxis={[
        {
          valueFormatter: (value) => `${(value / 1000).toLocaleString()}k`,
        },
      ]}
    />
  );
}
