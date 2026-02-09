import { MakeOptional, type DefaultizedProps } from '@mui/x-internals/types';
import { HighlightItemIdentifier, type ChartSeriesType } from '../../../../models/seriesType';
import { type ChartPluginSignature } from '../../models';
import { type UseChartSeriesSignature } from '../../corePlugins/useChartSeries';

export type HighlightUpdateSource = 'pointer' | 'keyboard';

export interface UseChartHighlightInstance<SeriesType extends ChartSeriesType> {
  /**
   * Remove all highlight.
   */
  clearHighlight: () => void;
  /**
   * Set the highlighted item.
   * @param {HighlightItemIdentifier<SeriesType>} item The item to highlight.
   */
  setHighlight: (item: HighlightItemIdentifier<SeriesType>) => void;
}

export interface UseChartHighlightParameters<SeriesType extends ChartSeriesType> {
  /**
   * The highlighted item.
   * Used when the highlight is controlled.
   */
  highlightedItem?: HighlightItemIdentifier<SeriesType> | null;
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemIdentifier<SeriesType> | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange?: (highlightedItem: HighlightItemIdentifier<SeriesType> | null) => void;
}

export type UseChartHighlightDefaultizedParameters<SeriesType extends ChartSeriesType> =
  DefaultizedProps<UseChartHighlightParameters<SeriesType>, 'highlightedItem'>;

export interface UseChartHighlightState<SeriesType extends ChartSeriesType> {
  highlight: {
    /**
     * Indicates if the highlighted item is controlled.
     */
    isControlled: boolean;
    /**
     * The item currently highlighted.
     */
    item: HighlightItemIdentifier<SeriesType> | null;
    /**
     * The last interaction highlight update.
     * Used to decide if highlight should be based on pointer position or keyboard navigation.
     */
    lastUpdate: HighlightUpdateSource;
  };
}

export type UseChartHighlightSignature<SeriesType extends ChartSeriesType> = ChartPluginSignature<{
  instance: UseChartHighlightInstance<SeriesType>;
  state: UseChartHighlightState<SeriesType>;
  params: UseChartHighlightParameters<SeriesType>;
  defaultizedParams: UseChartHighlightDefaultizedParameters<SeriesType>;
  modelNames: 'highlightedItem';
  dependencies: [UseChartSeriesSignature];
}>;
