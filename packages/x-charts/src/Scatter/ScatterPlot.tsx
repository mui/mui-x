import * as React from 'react';
import Scatter from './Scatter';
import { CoordinateContext } from '../context/CoordinateContext';
import { ScatterSeriesType } from '../models/seriesType/scatter';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../const';
import ChartContainer, { ChartContainerProps } from '../ChartContainer';

export interface ScatterPlotProps {
  series: ScatterSeriesType[];
}

function InnerScatterPlot(props: ScatterPlotProps) {
  const { series } = props;

  const { xDataToSvg, yDataToSvg } = React.useContext(CoordinateContext);

  return (
    <React.Fragment>
      {series.map(({ id, xAxisKey, yAxisKey, markerSize, data }) => (
        <Scatter
          key={id}
          xDataToSvg={xDataToSvg[xAxisKey ?? DEFAULT_X_AXIS_KEY]}
          yDataToSvg={yDataToSvg[yAxisKey ?? DEFAULT_Y_AXIS_KEY]}
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
    </ChartContainer>
  );
}

export default ScatterPlot;
