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
  useChartClosestPoint,
  UseChartClosestPointSignature,
} from '../internals/plugins/featurePlugins/useChartClosestPoint';
import {
  useChartKeyboardNavigation,
  UseChartKeyboardNavigationSignature,
} from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import {
  useChartBrush,
  UseChartBrushSignature,
} from '../internals/plugins/featurePlugins/useChartBrush';
import {
  useChartVisibilityManager,
  type UseChartVisibilityManagerSignature,
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
