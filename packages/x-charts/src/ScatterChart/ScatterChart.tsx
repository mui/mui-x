import * as React from 'react';
import useId from '@mui/utils/useId';
import { ScatterPlot } from './ScatterPlot';
import { ChartContainer, ChartContainerProps } from '../ChartContainer';
import { Axis, AxisProps } from '../Axis';
import { ScatterSeriesType } from '../models/seriesType/scatter';
import { MakeOptional } from '../models/helpers';
import { Tooltip, TooltipProps } from '../Tooltip';
import { Highlight, HighlightProps } from '../Highlight';
import { ClipPath } from '../ClipPath/ClipPath';

export interface ScatterChartProps extends Omit<ChartContainerProps, 'series'>, AxisProps {
  series: MakeOptional<ScatterSeriesType, 'type'>[];
  tooltip?: TooltipProps;
  highlight?: HighlightProps;
}

export function ScatterChart(props: ScatterChartProps) {
  const {
    xAxis,
    yAxis,
    series,
    tooltip,
    highlight,
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

  const id = useId();
  const clipPathId = `${id}-clip-path`;

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
    >
      <Axis topAxis={topAxis} leftAxis={leftAxis} rightAxis={rightAxis} bottomAxis={bottomAxis} />
      <g clipPath={`url(#${clipPathId})`}>
        <ScatterPlot />
      </g>
      <Highlight x="none" y="none" {...highlight} />
      <Tooltip trigger="item" {...tooltip} />
      <ClipPath id={clipPathId} />
      {children}
    </ChartContainer>
  );
}
