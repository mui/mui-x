import Grid from '@mui/charts/Grid';
import Line from '@mui/charts/Line';
import LineChart from '@mui/charts/LineChart';
import Tooltip from '@mui/charts/Tooltip';
import XAxis from '@mui/charts/XAxis';
import YAxis from '@mui/charts/YAxis';
import * as React from 'react';

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

const lineColors = ['rgb(116,205,240)', 'rgb(150,219,124)', 'rgb(234,95,95)'];

const markers = [
  {
    label: 'Blue',
    series: 0,
    markerColor: lineColors[0],
  },
  {
    label: 'Green',
    series: 1,
    markerColor: lineColors[1],
  },
  {
    label: 'Red',
    series: 2,
    markerColor: lineColors[2],
  },
];

export default function MultiLineChart() {
  return (
    <LineChart
      data={[lineData1, lineData2, lineData3]}
      highlightMarkers
      invertMarkers
      label="Growth"
      margin={{ top: 70, bottom: 60, left: 60 }}
      markerSize={50}
      markers={markers}
      smoothed
      xScaleType="time"
    >
      <Grid disableX />
      <XAxis label="Year" />
      <YAxis label="Size" suffix="cm" disableLine disableTicks />
      <Tooltip />
      {lineColors.map((color, index) => (
        <Line series={index} stroke={color} strokeWidth={2} />
      ))}
    </LineChart>
  );
}
