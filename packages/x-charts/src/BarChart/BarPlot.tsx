import * as React from 'react';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { isBandScale } from '../hooks/useScale';
import { BarElement } from './BarElement';

export function BarPlot() {
  const seriesData = React.useContext(SeriesContext).bar;
  const axisData = React.useContext(CartesianContext);

  if (seriesData === undefined) {
    return null;
  }
  const { series, stackingGroups } = seriesData;
  const { xAxis, yAxis, xAxisIds, yAxisIds } = axisData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  return (
    <React.Fragment>
      {stackingGroups.flatMap(({ ids: groupIds }, groupIndex) => {
        return groupIds.flatMap((seriesId) => {
          const xAxisKey = series[seriesId].xAxisKey ?? defaultXAxisId;
          const yAxisKey = series[seriesId].yAxisKey ?? defaultYAxisId;

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

          // @ts-ignore TODO: fix when adding a correct API for customisation
          const { stackedData, color } = series[seriesId];

          return stackedData.map((values, dataIndex: number) => {
            const baseline = Math.min(...values);
            const value = Math.max(...values);
            return (
              <BarElement
                key={`${seriesId}-${dataIndex}`}
                id={seriesId}
                dataIndex={dataIndex}
                x={xScale(xAxis[xAxisKey].data?.[dataIndex])! + groupIndex * barWidth + offset}
                y={yScale(value)}
                height={yScale(baseline) - yScale(value)}
                width={barWidth}
                color={color}
              />
            );
          });
        });
      })}
    </React.Fragment>
  );
}
