import * as React from 'react';
import Scatter from './Scatter';
import { SeriesContext } from '../context/SeriesContextProvider';
import { ScatterSeriesType } from '../models/seriesType';
import { CartesianContext } from '../context/CartesianContextProvider';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../const';

function ScatterPlot() {
  const { series, seriesOrder } = React.useContext(SeriesContext).scatter;
  const { xAxis, yAxis } = React.useContext(CartesianContext);

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
        const { id, xAxisKey, yAxisKey, markerSize, data } = series[seriesId];

        const xScale = xAxis[xAxisKey ?? DEFAULT_X_AXIS_KEY].scale;
        const yScale = yAxis[yAxisKey ?? DEFAULT_Y_AXIS_KEY].scale;
        return (
          <Scatter
            key={id}
            xDataToSvg={xScale}
            yDataToSvg={yScale}
            markerSize={markerSize ?? 2}
            data={data}
          />
        );
      })}
    </React.Fragment>
  );
}

export default ScatterPlot;
