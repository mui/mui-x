import { type DefaultizedProps } from '@mui/x-internals/types';
import { type ChartSeriesType, type SeriesItemIdentifier } from '../../../../models/seriesType';
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
   * @param {SeriesItemIdentifier<SeriesType>} item The item to highlight.
   */
  setHighlight: (item: SeriesItemIdentifier<SeriesType>) => void;
}

export interface UseChartHighlightParameters<SeriesType extends ChartSeriesType> {
  /**
   * The highlighted item.
   * Used when the highlight is controlled.
   */
  highlightedItem?: SeriesItemIdentifier<SeriesType> | null;
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {SeriesItemIdentifier<SeriesType> | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange?: (highlightedItem: SeriesItemIdentifier<SeriesType> | null) => void;
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
    item: SeriesItemIdentifier<SeriesType> | null;
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
