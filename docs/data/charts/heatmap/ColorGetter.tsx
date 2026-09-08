import * as React from 'react';
import Box from '@mui/material/Box';
import { interpolateRgb } from '@mui/x-charts-vendor/d3-interpolate';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { data } from './dumbData';

const xLabels = [1, 2, 3, 4];
const yLabels = ['A', 'B', 'C', 'D', 'E'];

const interpolate = interpolateRgb('#2e7d32', '#d32f2f');

// Green in the top-left corner, red in the bottom-right one.
const gradient = (xIndex: number, yIndex: number) => {
  const distance = xIndex / (xLabels.length - 1) + yIndex / (yLabels.length - 1);
  return interpolate(distance / 2);
};

export default function ColorGetter() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Heatmap
        xAxis={[{ data: xLabels }]}
        yAxis={[{ data: yLabels }]}
        series={[
          {
            data,
            colorGetter: (value, { xIndex, yIndex }) => gradient(xIndex, yIndex),
          },
        ]}
        hideLegend
        height={300}
      />
    </Box>
  );
}
