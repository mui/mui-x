import * as React from 'react';
import { Scatter } from './Scatter';
import { SeriesContext } from '../context/SeriesContextProvider';
import { ScatterSeriesType } from '../models/seriesType';
import { CartesianContext } from '../context/CartesianContextProvider';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';

export function ScatterPlot() {
  const seriesData = React.useContext(SeriesContext).scatter;
  const axisData = React.useContext(CartesianContext);

  if (seriesData === undefined) {
    return null;
  }
  const { series, seriesOrder } = seriesData;
  const { xAxis, yAxis } = axisData;

  const seriesPerAxis: { [key: string]: ScatterSeriesType[] } = {};

  seriesOrder.forEach((seriesId) => {
    const xAxisKey = series[seriesId].xAxisKey;
    const yAxisKey = series[seriesId].yAxisKey;

    const key = `${xAxisKey}-${yAxisKey}`;

    if (seriesPerAxis[key] === undefined) {
      seriesPerAxis[key] = [series[seriesId]];
    } else {
      seriesPerAxis[key].push(series[seriesId]);
    }
  });

  return (
    <React.Fragment>
      {seriesOrder.map((seriesId) => {
        const { id, xAxisKey, yAxisKey, markerSize, color } = series[seriesId];

        const xScale = xAxis[xAxisKey ?? DEFAULT_X_AXIS_KEY].scale;
        const yScale = yAxis[yAxisKey ?? DEFAULT_Y_AXIS_KEY].scale;
        return (
          <Scatter
            key={id}
            xScale={xScale}
            yScale={yScale}
            color={color}
            markerSize={markerSize ?? 2}
            series={series[seriesId]}
          />
        );
      })}
    </React.Fragment>
  );
}
