import {
  useChartZAxis,
  type UseChartZAxisSignature,
} from '../internals/plugins/featurePlugins/useChartZAxis';
import {
  useChartCartesianAxis,
  type UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import {
  useChartInteraction,
  type UseChartInteractionSignature,
} from '../internals/plugins/featurePlugins/useChartInteraction';
import {
  useChartHighlight,
  type UseChartHighlightSignature,
} from '../internals/plugins/featurePlugins/useChartHighlight';
import { type ConvertSignaturesIntoPlugins } from '../internals/plugins/models/helpers';
import {
  useChartClosestPoint,
  type UseChartClosestPointSignature,
} from '../internals/plugins/featurePlugins/useChartClosestPoint';
import {
  useChartKeyboardNavigation,
  type UseChartKeyboardNavigationSignature,
} from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import {
  useChartBrush,
  type UseChartBrushSignature,
} from '../internals/plugins/featurePlugins/useChartBrush';
import {
  useChartVisibilityManager,
  UseChartVisibilityManagerSignature,
} from '../internals/plugins/featurePlugins/useChartVisibilityManager';

export type ScatterChartPluginSignatures = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'scatter'>,
  UseChartHighlightSignature,
  UseChartVisibilityManagerSignature,
  UseChartClosestPointSignature,
  UseChartKeyboardNavigationSignature,
];

export const SCATTER_CHART_PLUGINS: ConvertSignaturesIntoPlugins<ScatterChartPluginSignatures> = [
  useChartZAxis,
  useChartBrush,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
  useChartVisibilityManager,
  useChartClosestPoint,
  useChartKeyboardNavigation,
];
