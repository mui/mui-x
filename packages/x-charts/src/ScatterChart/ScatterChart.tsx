import * as React from 'react';
import ScatterPlot, { ScatterPlotProps } from './ScatterPlot';
import ChartContainer, { ChartContainerProps } from '../ChartContainer';
import XAxis from '../XAxis/XAxis';
import YAxis from '../YAxis/YAxis';

function ScatterChart(props: Omit<ChartContainerProps, 'children'> & ScatterPlotProps) {
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
      <ScatterPlot series={series} />
      <XAxis label="Bottom X axis" position="bottom" />
      <XAxis label="Top X axis" position="top" />
      <YAxis label="Left Y axis" position="left" />
      <YAxis label="Right Y axis" position="right" />
    </ChartContainer>
  );
}

export default ScatterChart;
