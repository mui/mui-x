import * as React from 'react';
import LinePlot from './LinePlot';
import ChartContainer, { ChartContainerProps } from '../ChartContainer';
import XAxis from '../XAxis/XAxis';
import YAxis from '../YAxis/YAxis';

function LineChart(props: Omit<ChartContainerProps, 'children'>) {
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
      <LinePlot />
      <XAxis label="Bottom X axis" position="bottom" />
      <XAxis label="Top X axis" position="top" />
      <YAxis label="Left Y axis" position="left" />
      <YAxis label="Right Y axis" position="right" />
    </ChartContainer>
  );
}

export default LineChart;
