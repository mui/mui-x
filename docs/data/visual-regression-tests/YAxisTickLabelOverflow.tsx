import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { BarChartProps } from '@mui/x-charts/BarChart';
import { usAirportPassengersData } from './airportData';

const defaultYAxis = {
  dataKey: 'code',
  width: 80,
  valueFormatter: (value: any) =>
    usAirportPassengersData.find((item) => item.code === value)!.fullName,
  label: '0deg Axis Title',
} as const;

const degrees = [-135, -45, 0, 45, 135];

type AxisPosition = NonNullable<BarChartProps['yAxis']>[number]['position'];

const yAxes = degrees
  .map((angle) => ({
    ...defaultYAxis,
    position: 'left' as AxisPosition,
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
  ) satisfies BarChartProps['yAxis'];

export default function YAxisTickLabelOverflow() {
  return (
    <BarChartPro
      yAxis={yAxes}
      // Other props
      width={850}
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
          valueFormatter: (value: number) => `${(value / 1000).toLocaleString()}k`,
        },
      ]}
    />
  );
}
