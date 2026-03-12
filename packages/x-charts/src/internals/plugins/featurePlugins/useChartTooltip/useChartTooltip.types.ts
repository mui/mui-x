import type { DefaultizedProps } from '@mui/x-internals/types';
import type { ChartPluginSignature } from '../../models';
import type {
  SeriesItemIdentifier,
  SeriesItemIdentifierWithType,
} from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

export interface UseChartTooltipInstance {
  /**
   * Setter for the item the user is pointing at.
   * @param {SeriesItemIdentifier} newItem The identifier of the item.
   */
  setTooltipItem: (newItem: SeriesItemIdentifierWithType<ChartSeriesType>) => void;
  /**
   * Remove the item the user was pointing at.
   * - If `itemToRemove` is provided, it removes the item only if it matches the current one.
   *   Otherwise it assumes the item got already updated and does nothing.
   * - If `itemToRemove` is not provided, it removes the current item unconditionally.
   * @param {SeriesItemIdentifier} itemToRemove The identifier of the item.
   */
  removeTooltipItem: (itemToRemove?: SeriesItemIdentifierWithType<ChartSeriesType>) => void;
}

export interface UseChartTooltipParameters<SeriesType extends ChartSeriesType = ChartSeriesType> {
  /**
   * The tooltip item.
   * Used when the tooltip is controlled.
   */
  tooltipItem?: SeriesItemIdentifier<SeriesType> | SeriesItemIdentifierWithType<SeriesType> | null;
  /**
   * The callback fired when the tooltip item changes.
   *
   * @param {SeriesItemIdentifier<SeriesType> | null} tooltipItem  The newly highlighted item.
   */
  onTooltipItemChange?: (tooltipItem: SeriesItemIdentifierWithType<SeriesType> | null) => void;
}

export type UseChartTooltipDefaultizedParameters<
  SeriesType extends ChartSeriesType = ChartSeriesType,
> = DefaultizedProps<UseChartTooltipParameters<SeriesType>, 'tooltipItem'>;

export interface UseChartTooltipState<SeriesType extends ChartSeriesType = ChartSeriesType> {
  tooltip: {
    /**
     * Indicates if the tooltip item is controlled.
     */
    itemIsControlled: boolean;
    /**
     * The item currently under the pointer.
     */
    item: null | SeriesItemIdentifierWithType<SeriesType>;
  };
}

export type UseChartTooltipSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    instance: UseChartTooltipInstance;
    state: UseChartTooltipState;
    params: UseChartTooltipParameters<SeriesType>;
    defaultizedParams: UseChartTooltipDefaultizedParameters<SeriesType>;
  }>;
