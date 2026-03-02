import type { ChartPluginSignature } from '../../models';
import type { UseChartInteractionSignature } from '../useChartInteraction';
import type { UseChartCartesianAxisSignature } from '../useChartCartesianAxis';
import type { UseChartHighlightSignature } from '../useChartHighlight';
import type { FocusedItemIdentifier } from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

export interface UseChartKeyboardNavigationInstance {}

export interface UseChartKeyboardNavigationState {
  keyboardNavigation: {
    /**
     * The item with keyboard focus. It is `null` when no item is focused.
     */
    item: null | FocusedItemIdentifier<ChartSeriesType>;
    /**
     * If `false` the focus is ignored, but we keep the item in the state to be able to restore it when focus is active again.
     */
    focusIsActive: boolean;
    /**
     * Whether keyboard navigation is enabled.
     */
    enableKeyboardNavigation: boolean;
  };
}

type UseChartKeyboardNavigationParameters = {
  enableKeyboardNavigation?: boolean;
};

export type UseChartKeyboardNavigationSignature = ChartPluginSignature<{
  params: UseChartKeyboardNavigationParameters;
  defaultizedParams: UseChartKeyboardNavigationParameters;
  instance: UseChartKeyboardNavigationInstance;
  state: UseChartKeyboardNavigationState;
  optionalDependencies: [
    UseChartInteractionSignature,
    UseChartHighlightSignature,
    UseChartCartesianAxisSignature,
  ];
}>;
