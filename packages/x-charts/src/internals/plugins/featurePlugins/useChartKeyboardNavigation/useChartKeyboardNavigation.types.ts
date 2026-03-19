import type { ChartPluginSignature } from '../../models';
import type { UseChartInteractionSignature } from '../useChartInteraction';
import type { UseChartCartesianAxisSignature } from '../useChartCartesianAxis';
import type { UseChartHighlightSignature } from '../useChartHighlight';
import type { FocusedItemIdentifier } from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

export interface UseChartKeyboardNavigationInstance {}

export interface UseChartKeyboardNavigationState {
  keyboardNavigation: {
    item: null | FocusedItemIdentifier<ChartSeriesType>;
    isFocused: boolean;
    /**
     * Indicates whether keyboard navigation is enabled or not.
     */
    enabled: boolean;
  };
}

type UseChartKeyboardNavigationParameters = {
  /**
   * If `true`, disables keyboard navigation for the chart.
   */
  disableKeyboardNavigation?: boolean;
};

export type UseChartKeyboardNavigationSignature = ChartPluginSignature<{
  params: UseChartKeyboardNavigationParameters;
  defaultizedParams: UseChartKeyboardNavigationParameters;
  instance: UseChartKeyboardNavigationInstance;
  state: UseChartKeyboardNavigationState;
  optionalDependencies: [
    UseChartInteractionSignature,
    UseChartHighlightSignature<ChartSeriesType>,
    UseChartCartesianAxisSignature,
  ];
}>;
