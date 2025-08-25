import { useChartZAxis, UseChartZAxisSignature } from '../plugins/featurePlugins/useChartZAxis';
import {
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
} from '../plugins/featurePlugins/useChartCartesianAxis';
import {
  useChartInteraction,
  UseChartInteractionSignature,
} from '../plugins/featurePlugins/useChartInteraction';
import {
  useChartHighlight,
  UseChartHighlightSignature,
} from '../plugins/featurePlugins/useChartHighlight';
import { ConvertSignaturesIntoPlugins } from '../plugins/models/helpers';
import {
  useChartVoronoi,
  UseChartVoronoiSignature,
} from '../plugins/featurePlugins/useChartVoronoi';

export type ScatterChartPluginsSignatures = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<'scatter'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartVoronoiSignature,
];

export const SCATTER_CHART_PLUGINS: ConvertSignaturesIntoPlugins<ScatterChartPluginsSignatures> = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartVoronoi,
];
