import * as React from 'react';
import { CoordinateContext } from '../context/CoordinateContext';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../const';
import { SeriesContext } from '../context/SeriesContext';
import { SeriesContext as SeriesContext2 } from '../context/SeriesContextProvider';
import stackSeries from '../internals/stackSeries';
import { BarSeriesType } from '../models/seriesType';
import { CartesianContext } from '../context/CartesianContextProvider';

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

export function BarPlot2() {
  const { series, seriesOrder, stackingGroups } = React.useContext(SeriesContext2).bar;
  const { xAxis, yAxis } = React.useContext(CartesianContext);

  const seriesPerAxis: { [key: string]: BarSeriesType[] } = {};

  seriesOrder.forEach((seriesId) => {
    const xAxisKey = series[seriesId].xAxisKey; // ?? DEFAULT_X_AXIS_KEY;
    const yAxisKey = series[seriesId].yAxisKey; // ?? DEFAULT_Y_AXIS_KEY;

    const key = `${xAxisKey}-${yAxisKey}`;

    if (seriesPerAxis[key] === undefined) {
      seriesPerAxis[key] = [series[seriesId]];
    } else {
      seriesPerAxis[key].push(series[seriesId]);
    }
  });
  // return null;
  return (
    <React.Fragment>
      {Object.keys(seriesPerAxis).flatMap((key) => {
        const [xAxisKey, yAxisKey] = key.split('-');

        const xScale = xAxis[xAxisKey].scale;
        const yScale = yAxis[yAxisKey].scale;

        // Currently assuming all bars are vertical
        const bandWidth = xScale.bandwidth();
        const barWidth = (0.9 * bandWidth) / stackingGroups.length;
        const offset = 0.05 * bandWidth;

        return stackingGroups.flatMap((groupIds, groupIndex) => {
          return groupIds.flatMap((seriesId) => {
            const { stackedData } = series[seriesId];
            console.log({ seriesId, stackedData });
            return stackedData.map(([baseline, value], dataIndex: number) => {
              return (
                <rect
                  key={`${seriesId}-${dataIndex}`}
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
