import {
  type ChartPluginSignature,
  type UseChartCartesianAxisDefaultizedParameters,
  type UseChartCartesianAxisParameters,
  type UseChartCartesianAxisState,
  type UseChartInteractionSignature,
  type UseChartSeriesSignature,
  type ChartsAxisData,
} from '@mui/x-charts/internals';

export type UseChartFunnelAxisSignature = ChartPluginSignature<{
  params: Omit<
    UseChartCartesianAxisParameters,
    | 'onAxisClick'
    | 'onHighlightedAxisChange'
    | 'highlightedAxis'
    | 'onTooltipAxisChange'
    | 'tooltipAxis'
    | 'axesGap'
  > & {
    /**
     * The gap, in pixels, between funnel sections.
     * @default 0
     */
    gap?: number;
    /**
     * The function called for onClick events.
     * The second argument contains information about all funnel elements at the current position.
     * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element.
     * @param {null | ChartsAxisData} data The data about the clicked axis and items associated with it.
     */
    onAxisClick?: (event: MouseEvent, data: null | ChartsAxisData) => void;
  };
  defaultizedParams: Omit<
    UseChartCartesianAxisDefaultizedParameters,
    'onAxisClick' | 'onHighlightedAxisChange' | 'highlightedAxis' | 'axesGap'
  > & {
    gap: number;
    onAxisClick?: (event: MouseEvent, data: null | ChartsAxisData) => void;
  };
  state: Pick<UseChartCartesianAxisState, 'cartesianAxis'> & { funnel: { gap: number } };
  dependencies: [UseChartSeriesSignature<'funnel'>];
  optionalDependencies: [UseChartInteractionSignature];
}>;
