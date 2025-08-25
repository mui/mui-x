import {
  useChartZAxis,
  UseChartZAxisSignature,
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
  useChartInteraction,
  UseChartInteractionSignature,
  useChartHighlight,
  UseChartHighlightSignature,
} from '@mui/x-charts/plugins';
import { ConvertSignaturesIntoPlugins } from '@mui/x-charts/internals';
import { useChartProExport, UseChartProExportSignature } from '../plugins/useChartProExport';
import { useChartProZoom, UseChartProZoomSignature } from '../plugins/useChartProZoom';

export type BarChartProPluginsSignatures = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<'bar'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartProZoomSignature,
  UseChartProExportSignature,
];

export const BAR_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<BarChartProPluginsSignatures> = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartProZoom,
  useChartProExport,
];
