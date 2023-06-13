import * as React from 'react';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { MarkElement } from './MarkElement';
import { getValueToPositionMapper } from '../hooks/useScale';

export function MarkPlot() {
  const seriesData = React.useContext(SeriesContext).line;
  const axisData = React.useContext(CartesianContext);

  if (seriesData === undefined) {
    return null;
  }
  const { series, stackingGroups } = seriesData;
  const { xAxis, yAxis, xAxisIds, yAxisIds } = axisData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  return (
    <g>
      {stackingGroups.flatMap(({ ids: groupIds }) => {
        return groupIds.flatMap((seriesId) => {
          const {
            xAxisKey = defaultXAxisId,
            yAxisKey = defaultYAxisId,
            stackedData,
          } = series[seriesId];

          const xScale = getValueToPositionMapper(xAxis[xAxisKey].scale);
          const yScale = yAxis[yAxisKey].scale;
          const xData = xAxis[xAxisKey].data;

          const xRange = xAxis[xAxisKey].scale.range();
          const yRange = yScale.range();

          const isInRange = ({ x, y }: { x: number; y: number }) => {
            if (x < Math.min(...xRange) || x > Math.max(...xRange)) {
              return false;
            }
            if (y < Math.min(...yRange) || y > Math.max(...yRange)) {
              return false;
            }
            return true;
          };

          if (xData === undefined) {
            throw new Error(
              `Axis of id "${xAxisKey}" should have data property to be able to display a line plot`,
            );
          }

          return xData
            ?.map((x, index) => {
              const y = stackedData[index][1];
              return {
                x: xScale(x),
                y: yScale(y),
                index,
              };
            })
            .filter(isInRange)
            .map(({ x, y, index }) => (
              <MarkElement
                key={`${seriesId}-${index}`}
                id={seriesId}
                dataIndex={index}
                shape="circle"
                color={series[seriesId].color}
                x={x}
                y={y}
                highlightScope={series[seriesId].highlightScope}
              />
            ));
        });
      })}
    </g>
  );
}
