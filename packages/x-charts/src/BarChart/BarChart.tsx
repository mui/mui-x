import * as React from 'react';
import BarPlot from './BarPlot';
import { ChartContainerProps } from '../ChartContainer';
import XAxis from '../XAxis/XAxis';
import YAxis from '../YAxis/YAxis';
import { SeriesContextProvider } from '../context/SeriesContextProvider';
import { DrawingProvider } from '../context/DrawingProvider';
import { CartesianContextProvider } from '../context/CartesianContextProvider';
import Surface from '../internals/components/Surface';
import { DEFAULT_X_AXIS_KEY } from '../const';

export function BarChart(props: Omit<ChartContainerProps, 'children'>) {
  const { xAxis, yAxis, series, width, height, margin } = props;

  return (
    <DrawingProvider width={width} height={height} margin={margin}>
      <SeriesContextProvider series={series}>
        <CartesianContextProvider xAxis={xAxis} yAxis={yAxis}>
          <Surface width={width} height={height}>
            <BarPlot />
            <XAxis
              label="Bottom X axis"
              position="bottom"
              axisId={xAxis[0]?.id ?? DEFAULT_X_AXIS_KEY}
            />
            <XAxis
              label="Top X axis"
              position="top"
              axisId={xAxis[1]?.id ?? xAxis[0]?.id ?? DEFAULT_X_AXIS_KEY}
            />
            <YAxis
              label="Left Y axis"
              position="left"
              axisId={yAxis[0]?.id ?? DEFAULT_X_AXIS_KEY}
            />
            <YAxis
              label="Right Y axis"
              position="right"
              axisId={yAxis[1]?.id ?? yAxis[0]?.id ?? DEFAULT_X_AXIS_KEY}
            />
          </Surface>
        </CartesianContextProvider>
      </SeriesContextProvider>
    </DrawingProvider>
  );
}

export default BarChart;
