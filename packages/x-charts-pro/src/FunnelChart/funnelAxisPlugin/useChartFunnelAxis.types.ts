import {
  ChartPluginSignature,
  UseChartCartesianAxisDefaultizedParameters,
  UseChartCartesianAxisParameters,
  UseChartCartesianAxisState,
  UseChartInteractionSignature,
  UseChartSeriesSignature,
  ChartsAxisData,
} from '@mui/x-charts/internals';

export type UseChartFunnelAxisSignature = ChartPluginSignature<{
  params: Omit<
    UseChartCartesianAxisParameters,
    'onAxisClick' | 'onHighlightedAxisChange' | 'highlightedAxis'
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
  defaultizedParams: UseChartCartesianAxisDefaultizedParameters & { gap: number };
  state: Pick<UseChartCartesianAxisState, 'cartesianAxis'> & { funnel: { gap: number } };
  dependencies: [UseChartSeriesSignature<'funnel'>];
  optionalDependencies: [UseChartInteractionSignature];
}>;
