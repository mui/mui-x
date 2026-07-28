import { useChartZAxis } from '../internals/plugins/featurePlugins/useChartZAxis';
import type { UseChartZAxisSignature } from '../internals/plugins/featurePlugins/useChartZAxis';
import { useChartCartesianAxis } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import type { UseChartCartesianAxisSignature } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { useChartTooltip } from '../internals/plugins/featurePlugins/useChartTooltip';
import type { UseChartTooltipSignature } from '../internals/plugins/featurePlugins/useChartTooltip';
import { useChartInteraction } from '../internals/plugins/featurePlugins/useChartInteraction';
import type { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { useChartHighlight } from '../internals/plugins/featurePlugins/useChartHighlight';
import type { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import type { ConvertSignaturesIntoPlugins } from '../internals/plugins/models/helpers';
import { useChartClosestPoint } from '../internals/plugins/featurePlugins/useChartClosestPoint';
import type { UseChartClosestPointSignature } from '../internals/plugins/featurePlugins/useChartClosestPoint';
import { useChartKeyboardNavigation } from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import type { UseChartKeyboardNavigationSignature } from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import { useChartBrush } from '../internals/plugins/featurePlugins/useChartBrush';
import type { UseChartBrushSignature } from '../internals/plugins/featurePlugins/useChartBrush';
import { useChartVisibilityManager } from '../internals/plugins/featurePlugins/useChartVisibilityManager';
import type { UseChartVisibilityManagerSignature } from '../internals/plugins/featurePlugins/useChartVisibilityManager';
import { useProgressiveRendering } from '../internals/plugins/featurePlugins/useProgressiveRendering';
import type { UseProgressiveRenderingSignature } from '../internals/plugins/featurePlugins/useProgressiveRendering';

export type ScatterChartPluginSignatures = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartTooltipSignature<'scatter'>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'scatter'>,
  UseChartHighlightSignature<'scatter'>,
  UseChartVisibilityManagerSignature<'scatter'>,
  UseChartClosestPointSignature,
  UseChartKeyboardNavigationSignature,
  UseProgressiveRenderingSignature,
];

export const SCATTER_CHART_PLUGINS: ConvertSignaturesIntoPlugins<ScatterChartPluginSignatures> = [
  useChartZAxis,
  useChartBrush,
  useChartTooltip,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
  useChartVisibilityManager,
  useChartClosestPoint,
  useChartKeyboardNavigation,
  useProgressiveRendering,
];
