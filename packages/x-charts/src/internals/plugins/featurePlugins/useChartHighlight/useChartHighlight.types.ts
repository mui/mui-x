import { type DefaultizedProps } from '@mui/x-internals/types';
import { type ChartPluginSignature } from '../../models';
import { type SeriesId } from '../../../../models/seriesType/common';
import { type UseChartSeriesSignature } from '../../corePlugins/useChartSeries';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

/**
 * The data of the highlighted item.
 * To highlight an item, you need to provide the series id and the item id.
 * If targeting the whole series, you can omit the item id.
 * To clear the highlight, set the value to an empty object.
 *
 * @example
 * // Highlight the item with the series id 'london' and the item id 0.
 * { seriesId: 'london', dataIndex: 0 }
 *
 * // Highlight the whole series with the series id 'london'.
 * { seriesId: 'london' }
 *
 * // Clear the highlight.
 * {}
 */
export type HighlightItemData = {
  type: ChartSeriesType;
  /**
   * The series id of the highlighted item.
   */
  seriesId: SeriesId;
  /**
   * The index of the item in series data.
   */
  dataIndex?: number;
};

export type HighlightUpdateSource = 'pointer' | 'keyboard';

export interface UseChartHighlightInstance {
  /**
   * Remove all highlight.
   */
  clearHighlight: () => void;
  /**
   * Set the highlighted item.
   * @param {HighlightItemData} item The item to highlight.
   */
  setHighlight: (item: HighlightItemData) => void;
}

export interface UseChartHighlightParameters {
  /**
   * The highlighted item.
   * Used when the highlight is controlled.
   */
  highlightedItem?: HighlightItemData | null;
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange?: (highlightedItem: HighlightItemData | null) => void;
}

export type UseChartHighlightDefaultizedParameters = DefaultizedProps<
  UseChartHighlightParameters,
  'highlightedItem'
>;

export interface UseChartHighlightState {
  highlight: {
    /**
     * Indicates if the highlighted item is controlled.
     */
    isControlled: boolean;
    /**
     * The item currently highlighted.
     */
    item: HighlightItemData | null;
    /**
     * The last interaction highlight update.
     * Used to decide if highlight should be based on pointer position or keyboard navigation.
     */
    lastUpdate: HighlightUpdateSource;
  };
}

export type UseChartHighlightSignature = ChartPluginSignature<{
  instance: UseChartHighlightInstance;
  state: UseChartHighlightState;
  params: UseChartHighlightParameters;
  defaultizedParams: UseChartHighlightDefaultizedParameters;
  modelNames: 'highlightedItem';
  dependencies: [UseChartSeriesSignature];
}>;
