import * as React from 'react';
import { blue } from '@mui/material/colors';
import { RadialLineChart } from '@mui/x-charts/RadialLineChart';
import monthlyGlobalTemperatures from '../dataset/monthlyGlobalTemperatures';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const colors = [blue[100], blue[300], blue[500], blue[700], blue[800], blue[900]];
const series = monthlyGlobalTemperatures.reverse().map((item, index) => ({
  label: item.year.toString(),
  data: item.temperatures,
  color: colors[index],
}));

export default function RadialLineOverview() {
  return (
    <RadialLineChart
      height={300}
      series={series}
      rotationAxis={[{ data: months, scaleType: 'point' }]}
      radiusAxis={[
        {
          domainLimit: (min, max) => ({
            min: Math.floor(min.valueOf()),
            max: Math.ceil(max.valueOf()),
          }),
        },
      ]}
    />
  );
}
