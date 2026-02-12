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
  setTooltipItem: (newItem: SeriesItemIdentifier<ChartSeriesType>) => void;
  /**
   * Remove the item the user was pointing at.
   * - If `itemToRemove` is provided, it removes the item only if it matches the current one.
   *   Otherwise it assumes the item got already updated and does nothing.
   * - If `itemToRemove` is not provided, it removes the current item unconditionally.
   * @param {SeriesItemIdentifier} itemToRemove The identifier of the item.
   */
  removeTooltipItem: (itemToRemove?: SeriesItemIdentifier<ChartSeriesType>) => void;
}

export interface UseChartTooltipParameters<TSeries extends ChartSeriesType = ChartSeriesType> {
  /**
   * The tooltip item.
   * Used when the tooltip is controlled.
   */
  tooltipItem?: SeriesItemIdentifier<TSeries> | null;
  /**
   * The callback fired when the tooltip item changes.
   *
   * @param {SeriesItemIdentifier<TSeries> | null} tooltipItem  The newly highlighted item.
   */
  onTooltipItemChange?: (tooltipItem: SeriesItemIdentifierWithType<TSeries> | null) => void;
}

export type UseChartTooltipDefaultizedParameters<
  TSeries extends ChartSeriesType = ChartSeriesType,
> = DefaultizedProps<UseChartTooltipParameters<TSeries>, 'tooltipItem'>;

export interface UseChartTooltipState<TSeries extends ChartSeriesType = ChartSeriesType> {
  tooltip: {
    /**
     * Indicates if the tooltip item is controlled.
     */
    itemIsControlled: boolean;
    /**
     * The item currently under the pointer.
     */
    item: null | SeriesItemIdentifierWithType<TSeries>;
  };
}

export type UseChartTooltipSignature<TSeries extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    instance: UseChartTooltipInstance;
    state: UseChartTooltipState;
    params: UseChartTooltipParameters<TSeries>;
    defaultizedParams: UseChartTooltipDefaultizedParameters<TSeries>;
  }>;
