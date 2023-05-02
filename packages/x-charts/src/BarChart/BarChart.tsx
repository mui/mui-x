import * as React from 'react';
import { BarPlot } from './BarPlot';
import { ChartContainer, ChartContainerProps } from '../ChartContainer';
import { Axis, AxisProps } from '../Axis';
import { BarSeriesType } from '../models/seriesType/bar';
import { MakeOptional } from '../models/helpers';

export interface BarChartProps extends Omit<ChartContainerProps, 'series'>, AxisProps {
  series: MakeOptional<BarSeriesType, 'type'>[];
}

export function BarChart(props: BarChartProps) {
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
      series={series.map((s) => ({ ...s, type: 'bar' }))}
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
      <Axis topAxis={topAxis} leftAxis={leftAxis} rightAxis={rightAxis} bottomAxis={bottomAxis} />
      {children}
    </ChartContainer>
  );
}
