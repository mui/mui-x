import type { SeriesId } from '../../../../../models/seriesType/common';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { FocusedItemIdentifier } from '../../../../../models/seriesType';
import type { ProcessedSeries } from '../../../corePlugins/useChartSeries/useChartSeries.types';
import { getNonEmptySeriesArray } from './getNonEmptySeriesArray';
import { findVisibleDataIndex } from './findVisibleDataIndex';

/** Series drawn against a rotation axis, and navigable with the keyboard. */
const rotationSeriesTypes = new Set(['radar'] as const);

/**
 * Resolves the item a click falls on from the rotation axis index, for charts that have no
 * cartesian axis to fall back to.
 *
 * The index is the one the axis highlight already resolved from the pointer, so a click between
 * two spokes picks the same one the highlight shows: the nearest, changing at the midline.
 *
 * Keeps the focused series when there is one, so the click moves along the series the user was
 * already navigating.
 */
export function getItemAtRotationIndex({
  dataIndex,
  processedSeries,
  focusedItem,
}: {
  dataIndex: number | null;
  processedSeries: ProcessedSeries<ChartSeriesType>;
  focusedItem: FocusedItemIdentifier<ChartSeriesType> | null;
}): FocusedItemIdentifier<ChartSeriesType> | null {
  if (dataIndex === null || dataIndex < 0) {
    return null;
  }

  const target = getTargetSeries(processedSeries, focusedItem);
  if (target === null) {
    return null;
  }

  const data = processedSeries[target.type]?.series[target.seriesId]?.data as
    | ReadonlyArray<unknown>
    | undefined;
  if (!data || data.length === 0) {
    return null;
  }

  // The axis can be longer than the series it is shared with, and the index may be hidden.
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

/** The focused series when it is drawn against a rotation axis, the first series with data otherwise. */
function getTargetSeries(
  processedSeries: ProcessedSeries<ChartSeriesType>,
  focusedItem: FocusedItemIdentifier<ChartSeriesType> | null,
): { type: ChartSeriesType; seriesId: SeriesId } | null {
  if (
    focusedItem != null &&
    rotationSeriesTypes.has(focusedItem.type as never) &&
    processedSeries[focusedItem.type]?.series[focusedItem.seriesId] !== undefined
  ) {
    return { type: focusedItem.type, seriesId: focusedItem.seriesId };
  }

  return getNonEmptySeriesArray(processedSeries, rotationSeriesTypes as never)[0] ?? null;
}
