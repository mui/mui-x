import {
  type UseChartTooltipSignature,
  type ConvertSignaturesIntoPlugins,
  type UseChartInteractionSignature,
  type UseChartCartesianAxisSignature,
  type UseChartVisibilityManagerSignature,
  useChartTooltip,
  useChartInteraction,
  useChartCartesianAxis,
  useChartVisibilityManager,
} from '@mui/x-charts/internals';

export type CandlestickChartPluginSignatures = [
  UseChartTooltipSignature<'ohlc'>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'ohlc'>,
  UseChartVisibilityManagerSignature<'ohlc'>,
];

export const CANDLESTICK_CHART_PLUGINS: ConvertSignaturesIntoPlugins<CandlestickChartPluginSignatures> =
  [useChartTooltip, useChartInteraction, useChartCartesianAxis, useChartVisibilityManager];
