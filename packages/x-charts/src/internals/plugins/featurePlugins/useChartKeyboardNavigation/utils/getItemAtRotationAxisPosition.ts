import type { SeriesId } from '../../../../../models/seriesType/common';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { FocusedItemIdentifier } from '../../../../../models/seriesType';
import type { ProcessedSeries } from '../../../corePlugins/useChartSeries/useChartSeries.types';
import type { ComputeResult } from '../../useChartCartesianAxis/computeAxisValue';
import type { AxisId, ChartsRotationAxisProps } from '../../../../../models/axis';
import { generateSvg2rotation } from '../../useChartPolarAxis/coordinateTransformation';
import { getRotationAxisIndex } from '../../useChartPolarAxis/getAxisIndex';
import { getNonEmptySeriesArray } from './getNonEmptySeriesArray';
import { findVisibleDataIndex } from './findVisibleDataIndex';

/** Polar series whose items are placed by the rotation axis alone. */
const rotationSeriesTypes = new Set<'radar'>(['radar']);

/**
 * Resolves the item a click falls on for a radar chart, from the angle of the pointer.
 *
 * The radar area path only covers the polygon the data draws, so a click inside the chart but
 * outside that polygon lands on no element and reports no hovered item. The rotation axis still
 * has an index for that angle, which is the radar counterpart of resolving a click from the
 * cartesian axis under the pointer.
 *
 * Returns `null` for charts without a rotation axis, and when the axis resolves no index.
 */
export function getItemAtRotationAxisPosition({
  point,
  center,
  rotationAxis,
  processedSeries,
  focusedItem,
}: {
  point: { x: number; y: number };
  center: { cx: number; cy: number };
  rotationAxis: ComputeResult<ChartsRotationAxisProps> | undefined;
  processedSeries: ProcessedSeries<ChartSeriesType>;
  focusedItem: FocusedItemIdentifier<ChartSeriesType> | null;
}): FocusedItemIdentifier<ChartSeriesType> | null {
  const target = getTargetSeries(processedSeries, focusedItem);
  if (target === null) {
    return null;
  }

  const series = processedSeries[target.type]?.series[target.seriesId];
  const data = series?.data as ReadonlyArray<unknown> | undefined;
  if (!data || data.length === 0) {
    return null;
  }

  const rotationAxisId =
    (series && 'rotationAxisId' in series
      ? (series.rotationAxisId as AxisId | undefined)
      : undefined) ?? rotationAxis?.axisIds[0];
  const axisConfig = rotationAxisId === undefined ? undefined : rotationAxis?.axis[rotationAxisId];

  if (!axisConfig) {
    return null;
  }

  const rotation = generateSvg2rotation(center)(point.x, point.y);
  const dataIndex = getRotationAxisIndex(axisConfig, rotation);

  if (dataIndex === -1) {
    return null;
  }

  const findVisible = (direction: 1 | -1) =>
    findVisibleDataIndex({
      processedSeries,
      type: target.type,
      seriesId: target.seriesId,
      startIndex: Math.min(dataIndex, data.length - 1),
      dataLength: data.length,
      direction,
      allowCycles: false,
    });

  const visibleDataIndex = findVisible(1) ?? findVisible(-1);

  if (visibleDataIndex === null) {
    return null;
  }

  return {
    type: target.type,
    seriesId: target.seriesId,
    dataIndex: visibleDataIndex,
  } as FocusedItemIdentifier<ChartSeriesType>;
}

/** The focused series when it is placed by a rotation axis, the first series with data otherwise. */
function getTargetSeries(
  processedSeries: ProcessedSeries<ChartSeriesType>,
  focusedItem: FocusedItemIdentifier<ChartSeriesType> | null,
): { type: 'radar'; seriesId: SeriesId } | null {
  if (
    focusedItem != null &&
    rotationSeriesTypes.has(focusedItem.type as never) &&
    processedSeries[focusedItem.type]?.series[focusedItem.seriesId] !== undefined
  ) {
    return { type: focusedItem.type as 'radar', seriesId: focusedItem.seriesId };
  }

  return getNonEmptySeriesArray(processedSeries, rotationSeriesTypes)[0] ?? null;
}
