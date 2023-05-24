import * as React from 'react';
import { LinePlot } from './LinePlot';
import { ChartContainer, ChartContainerProps } from '../ChartContainer';
import { Axis, AxisProps } from '../Axis/Axis';
import { LineSeriesType } from '../models/seriesType/line';
import { MakeOptional } from '../models/helpers';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { Tooltip, TooltipProps } from '../Tooltip';
import { Highlight, HighlightProps } from '../Highlight';
import { Legend, LegendProps } from '../Legend';

export interface LineChartProps extends Omit<ChartContainerProps, 'series'>, AxisProps {
  series: MakeOptional<LineSeriesType, 'type'>[];
  tooltip?: TooltipProps;
  highlight?: HighlightProps;
  legend?: LegendProps;
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
    highlight,
    legend,
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
    children,
  } = props;

  return (
    <ChartContainer
      series={series.map((s) => ({ type: 'line', ...s }))}
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
      disableAxisListener={
        tooltip?.trigger !== 'axis' && highlight?.x === 'none' && highlight?.y === 'none'
      }
    >
      <Axis topAxis={topAxis} leftAxis={leftAxis} rightAxis={rightAxis} bottomAxis={bottomAxis} />
      <LinePlot />

      <Legend {...legend} />
      <Highlight {...highlight} />
      <Tooltip {...tooltip} />
      {children}
    </ChartContainer>
  );
}
