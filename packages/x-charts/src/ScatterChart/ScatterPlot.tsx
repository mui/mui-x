import * as React from 'react';
import Scatter from './Scatter';
import { CoordinateContext } from '../context/CoordinateContext';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../const';
import { SeriesContext } from '../context/SeriesContext';

function ScatterPlot() {
  const series = React.useContext(SeriesContext);
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

export default ScatterPlot;
