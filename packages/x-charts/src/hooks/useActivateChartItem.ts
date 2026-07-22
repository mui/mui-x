'use client';
import useEventCallback from '@mui/utils/useEventCallback';
import { useChartsContext } from '../context/ChartsProvider';
import type { FocusedItemIdentifier } from '../models/seriesType';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { UseChartKeyboardNavigationSignature } from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';

/**
 * Returns a callback that makes a chart item the starting point for keyboard navigation.
 */
export function useActivateChartItem() {
  const { instance } = useChartsContext<[], [UseChartKeyboardNavigationSignature]>();

  return useEventCallback((item: FocusedItemIdentifier<ChartSeriesType>) => {
    instance.setKeyboardNavigationItem?.(item);
  });
}
