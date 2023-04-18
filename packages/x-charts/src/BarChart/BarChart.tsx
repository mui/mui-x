import * as React from 'react';
import { BarPlot } from './BarPlot';
import { ChartContainer, ChartContainerProps } from '../ChartContainer';
import { Axis, AxisProps } from '../Axis';

export interface BarChartProps extends ChartContainerProps, AxisProps {}

export function BarChart(props: ChartContainerProps) {
  const { xAxis, yAxis, series, width, height, margin, colors, sx, tooltip, children } = props;

  return (
    <ChartContainer
      series={series}
      width={width}
      height={height}
      margin={margin}
      xAxis={xAxis}
      yAxis={yAxis}
      colors={colors}
      sx={sx}
      tooltip={tooltip}
    >
      <BarPlot />
      <Axis />
      {children}
    </ChartContainer>
  );
}
