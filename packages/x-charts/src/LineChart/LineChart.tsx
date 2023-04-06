import * as React from 'react';
import { LinePlot } from './LinePlot';
import { XAxis } from '../XAxis/XAxis';
import { YAxis } from '../YAxis/YAxis';
import {
  SeriesContextProvider,
  SeriesContextProviderProps,
} from '../context/SeriesContextProvider';
import { DrawingProvider, DrawingProviderProps } from '../context/DrawingProvider';
import {
  CartesianContextProvider,
  CartesianContextProviderProps,
} from '../context/CartesianContextProvider';
import Surface, { SurfaceProps } from '../Surface';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';

export function LineChart(
  props: Omit<
    SurfaceProps &
      SeriesContextProviderProps &
      CartesianContextProviderProps &
      DrawingProviderProps,
    'children'
  > & { children?: React.ReactNode },
) {
  const { xAxis, yAxis, series, colors, width, height, margin, sx, children } = props;

  return (
    <DrawingProvider width={width} height={height} margin={margin}>
      <SeriesContextProvider series={series} colors={colors}>
        <CartesianContextProvider xAxis={xAxis} yAxis={yAxis}>
          <Surface width={width} height={height} sx={sx}>
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
            <YAxis
              label="Left Y axis"
              position="left"
              axisId={yAxis?.[0]?.id ?? DEFAULT_Y_AXIS_KEY}
            />
            <YAxis
              label="Right Y axis"
              position="right"
              axisId={yAxis?.[1]?.id ?? yAxis?.[0]?.id ?? DEFAULT_Y_AXIS_KEY}
            />
            {children}
          </Surface>
        </CartesianContextProvider>
      </SeriesContextProvider>
    </DrawingProvider>
  );
}
