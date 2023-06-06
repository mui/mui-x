import * as React from 'react';
import { area as d3Area } from 'd3-shape';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { AreaElement } from './AreaElement';
import { getValueToPositionMapper } from '../hooks/useScale';
import getCurveFactory from '../internals/getCurve';

export function AreaPlot() {
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

          if (xData === undefined) {
            throw new Error(
              `Axis of id "${xAxisKey}" should have data property to be able to display a line plot.`,
            );
          }

          const areaPath = d3Area<{
            x: any;
            y: any[];
          }>()
            .x((d) => xScale(d.x))
            .y0((d) => yScale(d.y[0]))
            .y1((d) => yScale(d.y[1]));

          const curve = getCurveFactory(series[seriesId].curve);
          const d3Data = xData?.map((x, index) => ({ x, y: stackedData[index] }));

          return (
            !!series[seriesId].area && (
              <AreaElement
                key={seriesId}
                id={seriesId}
                d={areaPath.curve(curve)(d3Data) || undefined}
                color={series[seriesId].color}
              />
            )
          );
        });
      })}
    </g>
  );
}
