import * as React from 'react';
import { LinePlot } from './LinePlot';
import { XAxis } from '../XAxis/XAxis';
import { YAxis } from '../YAxis/YAxis';
import { SeriesContextProviderProps } from '../context/SeriesContextProvider';
import {
  CartesianContextProvider,
  CartesianContextProviderProps,
} from '../context/CartesianContextProvider';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { LayoutConfig } from '../models/layout';
import { ChartContainer } from '../ChartContainer';

export function LineChart(
  props: Omit<
    LayoutConfig & SeriesContextProviderProps & CartesianContextProviderProps,
    'children'
  >,
) {
  const { xAxis, yAxis, series, width, height, margin } = props;

  return (
    <ChartContainer series={series} width={width} height={height} margin={margin}>
      <CartesianContextProvider xAxis={xAxis} yAxis={yAxis}>
        <LinePlot />
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
      </CartesianContextProvider>
    </ChartContainer>
  );
}
