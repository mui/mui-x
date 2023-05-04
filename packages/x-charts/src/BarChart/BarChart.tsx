import * as React from 'react';
import { BarPlot } from './BarPlot';
import { ChartContainer, ChartContainerProps } from '../ChartContainer';
import { Axis, AxisProps } from '../Axis';
import { BarSeriesType } from '../models/seriesType/bar';
import { MakeOptional } from '../models/helpers';
import { DEFAULT_X_AXIS_KEY } from '../constants';

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
      series={series.map((s) => ({ type: 'bar', ...s }))}
      width={width}
      height={height}
      margin={margin}
      xAxis={
        xAxis ?? [
          {
            id: DEFAULT_X_AXIS_KEY,
            scaleType: 'band',
            data: [...new Array(Math.max(...series.map((s) => s.data.length)))].map(
              (_, index) => index,
            ),
          },
        ]
      }
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
