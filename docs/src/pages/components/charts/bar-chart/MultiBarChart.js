import * as React from 'react';
import BarChart from '@mui/charts/BarChart';
import Bar from '@mui/charts/Bar';
import XAxis from '@mui/charts/XAxis';
import YAxis from '@mui/charts/YAxis';
import Grid from '@mui/charts/Grid';
import Tooltip from '@mui/charts/Tooltip';

const lineData1 = [
  { x: new Date(2015, 0, 1), y: 4 },
  { x: new Date(2016, 0, 1), y: 14 },
  { x: new Date(2017, 0, 1), y: 36 },
  { x: new Date(2018, 0, 1), y: 38 },
  { x: new Date(2019, 0, 1), y: 54 },
  { x: new Date(2020, 0, 1), y: 47 },
  { x: new Date(2021, 0, 1), y: 70 },
];

const lineData2 = [
  { x: new Date(2015, 0, 1), y: 17 },
  { x: new Date(2016, 0, 1), y: 16 },
  { x: new Date(2017, 0, 1), y: 53 },
  { x: new Date(2018, 0, 1), y: 29 },
  { x: new Date(2019, 0, 1), y: 52 },
  { x: new Date(2020, 0, 1), y: 68 },
  { x: new Date(2021, 0, 1), y: 62 },
];

const lineData3 = [
  { x: new Date(2015, 0, 1), y: 24 },
  { x: new Date(2016, 0, 1), y: 29 },
  { x: new Date(2017, 0, 1), y: 44 },
  { x: new Date(2018, 0, 1), y: 33 },
  { x: new Date(2019, 0, 1), y: 57 },
  { x: new Date(2020, 0, 1), y: 54 },
  { x: new Date(2021, 0, 1), y: 79 },
];

export default function MultiLineChart() {
  return (
    <BarChart
      data={[lineData1, lineData2, lineData3]}
      highlightMarkers
      invertMarkers
      label="Growth"
      margin={{ top: 70, bottom: 60, left: 60 }}
      markerSize={50}
      xScaleType="time"
    >
      <Grid disableX />
      <XAxis label="Year" />
      <YAxis label="Size" suffix="cm" disableLine disableTicks />
      <Tooltip />
      <Bar series={0} fill="rgb(116,205,240)" />
      <Bar series={1} fill="rgb(150,219,124)" />
      <Bar series={2} fill="rgb(234,95,95)" />
    </BarChart>
  );
}
