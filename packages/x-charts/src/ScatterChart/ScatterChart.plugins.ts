import {
  useChartZAxis,
  UseChartZAxisSignature,
} from '../internals/plugins/featurePlugins/useChartZAxis';
import {
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import {
  useChartInteraction,
  UseChartInteractionSignature,
} from '../internals/plugins/featurePlugins/useChartInteraction';
import {
  useChartHighlight,
  UseChartHighlightSignature,
} from '../internals/plugins/featurePlugins/useChartHighlight';
import { ConvertSignaturesIntoPlugins } from '../internals/plugins/models/helpers';
import {
  useChartVoronoi,
  UseChartVoronoiSignature,
} from '../internals/plugins/featurePlugins/useChartVoronoi';

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
