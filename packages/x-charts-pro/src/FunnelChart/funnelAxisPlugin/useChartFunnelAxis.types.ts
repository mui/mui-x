import {
  ChartPluginSignature,
  UseChartCartesianAxisDefaultizedParameters,
  UseChartCartesianAxisParameters,
  UseChartCartesianAxisState,
  UseChartInteractionSignature,
  UseChartSeriesSignature,
} from '@mui/x-charts/internals';

export type UseChartFunnelAxisSignature = ChartPluginSignature<{
  params: UseChartCartesianAxisParameters & { gap?: number };
  defaultizedParams: UseChartCartesianAxisDefaultizedParameters & { gap: number };
  state: Pick<UseChartCartesianAxisState, 'cartesianAxis'> & { funnel: { gap: number } };
  dependencies: [UseChartSeriesSignature<'funnel'>];
  optionalDependencies: [UseChartInteractionSignature];
}>;
