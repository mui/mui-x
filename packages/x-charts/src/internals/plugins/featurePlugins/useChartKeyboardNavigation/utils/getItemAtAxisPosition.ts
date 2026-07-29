import type { SeriesId } from '../../../../../models/seriesType/common';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { FocusedItemIdentifier } from '../../../../../models/seriesType';
import { composableCartesianSeriesTypes } from '../../../../../models/seriesType/composition';
import type { ProcessedSeries } from '../../../corePlugins/useChartSeries/useChartSeries.types';
import type { ComputeResult } from '../../useChartCartesianAxis/computeAxisValue';
import type { ChartsXAxisProps, ChartsYAxisProps } from '../../../../../models/axis';
import { getAxisIndex } from '../../useChartCartesianAxis/getAxisValue';
import { getNonEmptySeriesArray } from './getNonEmptySeriesArray';
import { findVisibleDataIndex } from './findVisibleDataIndex';

/**
 * Resolves the item a click falls on when it hit no item, by looking at the axis under the
 * pointer. Keeps the focused series when there is one, so clicking the empty space above a bar
 * moves along the series the user was already navigating.
 *
 * Returns `null` for charts without a cartesian axis, and when the axis resolves no index.
 */
export function getItemAtAxisPosition({
  point,
  xAxis,
  yAxis,
  processedSeries,
  focusedItem,
}: {
  point: { x: number; y: number };
  xAxis: ComputeResult<ChartsXAxisProps> | undefined;
  yAxis: ComputeResult<ChartsYAxisProps> | undefined;
  processedSeries: ProcessedSeries<ChartSeriesType>;
  focusedItem: FocusedItemIdentifier<ChartSeriesType> | null;
}): FocusedItemIdentifier<ChartSeriesType> | null {
  const xAxisId = xAxis?.axisIds[0];
  const yAxisId = yAxis?.axisIds[0];
  const xAxisConfig = xAxisId === undefined ? undefined : xAxis?.axis[xAxisId];
  const yAxisConfig = yAxisId === undefined ? undefined : yAxis?.axis[yAxisId];

  if (!xAxisConfig && !yAxisConfig) {
    return null;
  }

  const xIndex = xAxisConfig ? getAxisIndex(xAxisConfig, point.x) : -1;
  const yIndex = yAxisConfig ? getAxisIndex(yAxisConfig, point.y) : -1;
  const dataIndex = xIndex !== -1 ? xIndex : yIndex;

  if (dataIndex === -1) {
    return null;
  }

  const target = getTargetSeries(processedSeries, focusedItem);
  if (target === null) {
    return null;
  }

  const data = processedSeries[target.type]?.series[target.seriesId]?.data as
    ReadonlyArray<unknown> | undefined;
  if (!data || data.length === 0) {
    return null;
  }

  // The axis can be longer than the series it is shared with, and the index may be hidden.
  const visibleDataIndex =
    findVisibleDataIndex({
      processedSeries,
      type: target.type,
      seriesId: target.seriesId,
      startIndex: Math.min(dataIndex, data.length - 1),
      dataLength: data.length,
      direction: 1,
      allowCycles: false,
    }) ??
    findVisibleDataIndex({
      processedSeries,
      type: target.type,
      seriesId: target.seriesId,
      startIndex: Math.min(dataIndex, data.length - 1),
      dataLength: data.length,
      direction: -1,
      allowCycles: false,
    });

  if (visibleDataIndex === null) {
    return null;
  }

  return {
    type: target.type,
    seriesId: target.seriesId,
    dataIndex: visibleDataIndex,
  } as FocusedItemIdentifier<ChartSeriesType>;
}

/** The focused series when it is a cartesian one, the first series with data otherwise. */
function getTargetSeries(
  processedSeries: ProcessedSeries<ChartSeriesType>,
  focusedItem: FocusedItemIdentifier<ChartSeriesType> | null,
): { type: ChartSeriesType; seriesId: SeriesId } | null {
  if (
    focusedItem != null &&
    composableCartesianSeriesTypes.has(focusedItem.type as never) &&
    processedSeries[focusedItem.type]?.series[focusedItem.seriesId] !== undefined
  ) {
    return { type: focusedItem.type, seriesId: focusedItem.seriesId };
  }

  return getNonEmptySeriesArray(processedSeries, composableCartesianSeriesTypes)[0] ?? null;
}
