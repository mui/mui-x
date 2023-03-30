import * as React from 'react';
import { line as d3Line, area as d3Area } from 'd3-shape';
import { SeriesContext } from '../context/SeriesContextProvider';
import { LineSeriesType } from '../models/seriesType';
import { CartesianContext } from '../context/CartesianContextProvider';

export function LinePlot() {
  const seriesData = React.useContext(SeriesContext).line;
  const axisData = React.useContext(CartesianContext);

  if (seriesData === undefined) {
    return null;
  }
  const { series, seriesOrder, stackingGroups } = seriesData;
  const { xAxis, yAxis } = axisData;

  const seriesPerAxis: { [key: string]: LineSeriesType[] } = {};

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
      <g>
        {Object.keys(seriesPerAxis).flatMap((key) => {
          const [xAxisKey, yAxisKey] = key.split('-');

          const xScale = xAxis[xAxisKey].scale;
          const yScale = yAxis[yAxisKey].scale;
          const xData = xAxis[xAxisKey].data;

          if (xData === undefined) {
            throw new Error(
              `Axis of id "${xAxisKey}" should have data property to be able to display a line plot`,
            );
          }

          const areaPath = d3Area<{
            x: any;
            y: any[];
          }>()
            .x((d) => xScale(d.x))
            .y0((d) => yScale(d.y[0]))
            .y1((d) => yScale(d.y[1]));

          return stackingGroups.flatMap((groupIds) => {
            return groupIds.flatMap((seriesId) => {
              const stackedData = series[seriesId].stackedData;
              const d3Data = xData?.map((x, index) => ({ x, y: stackedData[index] }));

              return (
                !!series[seriesId].area && (
                  <path
                    key={seriesId}
                    d={areaPath(d3Data) || undefined}
                    stroke="none"
                    fill={series[seriesId].area.color ?? series[seriesId].color}
                    fillOpacity={0.8}
                    style={{ pointerEvents: 'none' }}
                  />
                )
              );
            });
          });
        })}
      </g>
      <g>
        {Object.keys(seriesPerAxis).flatMap((key) => {
          const [xAxisKey, yAxisKey] = key.split('-');

          const xScale = xAxis[xAxisKey].scale;
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

          return stackingGroups.flatMap((groupIds) => {
            return groupIds.flatMap((seriesId) => {
              const stackedData = series[seriesId].stackedData;
              const d3Data = xData?.map((x, index) => ({ x, y: stackedData[index] }));

              return (
                <path
                  key={seriesId}
                  d={linePath(d3Data) || undefined}
                  stroke={series[seriesId].color}
                  strokeWidth={5}
                  fill="none"
                  // strokeDasharray={strokeDasharray}
                  // strokeWidth={strokeWidth}
                  // transform={`translate(0, ${boundedHeight})`}
                  style={{ pointerEvents: 'none' }}
                />
              );
            });
          });
        })}
      </g>
    </React.Fragment>
  );
}
