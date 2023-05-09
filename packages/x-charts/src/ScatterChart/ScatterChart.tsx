import * as React from 'react';
import { ScatterPlot } from './ScatterPlot';
import { ChartContainer, ChartContainerProps } from '../ChartContainer';
import { Axis, AxisProps } from '../Axis';
import { ScatterSeriesType } from '../models/seriesType/scatter';
import { MakeOptional } from '../models/helpers';

export interface ScatterChartProps extends Omit<ChartContainerProps, 'series'>, AxisProps {
  series: MakeOptional<ScatterSeriesType, 'type'>[];
}

export function ScatterChart(props: ScatterChartProps) {
  const {
    xAxis,
    yAxis,
    series,
    width,
    height,
    margin,
    colors,
    sx,
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
    children,
  } = props;

  return (
    <ChartContainer
      series={series.map((s) => ({ type: 'scatter', ...s }))}
      width={width}
      height={height}
      margin={margin}
      colors={colors}
      xAxis={xAxis}
      yAxis={yAxis}
      sx={sx}
      tooltip={{ trigger: 'item' }}
    >
      <ScatterPlot />
      <Axis topAxis={topAxis} leftAxis={leftAxis} rightAxis={rightAxis} bottomAxis={bottomAxis} />
      {children}
    </ChartContainer>
  );
}
