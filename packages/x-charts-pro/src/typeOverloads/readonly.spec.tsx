import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';

const settings = {
  height: 200,
  series: [{ data: [60, -15, 66, 68, 87, 82, 83, 85, 92, 75, 76, 50, 91] }],
  xAxis: [{ position: 'top' }],
  yAxis: [{ data: [1, 2, 3] }],
  margin: { top: 10, bottom: 20 },
} as const;

const scatterSettings = {
  ...settings,
  series: [
    {
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
      ],
    },
  ],
} as const;

const heatmapSettings = {
  ...settings,
  series: [
    {
      data: [
        [0, 0, 10],
        [0, 1, 20],
        [0, 2, 40],
      ],
    },
  ],
} as const;

export const Component = () => {
  return (
    <React.Fragment>
      <BarChartPro {...settings} />
      <LineChartPro {...settings} />
      <ScatterChartPro {...scatterSettings} />
      <Heatmap {...heatmapSettings} />
    </React.Fragment>
  );
};
