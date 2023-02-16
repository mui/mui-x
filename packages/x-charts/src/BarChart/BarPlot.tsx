import * as React from 'react';
import { CoordinateContext } from '../context/CoordinateContext';
import { DEFAULT_Y_AXIS_KEY } from '../const';
import { SeriesContext } from '../context/SeriesContext';

function BarPlot() {
  const series = React.useContext(SeriesContext);
  const { xAxis, yAxis } = React.useContext(CoordinateContext);

  const seriesPerAxis = {};

  series
    .filter((s) => s.type === 'bar')
    .forEach((s) => {
      if (seriesPerAxis[s.xAxisKey] === undefined) {
        seriesPerAxis[s.xAxisKey] = [s];
      } else {
        seriesPerAxis[s.xAxisKey].push(s);
      }
    });
  return (
    <React.Fragment>
      {Object.entries(seriesPerAxis).flatMap(([xAxisKey, plottedSeries]) => {
        const xScale = xAxis[xAxisKey].scale;

        const bandWidth = xScale.bandwidth();
        const barWidth = (0.9 * bandWidth) / plottedSeries.length;

        return plottedSeries.flatMap(({ data, yAxisKey }, seriesIndex) => {
          const yScale = yAxis[yAxisKey ?? DEFAULT_Y_AXIS_KEY].scale;
          return data.map((value, dataIndex) => (
            <rect
              x={xScale(xAxis[xAxisKey].data[dataIndex]) + seriesIndex * barWidth}
              y={yScale(value)}
              height={Math.abs(yScale(0) - yScale(value))}
              width={barWidth}
            />
          ));
        });
      })}
    </React.Fragment>
  );
}

export default BarPlot;
