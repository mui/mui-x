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
import { useChartKeyboardNavigation } from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import type { UseChartKeyboardNavigationSignature } from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import type { ConvertSignaturesIntoPlugins } from '../internals/plugins/models/helpers';
import { useChartBrush } from '../internals/plugins/featurePlugins/useChartBrush';
import type { UseChartBrushSignature } from '../internals/plugins/featurePlugins/useChartBrush';
import { useChartVisibilityManager } from '../internals/plugins/featurePlugins/useChartVisibilityManager';
import type { UseChartVisibilityManagerSignature } from '../internals/plugins/featurePlugins/useChartVisibilityManager';

export type LineChartPluginSignatures = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartTooltipSignature<'line'>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'line'>,
  UseChartHighlightSignature<'line'>,
  UseChartVisibilityManagerSignature<'line'>,
  UseChartKeyboardNavigationSignature,
];

export const LINE_CHART_PLUGINS: ConvertSignaturesIntoPlugins<LineChartPluginSignatures> = [
  useChartZAxis,
  useChartBrush,
  useChartTooltip,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
  useChartVisibilityManager,
  useChartKeyboardNavigation,
];
