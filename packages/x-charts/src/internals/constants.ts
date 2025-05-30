import type { ZoomSliderShowTooltip } from './plugins/featurePlugins/useChartCartesianAxis/zoom.types';

/** Margin in the opposite direction of the axis, i.e., horizontal if the axis is vertical and vice versa. */
export const ZOOM_SLIDER_MARGIN = 4;

/** Size reserved for the zoom slider. The actual size of the slider might be smaller. */
export const DEFAULT_ZOOM_SLIDER_SIZE = 20 + 2 * ZOOM_SLIDER_MARGIN;

export const DEFAULT_ZOOM_SLIDER_SHOW_TOOLTIP: ZoomSliderShowTooltip = 'hover';

/** Default margin for pie charts. */
export const DEFAULT_PIE_CHART_MARGIN = { top: 5, bottom: 5, left: 5, right: 5 };
