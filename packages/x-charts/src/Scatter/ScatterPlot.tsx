import * as React from 'react';
import Scatter from './Scatter';
import { CoordinateContext } from '../context/CoordinateContext';
import { ScatterSeriesType } from '../models/seriesType/scatter';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../const';
import ChartContainer, { ChartContainerProps } from '../ChartContainer';
import XAxis from '../XAxis/XAxis';
import YAxis from '../YAxis/YAxis';

export interface ScatterPlotProps {
  series: ScatterSeriesType[];
}

function InnerScatterPlot(props: ScatterPlotProps) {
  const { series } = props;

  const { xAxis, yAxis } = React.useContext(CoordinateContext);

  return (
    <React.Fragment>
      {series.map(({ id, xAxisKey, yAxisKey, markerSize, data }) => (
        <Scatter
          key={id}
          xDataToSvg={xAxis[xAxisKey ?? DEFAULT_X_AXIS_KEY].scale}
          yDataToSvg={yAxis[yAxisKey ?? DEFAULT_Y_AXIS_KEY].scale}
          markerSize={markerSize ?? 2}
          data={data}
        />
      ))}
    </React.Fragment>
  );
}
function ScatterPlot(props: Omit<ChartContainerProps, 'children'> & ScatterPlotProps) {
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
      <InnerScatterPlot series={series} />
      <XAxis label="Bottom X axis" position="bottom" />
      <XAxis label="Top X axis" position="top" />
      <YAxis label="Left Y axis" position="left" />
      <YAxis label="Right Y axis" position="right" />
    </ChartContainer>
  );
}

export default ScatterPlot;
