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
import { useChartProZoom, type UseChartProZoomSignature } from '@mui/x-charts-pro/plugins';

export type CandlestickChartPluginSignatures = [
  UseChartTooltipSignature<'ohlc'>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'ohlc'>,
  UseChartProZoomSignature,
  UseChartVisibilityManagerSignature<'ohlc'>,
];

export const CANDLESTICK_CHART_PLUGINS: ConvertSignaturesIntoPlugins<CandlestickChartPluginSignatures> =
  [
    useChartTooltip,
    useChartInteraction,
    useChartCartesianAxis,
    useChartProZoom,
    useChartVisibilityManager,
  ];
