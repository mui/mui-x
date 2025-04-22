import * as React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartContainerPro } from '@mui/x-charts-pro/ChartContainerPro';
import { ChartOverview } from '@mui/x-charts-pro/ChartOverview';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';

const xAxisData = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const firstSeriesData = Array.from({ length: 26 }, () =>
  Math.floor(Math.random() * 11),
);
const secondSeriesData = Array.from({ length: 26 }, () =>
  Math.floor(Math.random() * 11),
);

export default function ZoomOverviewComposition() {
  const clipPathId = React.useId();

  return (
    <ChartContainerPro
      series={[
        { type: 'line', data: firstSeriesData },
        { type: 'line', data: secondSeriesData },
      ]}
      xAxis={[
        {
          data: xAxisData,
          scaleType: 'band',
          id: 'x-axis-id',
          height: 45,
          zoom: { overview: { enabled: true } },
        },
      ]}
      height={200}
    >
      <g clipPath={`url(#${clipPathId})`}>
        <BarPlot />
        <LinePlot />
      </g>
      <ChartsXAxis label="X axis" axisId="x-axis-id" />
      <ChartOverview />
      <ChartsClipPath id={clipPathId} />
    </ChartContainerPro>
  );
}
