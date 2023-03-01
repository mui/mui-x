import * as React from 'react';
import { CoordinateContext } from '../context/CoordinateContext';
import { DEFAULT_Y_AXIS_KEY } from '../const';
import { SeriesContext } from '../context/SeriesContext';
import stackSeries from '../internals/stackSeries';
import { BarSeriesType } from '../models/seriesType';

function BarPlot() {
  const series = React.useContext(SeriesContext);
  const { xAxis, yAxis } = React.useContext(CoordinateContext);

  const seriesPerAxis: { [key: string]: BarSeriesType[] } = {};

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
        const [stackedSeries, groupedIndexes] = stackSeries(plottedSeries);
        const xScale = xAxis[xAxisKey].scale;

        const bandWidth = xScale.bandwidth();
        const barWidth = (0.9 * bandWidth) / groupedIndexes.length;
        const offset = 0.05 * bandWidth;

        return groupedIndexes.flatMap((groupIndexes, groupIndex) => {
          return groupIndexes.flatMap((seriesIndex) => {
            const { data, yAxisKey } = plottedSeries[seriesIndex];
            const yScale = yAxis[yAxisKey ?? DEFAULT_Y_AXIS_KEY].scale;

            return data.map((_, dataIndex: number) => {
              const seriesId = series[seriesIndex].id;
              // console.log({ value, seriesId, dataIndex });
              // console.log(stackedSeries[seriesId]);
              // console.log(stackedSeries[seriesId][dataIndex]);
              const baseline = stackedSeries[seriesId][dataIndex][0];
              const value = stackedSeries[seriesId][dataIndex][1];

              return (
                <rect
                  x={xScale(xAxis[xAxisKey].data[dataIndex]) + groupIndex * barWidth + offset}
                  y={yScale(value)}
                  height={yScale(baseline) - yScale(value)}
                  width={barWidth}
                  rx="5px"
                />
              );
            });
          });
        });
      })}
    </React.Fragment>
  );
}

export default BarPlot;
