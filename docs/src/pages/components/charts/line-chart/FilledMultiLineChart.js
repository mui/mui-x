import * as React from 'react';
import LineChart from '@mui/charts/LineChart';
import Line from '@mui/charts/Line';
import XAxis from '@mui/charts/XAxis';
import YAxis from '@mui/charts/YAxis';
import Grid from '@mui/charts/Grid';
import Legend from '@mui/charts/Legend';

export default function FilledMultiLineChart() {
  return (
    <LineChart
      data={[data1, data2]}
      smoothed
      label="Issues"
      margin={{ top: 70, bottom: 70, left: 60 }}
      markerShape="auto"
      markerSize={40}
      xScaleType="time"
    >
      <Grid disableX />
      <XAxis label="Year" />
      <YAxis label="Size" suffix="cm" disableLine disableTicks />
      <Line
        series={0}
        stroke="rgb(116,205,240)"
        fill="rgba(136,225,250,0.1)"
        strokeWidth={2}
        label="Open"
      />
      <Line
        series={1}
        stroke="rgb(150,219,124)"
        fill="rgba(170,239,144,0.1)"
        strokeWidth={2}
        label="Closed"
      />
      <Legend position="bottom" spacing={55} />
    </LineChart>
  );
}

const data1 = [
  { x:  new Date(2020, 1, 1), y:  122,},
  { x:  new Date(2020, 1, 1), y:  121,},
  { x:  new Date(2020, 2, 1), y:  101,},
  { x:  new Date(2020, 3, 1), y:  103,},
  { x:  new Date(2020, 4, 1), y:  153,},
  { x:  new Date(2020, 5, 1), y:  150,},
  { x:  new Date(2020, 6, 1), y:  135,},
  { x:  new Date(2020, 7, 1), y:  98, }, 
  { x:  new Date(2020, 8, 1), y:  101,}, 
  { x:  new Date(2020, 9, 1), y:  110,}, 
  { x:  new Date(2020, 10, 1), y:  157},
  { x:  new Date(2020, 11, 1), y:  128},
  { x:  new Date(2020, 12, 1), y:  101},
  { x:  new Date(2021, 1, 1), y:  109,}, 
  { x:  new Date(2021, 2, 1), y:  142,}, 
  { x:  new Date(2021, 3, 1), y:  123,}, 
  { x:  new Date(2021, 4, 1), y:  99, }, 
  { x:  new Date(2021, 5, 1), y:  100,}, 
  { x:  new Date(2021, 6, 1), y:  67, }, 
  { x:  new Date(2021, 7, 1), y:  81, }, 
  { x:  new Date(2021, 8, 1), y:  39, }, 
  { x:  new Date(2021, 9, 1), y:  73, }, 
  { x:  new Date(2021, 10, 1), y:  78,}, 
  { x:  new Date(2021, 11, 1), y:  116,}, 
  { x:  new Date(2021, 12, 1), y:  136,}, 
  { x:  new Date(2022, 1, 1), y:  139, }, 
  { x:  new Date(2022, 1, 1), y:  162, }, 
  { x:  new Date(2022, 2, 1), y:  201, }, 
  { x:  new Date(2022, 3, 1), y:  221, }, 
  { x:  new Date(2022, 4, 1), y:  257, }, 
  { x:  new Date(2022, 5, 1), y:  211, }, 
  { x:  new Date(2022, 6, 1), y:  233, }, 
  { x:  new Date(2022, 7, 1), y:  261, }, 
  { x:  new Date(2022, 8, 1), y:  279, }, 
  ]

  const data2 = [
    { x:  new Date(2020, 1, 1),y:  104 },
    { x:  new Date(2020, 1, 1),y:  70 },
    { x:  new Date(2020, 2, 1),y:  55 },
    { x:  new Date(2020, 3, 1),y:  45 },
    { x:  new Date(2020, 4, 1),y:  85 },
    { x:  new Date(2020, 5, 1),y:  116 },
    { x:  new Date(2020, 6, 1),y:  153 },
    { x:  new Date(2020, 7, 1),y:  152 },
    { x:  new Date(2020, 8, 1),y:  192 },
    { x:  new Date(2020, 9, 1),y:  225 },
 {  x:  new Date(2020, 10, 1), y:  233 },
{ x:  new Date(2020, 11, 1), y:  232 },
{ x:  new Date(2020, 12, 1), y:  235 },
{ x:  new Date(2021, 1, 1),y:  200 },
{ x:  new Date(2021, 2, 1),y:  214 },
{ x:  new Date(2021, 3, 1),y:  224 },
{ x:  new Date(2021, 4, 1),y:  176 },
 { x:  new Date(2021, 5, 1),y:  172 },
{ x:  new Date(2021, 6, 1),y:  138 },
{ x:  new Date(2021, 7, 1),y:  127 },
{ x:  new Date(2021, 8, 1),y:  137 },
{ x:  new Date(2021, 9, 1),y:  127 },
{ x:  new Date(2021, 10, 1), y:  154 },
{ x:  new Date(2021, 11, 1), y:  127 },
{ x:  new Date(2021, 12, 1), y:  78 },
{ x:  new Date(2022, 1, 1),y:  61 },
{ x:  new Date(2022, 1, 1),y:  13 },
{ x:  new Date(2022, 2, 1),y:  41 },
{ x:  new Date(2022, 3, 1),y:  72 },
{ x:  new Date(2022, 4, 1),y:  87 },
{ x:  new Date(2022, 5, 1),y:  114 },
{ x:  new Date(2022, 6, 1),y:  138 },
{ x:  new Date(2022, 7, 1),y:  141 },
{ x:  new Date(2022, 8, 1),y:  130 }
  ]