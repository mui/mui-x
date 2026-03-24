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
  useChartHighlight,
  type UseChartHighlightSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
  useChartProZoom,
  type UseChartProZoomSignature,
} from '@mui/x-charts-pro/plugins';

export type CandlestickChartPluginSignatures = [
  UseChartTooltipSignature<'ohlc'>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'ohlc'>,
  UseChartHighlightSignature<'ohlc'>,
  UseChartProZoomSignature,
  UseChartVisibilityManagerSignature<'ohlc'>,
  UseChartProExportSignature,
];

export const CANDLESTICK_CHART_PLUGINS: ConvertSignaturesIntoPlugins<CandlestickChartPluginSignatures> =
  [
    useChartTooltip,
    useChartInteraction,
    useChartCartesianAxis,
    useChartHighlight,
    useChartProZoom,
    useChartVisibilityManager,
    useChartProExport,
  ];
