import * as React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartContainerPro } from '@mui/x-charts-pro/ChartContainerPro';
import { ChartOverview } from '@mui/x-charts-pro/ChartOverview';

export default function ZoomOverviewComposition() {
  return (
    <ChartContainerPro
      series={[
        {
          type: 'line',
          data: [1, 2, 3, 2, 1],
        },
        {
          type: 'line',
          data: [4, 3, 1, 3, 4],
        },
      ]}
      xAxis={[
        {
          data: ['A', 'B', 'C', 'D', 'E'],
          scaleType: 'band',
          id: 'x-axis-id',
          height: 45,
          zoom: { overview: { enabled: true } },
        },
      ]}
      height={200}
    >
      <BarPlot />
      <LinePlot />
      <ChartsXAxis label="X axis" axisId="x-axis-id" />
      <ChartOverview />
    </ChartContainerPro>
  );
}
