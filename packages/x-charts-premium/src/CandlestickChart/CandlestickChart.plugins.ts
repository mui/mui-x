import {
  useChartTooltip,
  useChartInteraction,
  useChartCartesianAxis,
  useChartVisibilityManager,
  useChartHighlight,
} from '@mui/x-charts/internals';
import type {
  UseChartTooltipSignature,
  ConvertSignaturesIntoPlugins,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature,
  UseChartVisibilityManagerSignature,
  UseChartHighlightSignature,
} from '@mui/x-charts/internals';
import { useChartProExport, useChartProZoom } from '@mui/x-charts-pro/plugins';
import type {
  UseChartProExportSignature,
  UseChartProZoomSignature,
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
