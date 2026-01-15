import {
  type ConvertSignaturesIntoPlugins,
  useChartHighlight,
  type UseChartHighlightSignature,
  useChartTooltip,
  type UseChartTooltipSignature,
  useChartInteraction,
  type UseChartInteractionSignature,
  useChartPolarAxis,
  type UseChartPolarAxisSignature,
  useChartVisibilityManager,
  type UseChartVisibilityManagerSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';

export type RadarChartProPluginSignatures = [
  UseChartTooltipSignature<'radar'>,
  UseChartInteractionSignature,
  UseChartPolarAxisSignature,
  UseChartHighlightSignature,
  UseChartVisibilityManagerSignature<'radar'>,
  UseChartProExportSignature,
];

export const RADAR_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<RadarChartProPluginSignatures> =
  [
    useChartTooltip,
    useChartInteraction,
    useChartPolarAxis,
    useChartHighlight,
    useChartVisibilityManager,
    useChartProExport,
  ];
