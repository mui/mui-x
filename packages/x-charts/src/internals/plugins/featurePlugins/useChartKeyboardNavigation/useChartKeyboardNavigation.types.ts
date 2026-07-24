import type { ChartPluginSignature } from '../../models';
import type { UseChartInteractionSignature } from '../useChartInteraction';
import type { UseChartCartesianAxisSignature } from '../useChartCartesianAxis';
import type { UseChartHighlightSignature } from '../useChartHighlight';
import type { FocusedItemIdentifier, SeriesId } from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

/**
 * Called when the focused item is activated with the keyboard.
 * @param {KeyboardEvent} event The keyboard event that triggered the activation.
 * @param {FocusedItemIdentifier<ChartSeriesType>} item The activated item.
 */
export type ItemActivationHandler = (
  event: KeyboardEvent,
  item: FocusedItemIdentifier<ChartSeriesType>,
) => void;

/**
 * The items a handler covers. An empty scope covers every item.
 */
export interface ItemActivationScope {
  type?: ChartSeriesType;
  seriesId?: SeriesId;
  /**
   * Breaks ties between handlers covering the same items, highest first.
   * Mirrors pointer hit-testing, where marks sit above lines, and lines above areas.
   * @default 0
   */
  priority?: number;
}

export interface UseChartKeyboardNavigationInstance {
  /**
   * Registers a handler triggered when the focused item is activated with the keyboard.
   * Only the handler with the most specific matching scope runs, so plots sharing a series
   * do not fire the callback twice.
   * @param {ItemActivationScope} scope The items the handler covers.
   * @param {ItemActivationHandler} handler The handler to call on activation.
   * @returns {() => void} A cleanup function unregistering the handler.
   */
  registerItemActivationHandler: (
    scope: ItemActivationScope,
    handler: ItemActivationHandler,
  ) => () => void;
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
