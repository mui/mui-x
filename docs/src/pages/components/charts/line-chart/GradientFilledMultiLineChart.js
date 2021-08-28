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

export default function GradientFilledMultiLineChart() {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <LineChart
        data={[lineData1, lineData2]}
        fill="white"
        smooth
        label="Growth"
        markerShape="none"
        margin={{ top: 70, bottom: 60, left: 60 }}
        xScaleType="time"
      >
        <defs>
          <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Grid disableX />
        <Line series={0} stroke="rgb(206,150,220)" fill="url(#color1)" />
        <Line series={1} stroke="rgb(150,219,124)" fill="url(#color2)" />
        <XAxis
          label="Day of week"
          labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
        />
        <YAxis label="Size" suffix="cm" disableLine disableTicks />
      </LineChart>
    </div>
  );
}
