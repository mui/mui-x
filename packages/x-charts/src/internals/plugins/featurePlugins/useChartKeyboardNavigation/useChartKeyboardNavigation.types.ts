import type { ChartPluginSignature } from '../../models';
import type { UseChartInteractionSignature } from '../useChartInteraction';
import type { UseChartCartesianAxisSignature } from '../useChartCartesianAxis';
import type { UseChartHighlightSignature } from '../useChartHighlight';
import type { FocusedItemIdentifier } from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

export interface FocusItemOptions {
  /**
   * Whether the focus indicator should be rendered.
   * Defaults to `focusItemOnClick || <the focus is already visible>`.
   */
  visible?: boolean;
}

export interface UseChartKeyboardNavigationInstance {
  /**
   * Makes an item the one keyboard navigation starts from, moving the DOM focus into the chart
   * when it is not already there.
   * Does nothing when keyboard navigation is disabled, when the series type does not support it,
   * or when the identifier is not complete enough to be focused.
   * @param {FocusedItemIdentifier} item The item to focus.
   * @param {FocusItemOptions} options Options to override the focus visibility.
   * @returns {boolean} `true` when the focus state was updated.
   */
  focusItem: (item: FocusedItemIdentifier<ChartSeriesType>, options?: FocusItemOptions) => boolean;
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
     * If `false` the focused item is not rendered as focused, and does not drive the highlight and tooltip.
     * Set when the focus was moved by a pointer instead of the keyboard. Implies `isFocused`.
     */
    isFocusVisible: boolean;
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
  /**
   * If `true`, clicking an item immediately shows the keyboard focus indicator on it.
   * By default, clicking sets the item that keyboard navigation starts from, but the focus
   * indicator stays hidden until the user presses a key.
   * @default false
   */
  focusItemOnClick?: boolean;
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
