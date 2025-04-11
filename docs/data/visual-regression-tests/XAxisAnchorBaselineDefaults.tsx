import * as React from 'react';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';

const defaultXAxis = {
  scaleType: 'band',
  dataKey: 'code',
  height: 45,
} as const;

const degrees = [-180, -135, -90, -45, 0, 45, 90, 135, 180];

type AxisPosition = NonNullable<BarChartProps['xAxis']>[number]['position'];

const xAxes = degrees
  .map((angle) => ({
    ...defaultXAxis,
    position: 'bottom' as AxisPosition,
    id: `angle${angle}`,
    tickLabelStyle: { angle },
  }))
  .concat(
    degrees.map((angle) => ({
      ...defaultXAxis,
      id: `top-angle${angle}`,
      position: 'top',
      tickLabelStyle: { angle },
    })),
  ) satisfies BarChartProps['xAxis'];

export default function XAxisAnchorBaselineDefaults() {
  return (
    <BarChart
      xAxis={xAxes}
      // Other props
      width={600}
      height={900}
      dataset={usAirportPassengers}
      series={[{ dataKey: '2022', label: '2022' }]}
      hideLegend
      yAxis={[
        {
          valueFormatter: (value: number) => `${(value / 1000).toLocaleString()}k`,
          width: 60,
        },
      ]}
    />
  );
}

const usAirportPassengers = [
  {
    fullName: 'Hartsfield–Jackson Atlanta International Airport',
    code: 'ATL',
    2022: 45396001,
  },
  {
    fullName: 'Dallas/Fort Worth International Airport',
    code: 'DFW',
    2022: 35345138,
  },
  {
    fullName: 'Denver International Airport',
    code: 'DEN',
    2022: 33773832,
  },
  {
    fullName: "O'Hare International Airport",
    code: 'ORD',
    2022: 33120474,
  },
  {
    fullName: 'Los Angeles International Airport',
    code: 'LAX',
    2022: 32326616,
  },
  {
    fullName: 'John F. Kennedy International Airport',
    code: 'JFK',
    2022: 26919982,
  },
  {
    fullName: 'Harry Reid International Airport',
    code: 'LAS',
    2022: 25480500,
  },
  {
    fullName: 'Orlando International Airport',
    code: 'MCO',
    2022: 24469733,
  },
  {
    fullName: 'Miami International Airport',
    code: 'MIA',
    2022: 23949892,
  },
  {
    fullName: 'Charlotte Douglas International Airport',
    code: 'CLT',
    2022: 23100300,
  },
  {
    fullName: 'Seattle–Tacoma International Airport',
    code: 'SEA',
    2022: 22157862,
  },
  {
    fullName: 'Phoenix Sky Harbor International Airport',
    code: 'PHX',
    2022: 21852586,
  },
  {
    fullName: 'Newark Liberty International Airport',
    code: 'EWR',
    2022: 21572147,
  },
  {
    fullName: 'San Francisco International Airport',
    code: 'SFO',
    2022: 20411420,
  },
  {
    fullName: 'George Bush Intercontinental Airport',
    code: 'IAH',
    2022: 19814052,
  },
  {
    fullName: 'Logan International Airport',
    code: 'BOS',
    2022: 17443775,
  },
  {
    fullName: 'Fort Lauderdale–Hollywood International Airport',
    code: 'FLL',
    2022: 15370165,
  },
  {
    fullName: 'Minneapolis–Saint Paul International Airport',
    code: 'MSP',
    2022: 15242089,
  },
  {
    fullName: 'LaGuardia Airport',
    code: 'LGA',
    2022: 14367463,
  },
  {
    fullName: 'Detroit Metropolitan Airport',
    code: 'DTW',
    2022: 13751197,
  },
];
