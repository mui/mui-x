'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { useChartStore } from '../internals/store/useChartStore';

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
  const store = useChartStore();
  const focusedSeriesType = useStore(store, selectorChartsFocusedSeriesType);
  const focusedSeriesId = useStore(store, selectorChartsFocusedSeriesId);
  const focusedDataIndex = useStore(store, selectorChartsFocusedDataIndex);

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
