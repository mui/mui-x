import * as React from 'react';
import BarPlot, { BarPlot2 } from './BarPlot';
import ChartContainer, { ChartContainerProps } from '../ChartContainer';
import XAxis from '../XAxis/XAxis';
import YAxis from '../YAxis/YAxis';
import { SeriesContextProvider } from '../context/SeriesContextProvider';
import { DrawingProvider } from '../context/DrawingProvider';
import { CartesianContextProvider } from '../context/CartesianContextProvider';
import Surface from '../internals/components/Surface';

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
            {/* <XAxis label="Bottom X axis" position="bottom" />
            <XAxis label="Top X axis" position="top" />
            <YAxis label="Left Y axis" position="left" />
            <YAxis label="Right Y axis" position="right" /> */}
          </Surface>
        </CartesianContextProvider>
      </SeriesContextProvider>
    </DrawingProvider>
  );
}

export default BarChart;
