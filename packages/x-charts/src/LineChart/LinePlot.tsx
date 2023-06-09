import * as React from 'react';
import { line as d3Line } from 'd3-shape';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { LineElement } from './LineElement';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { getValueToPositionMapper } from '../hooks/useScale';
import getCurveFactory from '../internals/getCurve';

export function LinePlot() {
  const seriesData = React.useContext(SeriesContext).line;
  const axisData = React.useContext(CartesianContext);

  const getInteractionItemProps = useInteractionItemProps();

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

          if (xData === undefined) {
            throw new Error(
              `Axis of id "${xAxisKey}" should have data property to be able to display a line plot`,
            );
          }

          const linePath = d3Line<{
            x: any;
            y: any[];
          }>()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y[1]));

          const curve = getCurveFactory(series[seriesId].curve);
          const d3Data = xData?.map((x, index) => ({ x, y: stackedData[index] }));

          return (
            <LineElement
              key={seriesId}
              id={seriesId}
              d={linePath.curve(curve)(d3Data) || undefined}
              color={series[seriesId].color}
              {...getInteractionItemProps({ type: 'line', seriesId })}
            />
          );
        });
      })}
    </g>
  );
}
