import * as React from 'react';
import { useChartId } from '../hooks/useChartId';
import { getValueToPositionMapper, useLineSeriesContext, useXAxes, useYAxes } from '../hooks';
import { cleanId } from '../internals/cleanId';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { type SeriesId } from '../models/seriesType/common';
import {
  type ComputedAxisConfig,
  type UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { type ChartsXAxisProps, type ChartsYAxisProps } from '../models';
import { type AxisId } from '../models/axis';
import getColor from './seriesConfig/getColor';
import { useChartContext } from '../context/ChartProvider';
import type { UseChartBrushSignature } from '../internals/plugins/featurePlugins/useChartBrush';

export interface MarkPlotDataPoint {
  x: number;
  y: number;
  index: number;
  color: string;
}

export interface MarkPlotSeriesData {
  seriesId: SeriesId;
  clipId: string;
  shape: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
  xAxisId: AxisId;
  marks: MarkPlotDataPoint[];
}

export function useMarkPlotData(
  xAxes: ComputedAxisConfig<ChartsXAxisProps>,
  yAxes: ComputedAxisConfig<ChartsYAxisProps>,
) {
  const seriesData = useLineSeriesContext();
  const defaultXAxisId = useXAxes().xAxisIds[0];
  const defaultYAxisId = useYAxes().yAxisIds[0];
  const chartId = useChartId();
  const { instance } = useChartContext<[UseChartCartesianAxisSignature, UseChartBrushSignature]>();

  const allData = React.useMemo(() => {
    if (seriesData === undefined) {
      return [];
    }

    const { series, stackingGroups } = seriesData;

    const markPlotData: MarkPlotSeriesData[] = [];

    for (const stackingGroup of stackingGroups) {
      const groupIds = stackingGroup.ids;

      for (const seriesId of groupIds) {
        const {
          xAxisId = defaultXAxisId,
          yAxisId = defaultYAxisId,
          stackedData,
          data,
          showMark = true,
          shape = 'circle',
        } = series[seriesId];

        if (showMark === false) {
          continue;
        }

        if (!(xAxisId in xAxes) || !(yAxisId in yAxes)) {
          continue;
        }

        const xScale = getValueToPositionMapper(xAxes[xAxisId].scale);
        const yScale = yAxes[yAxisId].scale;
        const xData = xAxes[xAxisId].data;

        if (process.env.NODE_ENV !== 'production') {
          if (xData === undefined) {
            throw new Error(
              `MUI X Charts: ${
                xAxisId === DEFAULT_X_AXIS_KEY
                  ? 'The first `xAxis`'
                  : `The x-axis with id "${xAxisId}"`
              } should have data property to be able to display a line plot.`,
            );
          }
        }

        const clipId = cleanId(`${chartId}-${seriesId}-line-clip`);
        const colorGetter = getColor(series[seriesId], xAxes[xAxisId], yAxes[yAxisId]);

        const marks: MarkPlotDataPoint[] =
          xData
            ?.map((x, index) => {
              const value = data[index] == null ? null : stackedData[index][1];
              return {
                x: xScale(x),
                y: value === null ? null : yScale(value)!,
                position: x,
                value,
                index,
              };
            })
            .filter(({ x, y, index, position, value }) => {
              if (value === null || y === null) {
                // Remove missing data point
                return false;
              }
              if (!instance.isPointInside(x, y)) {
                // Remove out of range
                return false;
              }
              if (showMark === true) {
                return true;
              }
              return showMark({
                x,
                y,
                index,
                position,
                value,
              });
            })
            .map(({ x, y, index }) => ({
              x,
              y: y!,
              index,
              color: colorGetter(index),
            })) ?? [];

        markPlotData.push({
          seriesId,
          clipId,
          shape,
          xAxisId,
          marks,
        });
      }
    }

    return markPlotData;
  }, [seriesData, defaultXAxisId, defaultYAxisId, chartId, xAxes, yAxes, instance]);

  return allData;
}
