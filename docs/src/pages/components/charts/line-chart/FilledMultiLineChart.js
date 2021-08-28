import * as React from 'react';
import LineChart from '@mui/charts/LineChart';
import Line from '@mui/charts/Line';
import XAxis from '@mui/charts/XAxis';
import YAxis from '@mui/charts/YAxis';
import Grid from '@mui/charts/Grid';

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

export default function FilledMultiLineChart() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <LineChart
        data={[lineData1, lineData2, lineData3]}
        fill="white"
        smooth
        label="Growth"
        margin={{ top: 70, bottom: 60, left: 60 }}
        markerSize={40}
        xScaleType="time"
      >
        <Grid disableX />
        <Line
          series={0}
          stroke="rgb(116,205,240)"
          fill="rgba(136,225,250,0.1)"
          strokeWidth={2}
        />
        <Line
          series={1}
          stroke="rgb(150,219,124)"
          fill="rgba(170,239,144,0.1)"
          strokeWidth={2}
          markerShape="square"
        />
        <Line
          series={2}
          stroke="rgb(234,95,95)"
          fill="rgba(254,115,115,0.1)"
          strokeWidth={2}
          markerShape="triangle"
        />
        <XAxis label="Year" />
        <YAxis label="Size" suffix="cm" disableLine disableTicks />
      </LineChart>
    </div>
  );
}
