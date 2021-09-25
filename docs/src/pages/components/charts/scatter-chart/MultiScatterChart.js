import * as React from 'react';
import ScatterChart from '@mui/charts/ScatterChart';
import Scatter from '@mui/charts/Scatter';
import XAxis from '@mui/charts/XAxis';
import YAxis from '@mui/charts/YAxis';
import Grid from '@mui/charts/Grid';

const generateDataset = (xDomain, yDomain, zDomain) =>
  Array(15)
    .fill(0)
    .map(() => ({
      x: Math.random() * (xDomain[1] - xDomain[0]) + xDomain[0],
      y: Math.random() * (yDomain[1] - yDomain[0]) + yDomain[0],
      z: Math.random() * (zDomain[1] - zDomain[0]) + zDomain[0],
    }));

const domains1 = [
  [-5, 10],
  [-10, 50],
  [1, 5],
];
const domains2 = [
  [-10, 5],
  [-30, 5],
  [1, 5],
];

export default function BasicScatterChart() {
  return (
    <ScatterChart
      data={[generateDataset(...domains1), generateDataset(...domains2)]}
      label="Mine vs Yours"
      margin={{ top: 70 }}
      markerShape="auto"
      yDomain={null}
    >
      <Grid
        strokeDasharray="5"
        zeroStroke="rgba(200,200,200,0.5)"
        zeroStrokeDasharray="0"
      />
      <Scatter series={0} stroke="rgba(255, 100, 0)" fill="rgba(255, 100, 0, 0.5)" />
      <Scatter series={1} stroke="rgba(0, 100, 255)" fill="rgba(0, 100, 255, 0.5)" />
      <XAxis suffix="cm" disableTicks />
      <YAxis suffix="kg" disableTicks />
    </ScatterChart>
  );
}
