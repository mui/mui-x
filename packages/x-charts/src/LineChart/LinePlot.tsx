import * as React from 'react';
import { CoordinateContext } from '../context/CoordinateContext';
import { DEFAULT_Y_AXIS_KEY } from '../const';
import { SeriesContext } from '../context/SeriesContext';

function LinePlot() {
  const series = React.useContext(SeriesContext);
  const { xAxis, yAxis } = React.useContext(CoordinateContext);

  const seriesPerAxis = {};

  series
    .filter((s) => s.type === 'line')
    .forEach((s) => {
      if (seriesPerAxis[s.xAxisKey] === undefined) {
        seriesPerAxis[s.xAxisKey] = [s];
      } else {
        seriesPerAxis[s.xAxisKey].push(s);
      }
    });

  console.log(seriesPerAxis);
  return (
    <React.Fragment>
      {Object.entries(seriesPerAxis).flatMap(([xAxisKey, plottedSeries]) => {
        const xScale = xAxis[xAxisKey].scale;

        return plottedSeries.map(({ data, yAxisKey }) => {
          const yScale = yAxis[yAxisKey ?? DEFAULT_Y_AXIS_KEY].scale;
          return (
            <path
              d={`M ${data
                .map((y, i) => `${xScale(xAxis[xAxisKey].data[i])} ${yScale(y)}`)
                .join(' L ')}`}
              stroke="black"
              fill="none"
            />
          );
        });
      })}
    </React.Fragment>
  );
}

export default LinePlot;
