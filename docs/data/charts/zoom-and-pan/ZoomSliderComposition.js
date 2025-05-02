import * as React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartContainerPro } from '@mui/x-charts-pro/ChartContainerPro';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { ChartZoomSlider } from '@mui/x-charts-pro/ChartZoomSlider';
import { Chance } from 'chance';

const chance = new Chance(42);

const xAxisData = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const firstSeriesData = Array.from({ length: 26 }, () =>
  chance.integer({ min: 0, max: 10 }),
);
const secondSeriesData = Array.from({ length: 26 }, () =>
  chance.integer({ min: 0, max: 10 }),
);

export default function ZoomSliderComposition() {
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
          zoom: { slider: { enabled: true } },
        },
      ]}
      height={200}
    >
      <g clipPath={`url(#${clipPathId})`}>
        <BarPlot />
        <LinePlot />
      </g>
      <ChartsXAxis label="X axis" axisId="x-axis-id" />
      <ChartZoomSlider />
      <ChartsClipPath id={clipPathId} />
    </ChartContainerPro>
  );
}
