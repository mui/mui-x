import * as React from 'react';
import { interpolateBlues } from 'd3-scale-chromatic';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import Typography from '@mui/material/Typography';
import { AxisConfig } from '@mui/x-charts/models';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = ['6am-10am', '10am-12am', '12am-5pm', '5pm-8pm', '8pm-12pm'];

const data = [
  [0, 0, 1],
  [1, 0, 2],
  [2, 0, 3],
  [3, 0, 4],
  [4, 0, 2],
  [5, 0, 1],
  [6, 0, 1],
  [0, 1, 1],
  [1, 1, 1],
  [2, 1, 1],
  [3, 1, 1],
  [4, 1, 1],
  [5, 1, 1],
  [6, 1, 1],
  [0, 2, 1],
  [1, 2, 1],
  [2, 2, 1],
  [3, 2, 1],
  [4, 2, 1],
  [5, 2, 1],
  [6, 2, 1],
  [0, 3, 1],
  [1, 3, 1],
  [2, 3, 1],
  [3, 3, 1],
  [4, 3, 1],
  [5, 3, 1],
  [6, 3, 1],
  [0, 4, 1],
  [1, 4, 0],
  [2, 4, 1],
  [3, 4, 1],
  [4, 4, 1],
  [5, 4, 1],
  [6, 4, 1],
] as const;

const xAxisValueFormatter: AxisConfig['valueFormatter'] = (value, { location }) => {
  if (location === 'tick') {
    return value[0];
  }
  return value;
};

const yAxisValueFormatter: AxisConfig['valueFormatter'] = (value, { location }) => {
  if (location === 'tick') {
    return value.split('-')[0];
  }
  return value;
};

const commonAxisConfig = {
  scaleType: 'band' as const,
  disableTicks: true,
  disableLine: true,
};

function CustomCell(props: any) {
  const { x, y, width, height, ownerState, ...other } = props;

  return (
    <rect
      {...other}
      x={x + 1}
      y={y + 1}
      width={width - 2}
      height={height - 2}
      fill={ownerState.color}
      clipPath="inset(0px round 10px)"
    />
  );
}

export default function HeatmapDemo() {
  return (
    <>
      <Typography>Issues ppening time</Typography>
      <Heatmap
        series={[{ data }]}
        margin={5}
        height={180}
        xAxis={[
          {
            data: weekDays,
            valueFormatter: xAxisValueFormatter,
            ...commonAxisConfig,
          },
        ]}
        yAxis={[
          {
            data: hours,
            valueFormatter: yAxisValueFormatter,
            ...commonAxisConfig,
          },
        ]}
        zAxis={[
          {
            min: 0,
            max: 20,
            colorMap: {
              type: 'continuous',
              color: interpolateBlues,
            },
          },
        ]}
        slots={{ cell: CustomCell }}
      />
    </>
  );
}
