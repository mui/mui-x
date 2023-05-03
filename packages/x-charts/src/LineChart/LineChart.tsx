import * as React from 'react';
import { LinePlot } from './LinePlot';
import { ChartContainer, ChartContainerProps } from '../ChartContainer';
import { Axis, AxisProps } from '../Axis/Axis';

export interface LineChartProps extends ChartContainerProps, AxisProps {}
export function LineChart(props: LineChartProps) {
  const {
    xAxis,
    yAxis,
    series,
    width,
    height,
    margin,
    colors,
    sx,
    tooltip,
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
    children,
  } = props;

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
      <LinePlot />
      <Axis topAxis={topAxis} leftAxis={leftAxis} rightAxis={rightAxis} bottomAxis={bottomAxis} />
      {children}
    </ChartContainer>
  );
}
