import { useChartPolarAxis } from '../internals/plugins/featurePlugins/useChartPolarAxis';
import type { UseChartPolarAxisSignature } from '../internals/plugins/featurePlugins/useChartPolarAxis';
import { useChartTooltip } from '../internals/plugins/featurePlugins/useChartTooltip';
import type { UseChartTooltipSignature } from '../internals/plugins/featurePlugins/useChartTooltip';
import { useChartInteraction } from '../internals/plugins/featurePlugins/useChartInteraction';
import type { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { useChartHighlight } from '../internals/plugins/featurePlugins/useChartHighlight';
import type { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { useChartKeyboardNavigation } from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import type { UseChartKeyboardNavigationSignature } from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import { useChartVisibilityManager } from '../internals/plugins/featurePlugins/useChartVisibilityManager';
import type { UseChartVisibilityManagerSignature } from '../internals/plugins/featurePlugins/useChartVisibilityManager';
import type { PolarChartSeriesType } from '../models/seriesType/config';

export const RADIAL_PLUGINS = [
  useChartTooltip,
  useChartInteraction,
  useChartPolarAxis,
  useChartHighlight,
  useChartKeyboardNavigation,
  useChartVisibilityManager,
] as const;

export type RadialPluginSignatures<SeriesType extends PolarChartSeriesType = PolarChartSeriesType> =
  [
    UseChartTooltipSignature<SeriesType>,
    UseChartInteractionSignature,
    UseChartPolarAxisSignature,
    UseChartHighlightSignature<SeriesType>,
    UseChartKeyboardNavigationSignature,
    UseChartVisibilityManagerSignature<SeriesType>,
  ];
