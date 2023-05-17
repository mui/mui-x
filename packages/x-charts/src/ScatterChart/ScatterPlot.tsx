import * as React from 'react';
import { Scatter } from './Scatter';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';

export function ScatterPlot() {
  const seriesData = React.useContext(SeriesContext).scatter;
  const axisData = React.useContext(CartesianContext);

  if (seriesData === undefined) {
    return null;
  }
  const { series, seriesOrder } = seriesData;
  const { xAxis, yAxis, xAxisIds, yAxisIds } = axisData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  return (
    <React.Fragment>
      {seriesOrder.map((seriesId) => {
        const { id, xAxisKey, yAxisKey, markerSize, color } = series[seriesId];

        const xScale = xAxis[xAxisKey ?? defaultXAxisId].scale;
        const yScale = yAxis[yAxisKey ?? defaultYAxisId].scale;
        return (
          <Scatter
            key={id}
            xScale={xScale}
            yScale={yScale}
            color={color}
            markerSize={markerSize ?? 4}
            series={series[seriesId]}
          />
        );
      })}
    </React.Fragment>
  );
}
