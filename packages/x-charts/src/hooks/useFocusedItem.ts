'use client';
import * as React from 'react';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import {
  selectorChartsFocusedSeriesType,
  selectorChartsFocusedSeriesId,
  selectorChartsFocusedDataIndex,
} from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import { ChartSeriesType } from '../models/seriesType/config';
import { SeriesId } from '../models/seriesType/common';

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
  const focusedSeriesType = useSelector(store, selectorChartsFocusedSeriesType);
  const focusedSeriesId = useSelector(store, selectorChartsFocusedSeriesId);
  const focusedDataIndex = useSelector(store, selectorChartsFocusedDataIndex);

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
