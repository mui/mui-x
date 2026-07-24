import type { ChartPluginSignature } from '../../models';
import type { UseChartInteractionSignature } from '../useChartInteraction';
import type { UseChartCartesianAxisSignature } from '../useChartCartesianAxis';
import type { UseChartHighlightSignature } from '../useChartHighlight';
import type { FocusedItemIdentifier } from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

export interface UseChartKeyboardNavigationInstance {
  handleKeyboardNavigationClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  setKeyboardNavigationItem: (item: FocusedItemIdentifier<ChartSeriesType> | null) => void;
}

export interface UseChartKeyboardNavigationState {
  keyboardNavigation: {
    /**
     * The item with keyboard focus. It is `null` when no item is focused.
     */
    item: null | FocusedItemIdentifier<ChartSeriesType>;
    /**
     * If `false` the focus is ignored, but we keep the item in the state to be able to restore it when focus is active again.
     */
    isFocused: boolean;
    /**
     * Indicates whether keyboard navigation is enabled or not.
     */
    enabled: boolean;
    /**
     * Incremented whenever an item should receive focus in the accessibility proxy.
     * This lets the proxy react when two items have the same description or the same item is clicked again.
     */
    focusRequestId: number;
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
