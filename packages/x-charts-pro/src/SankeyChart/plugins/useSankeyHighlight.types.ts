import { type DefaultizedProps } from '@mui/x-internals/types';
import { type ChartPluginSignature } from '@mui/x-charts/internals';
import { type SankeyItemIdentifier } from '../sankey.types';

/**
 * The data of the highlighted item in a Sankey chart.
 * Can be either a node or a link.
 *
 * @example
 * // Highlight a node
 * { type: 'sankey', seriesId: 'series-1', subType: 'node', nodeId: 'A' }
 *
 * // Highlight a link
 * { type: 'sankey', seriesId: 'series-1', subType: 'link', sourceId: 'A', targetId: 'B' }
 *
 * // Clear the highlight
 * null
 */
export type SankeyHighlightItemData = SankeyItemIdentifier;

export interface UseSankeyHighlightInstance {
  /**
   * Remove all highlight.
   */
  clearHighlight: () => void;
  /**
   * Set the highlighted item.
   * @param {SankeyHighlightItemData} item The item to highlight.
   */
  setHighlight: (item: SankeyHighlightItemData) => void;
}

export interface UseSankeyHighlightParameters {
  /**
   * The highlighted item.
   * Used when the highlight is controlled.
   */
  highlightedItem?: SankeyHighlightItemData | null;
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {SankeyHighlightItemData | null} highlightedItem The newly highlighted item.
   */
  onHighlightChange?: (highlightedItem: SankeyHighlightItemData | null) => void;
}

export type UseSankeyHighlightDefaultizedParameters = DefaultizedProps<
  UseSankeyHighlightParameters,
  'highlightedItem'
>;

export interface UseSankeyHighlightState {
  highlight: {
    item: SankeyHighlightItemData | null;
  };
}

export type UseSankeyHighlightSignature = ChartPluginSignature<{
  instance: UseSankeyHighlightInstance;
  state: UseSankeyHighlightState;
  params: UseSankeyHighlightParameters;
  defaultizedParams: UseSankeyHighlightDefaultizedParameters;
  modelNames: 'highlightedItem';
}>;
