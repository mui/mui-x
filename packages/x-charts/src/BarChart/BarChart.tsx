import * as React from 'react';
import { BarPlot } from './BarPlot';
import { XAxis } from '../XAxis/XAxis';
import { YAxis } from '../YAxis/YAxis';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { ChartContainer, ChartContainerProps } from '../ChartContainer';
import { Tooltip } from '../Tooltip';

export function BarChart(props: Omit<ChartContainerProps, 'children'>) {
  const { xAxis, yAxis, series, width, height, margin } = props;

  return (
    <ChartContainer
      series={series}
      width={width}
      height={height}
      margin={margin}
      xAxis={xAxis}
      yAxis={yAxis}
    >
      <BarPlot />
      <XAxis
        label="Bottom X axis"
        position="bottom"
        axisId={xAxis?.[0]?.id ?? DEFAULT_X_AXIS_KEY}
      />
      <XAxis
        label="Top X axis"
        position="top"
        axisId={xAxis?.[1]?.id ?? xAxis?.[0]?.id ?? DEFAULT_X_AXIS_KEY}
      />
      <YAxis label="Left Y axis" position="left" axisId={yAxis?.[0]?.id ?? DEFAULT_Y_AXIS_KEY} />
      <YAxis
        label="Right Y axis"
        position="right"
        axisId={yAxis?.[1]?.id ?? yAxis?.[0]?.id ?? DEFAULT_Y_AXIS_KEY}
      />
      <Tooltip />
    </ChartContainer>
  );
}
