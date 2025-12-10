import { type DefaultizedProps } from '@mui/x-internals/types';
import type { ChartPluginSignature } from '../../models';
import type { ChartItemIdentifier, ChartSeriesType } from '../../../../models/seriesType/config';

export interface UseChartTooltipInstance {
  /**
   * Setter for the item the user is pointing at.
   * @param {ChartItemIdentifier} newItem The identifier of the item.
   */
  setTooltipItem: (newItem: ChartItemIdentifier<ChartSeriesType>) => void;
  /**
   * Remove the item the user was pointing at.
   * - If `itemToRemove` is provided, it removes the item only if it matches the current one.
   *   Otherwise it assumes the item got already updated and does nothing.
   * - If `itemToRemove` is not provided, it removes the current item unconditionally.
   * @param {ChartItemIdentifier} itemToRemove The identifier of the item.
   */
  removeTooltipItem: (itemToRemove?: ChartItemIdentifier<ChartSeriesType>) => void;
}

export interface UseChartTooltipParameters<SeriesType extends ChartSeriesType = ChartSeriesType> {
  /**
   * The tooltip item.
   * Used when the tooltip is controlled.
   */
  tooltipItem?: ChartItemIdentifier<SeriesType> | null;
  /**
   * The callback fired when the tooltip item changes.
   *
   * @param {ChartItemIdentifier<SeriesType> | null} tooltipItem  The newly highlighted item.
   */
  onTooltipItemChange?: (tooltipItem: ChartItemIdentifier<SeriesType> | null) => void;
}

export type UseChartTooltipDefaultizedParameters<
  SeriesType extends ChartSeriesType = ChartSeriesType,
> = DefaultizedProps<UseChartTooltipParameters<SeriesType>, 'tooltipItem'>;

export interface UseChartTooltipState {
  tooltip: {
    /**
     * Indicates if the tooltip item is controlled.
     */
    itemIsControlled: boolean;
    /**
     * The item currently under the pointer.
     */
    item: null | ChartItemIdentifier<ChartSeriesType>;
  };
}

export type UseChartTooltipSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    instance: UseChartTooltipInstance;
    state: UseChartTooltipState;
    params: UseChartTooltipParameters<SeriesType>;
    defaultizedParams: UseChartTooltipDefaultizedParameters<SeriesType>;
  }>;
