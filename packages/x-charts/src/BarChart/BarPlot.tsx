import * as React from 'react';
import { SeriesContext } from '../context/SeriesContextProvider';
import { BarSeriesType } from '../models/seriesType';
import { CartesianContext } from '../context/CartesianContextProvider';

export default function BarPlot() {
  const { series, seriesOrder, stackingGroups } = React.useContext(SeriesContext).bar;
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
