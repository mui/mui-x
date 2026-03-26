import type {
  ConvertSignaturesIntoPlugins,
  UseChartHighlightSignature,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartPolarAxisSignature,
  UseChartVisibilityManagerSignature,
  UseChartKeyboardNavigationSignature,
} from '@mui/x-charts/internals';
import { RADAR_PLUGINS } from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';

export type RadarChartProPluginSignatures = [
  UseChartTooltipSignature<'radar'>,
  UseChartInteractionSignature,
  UseChartPolarAxisSignature,
  UseChartHighlightSignature<'radar'>,
  UseChartKeyboardNavigationSignature,
  UseChartVisibilityManagerSignature<'radar'>,
  UseChartProExportSignature,
];

export const RADAR_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<RadarChartProPluginSignatures> =
  [...RADAR_PLUGINS, useChartProExport];
