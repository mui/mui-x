import * as React from 'react';
import BarPlot, { BarPlot2 } from './BarPlot';
import ChartContainer, { ChartContainerProps } from '../ChartContainer';
import XAxis, { XAxis2 } from '../XAxis/XAxis';
import YAxis, { YAxis2 } from '../YAxis/YAxis';
import { SeriesContextProvider } from '../context/SeriesContextProvider';
import { DrawingProvider } from '../context/DrawingProvider';
import { CartesianContextProvider } from '../context/CartesianContextProvider';
import Surface from '../internals/components/Surface';
import { DEFAULT_X_AXIS_KEY } from '../const';

function BarChart(props: Omit<ChartContainerProps, 'children'>) {
  const { xAxis, yAxis, series, width, height, margin, ...other } = props;

  return (
    <ChartContainer
      xAxis={xAxis}
      yAxis={yAxis}
      series={series}
      width={width}
      height={height}
      margin={margin}
      {...other}
    >
      <BarPlot />
      <XAxis label="Bottom X axis" position="bottom" />
      <XAxis label="Top X axis" position="top" />
      <YAxis label="Left Y axis" position="left" />
      <YAxis label="Right Y axis" position="right" />
    </ChartContainer>
  );
}

export function BarChart2(props: Omit<ChartContainerProps, 'children'>) {
  const { xAxis, yAxis, series, width, height, margin } = props;

  return (
    <DrawingProvider width={width} height={height} margin={margin}>
      <SeriesContextProvider series={series}>
        <CartesianContextProvider xAxis={xAxis} yAxis={yAxis}>
          <Surface width={width} height={height}>
            <BarPlot2 />
            <XAxis2
              label="Bottom X axis"
              position="bottom"
              axisId={xAxis[0]?.id ?? DEFAULT_X_AXIS_KEY}
            />
            <XAxis2
              label="Top X axis"
              position="top"
              axisId={xAxis[1]?.id ?? xAxis[0]?.id ?? DEFAULT_X_AXIS_KEY}
            />
            <YAxis2
              label="Left Y axis"
              position="left"
              axisId={yAxis[0]?.id ?? DEFAULT_X_AXIS_KEY}
            />
            <YAxis2
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
