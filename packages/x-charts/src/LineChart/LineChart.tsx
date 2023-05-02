import * as React from 'react';
import { LinePlot } from './LinePlot';
import { ChartContainer, ChartContainerProps } from '../ChartContainer';
import { Axis, AxisProps } from '../Axis/Axis';
import { LineSeriesType } from '../models/seriesType/line';
import { MakeOptional } from '../models/helpers';

export interface LineChartProps extends Omit<ChartContainerProps, 'series'>, AxisProps {
  series: MakeOptional<LineSeriesType, 'type'>[];
}
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
      series={series.map((s) => ({ ...s, type: 'line' }))}
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
