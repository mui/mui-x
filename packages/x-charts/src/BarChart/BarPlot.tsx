import * as React from 'react';
import { SeriesContext } from '../context/SeriesContextProvider';
import { BarSeriesType } from '../models/seriesType';
import { CartesianContext } from '../context/CartesianContextProvider';
import { isBandScale } from '../hooks/useScale';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';

export function BarPlot() {
  const seriesData = React.useContext(SeriesContext).bar;
  const axisData = React.useContext(CartesianContext);
  const getInteractionItemProps = useInteractionItemProps();

  if (seriesData === undefined) {
    return null;
  }
  const { series, seriesOrder, stackingGroups } = seriesData;
  const { xAxis, yAxis } = axisData;

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

        if (!isBandScale(xScale)) {
          throw new Error(
            `Axis with id "${xAxisKey}" shoud be of type "band" to display the bar series ${stackingGroups}`,
          );
        }

        if (xAxis[xAxisKey].data === undefined) {
          throw new Error(`Axis with id "${xAxisKey}" shoud have data property`);
        }

        // Currently assuming all bars are vertical
        const bandWidth = xScale.bandwidth();
        const barWidth = (0.9 * bandWidth) / stackingGroups.length;
        const offset = 0.05 * bandWidth;

        return stackingGroups.flatMap((groupIds, groupIndex) => {
          return groupIds.flatMap((seriesId) => {
            // @ts-ignore TODO: fix when adding a correct API for customisation
            const { stackedData, color } = series[seriesId];

            return stackedData.map(([baseline, value], dataIndex: number) => {
              return (
                <rect
                  key={`${seriesId}-${dataIndex}`}
                  // @ts-ignore I don't get why this warning
                  x={xScale(xAxis[xAxisKey].data[dataIndex]) + groupIndex * barWidth + offset}
                  y={yScale(value)}
                  height={yScale(baseline) - yScale(value)}
                  width={barWidth}
                  fill={color}
                  rx="5px"
                  {...getInteractionItemProps({ type: 'bar', seriesId, dataIndex })}
                />
              );
            });
          });
        });
      })}
    </React.Fragment>
  );
}
