'use client';
import * as React from 'react';
import { useStore } from '../internals/store/useStore';
import {
  selectorChartsFocusedSeriesType,
  selectorChartsFocusedSeriesId,
  selectorChartsFocusedDataIndex,
} from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import { type ChartSeriesType } from '../models/seriesType/config';
import { type SeriesId } from '../models/seriesType/common';

export type FocusedItemData = {
  seriesType: ChartSeriesType;
  seriesId: SeriesId;
  dataIndex: number;
};

/**
 * Get the focused item from keyboard navigation.
 */
export function useFocusedItem() {
  const store = useStore();
  const focusedSeriesType = store.use(selectorChartsFocusedSeriesType);
  const focusedSeriesId = store.use(selectorChartsFocusedSeriesId);
  const focusedDataIndex = store.use(selectorChartsFocusedDataIndex);

  return React.useMemo(
    () =>
      focusedSeriesType === undefined ||
      focusedSeriesId === undefined ||
      focusedDataIndex === undefined
        ? null
        : {
            seriesType: focusedSeriesType,
            seriesId: focusedSeriesId,
            dataIndex: focusedDataIndex,
          },
    [focusedSeriesType, focusedSeriesId, focusedDataIndex],
  );
}
