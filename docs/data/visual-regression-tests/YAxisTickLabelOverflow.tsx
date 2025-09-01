import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { BarChartProps } from '@mui/x-charts/BarChart';
import { useDrawingArea, useYAxes } from '@mui/x-charts/hooks';
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
    >
      <AxisSizeVisualization />
    </BarChartPro>
  );
}

const stringToColor = (str: string) => {
  let hash = 0;
  str.split('').forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, '0');
  }
  return color;
};

function AxisSizeVisualization() {
  const { left, top, height, width } = useDrawingArea();
  const yAxes = useYAxes();

  return (
    <React.Fragment>
      {yAxes.yAxisIds.map((id, i) => {
        const yAxis = yAxes.yAxis[id];
        if (yAxis.position === 'none') {
          return null;
        }

        const direction = yAxis.position === 'left' ? -1 : 1;
        const offset = yAxis.offset;
        const start =
          yAxis.position === 'left'
            ? left - yAxis.width + offset * direction
            : (left + width + offset) * direction;

        return (
          <rect
            key={id}
            x={start}
            y={top}
            width={yAxis.width ?? 0}
            height={height}
            fill={stringToColor(`${id}+${offset}`)}
            opacity={0.2}
          />
        );
      })}
    </React.Fragment>
  );
}
