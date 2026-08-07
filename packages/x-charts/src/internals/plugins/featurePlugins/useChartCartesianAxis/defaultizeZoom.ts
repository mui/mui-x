import {
  DEFAULT_ZOOM_SLIDER_PREVIEW_SIZE,
  DEFAULT_ZOOM_SLIDER_SHOW_TOOLTIP,
  DEFAULT_ZOOM_SLIDER_SIZE,
} from '../../../constants';
import type { AxisId, ScaleName } from '../../../../models/axis';
import type { DefaultizedZoomOptions } from './useChartCartesianAxis.types';
import type { ZoomOptions } from './zoom.types';

/**
 * Ordinal Y axes (band/point) render with `domain[0]` at the top of the chart
 * (see the `range.reverse()` applied in `selectorChartYScales`), which is the
 * opposite of the cartesian convention assumed by the zoom/pan math.
 *
 * Returns the `reverse` flag the zoom handlers should use so that pan/wheel
 * gestures follow the visual direction of the axis.
 */
export const getEffectiveZoomReverse = (
  axisDirection: 'x' | 'y',
  scaleType: ScaleName | undefined,
  reverse: boolean | undefined,
): boolean => {
  const resolvedReverse = reverse ?? false;
  const isOrdinal = scaleType === 'band' || scaleType === 'point';
  if (axisDirection === 'y' && isOrdinal) {
    return !resolvedReverse;
  }
  return resolvedReverse;
};

export const defaultZoomOptions = {
  minStart: 0,
  maxEnd: 100,
  step: 5,
  minSpan: 10,
  maxSpan: 100,
  panning: true,
  filterMode: 'keep',
  reverse: false,
  slider: {
    enabled: false,
    preview: false,
    size: DEFAULT_ZOOM_SLIDER_SIZE,
    showTooltip: DEFAULT_ZOOM_SLIDER_SHOW_TOOLTIP,
  },
} satisfies Omit<DefaultizedZoomOptions, 'axisId' | 'axisDirection'>;

export const defaultizeZoom = (
  zoom: boolean | ZoomOptions | undefined,
  axisId: AxisId,
  axisDirection: 'x' | 'y',
  reverse?: boolean,
): DefaultizedZoomOptions | undefined => {
  if (!zoom) {
    return undefined;
  }

  if (zoom === true) {
    return {
      axisId,
      axisDirection,
      ...defaultZoomOptions,
      reverse: reverse ?? false,
    };
  }

  return {
    axisId,
    axisDirection,
    ...defaultZoomOptions,
    reverse: reverse ?? false,
    ...zoom,
    slider: {
      ...defaultZoomOptions.slider,
      size:
        (zoom.slider?.preview ?? defaultZoomOptions.slider.preview)
          ? DEFAULT_ZOOM_SLIDER_PREVIEW_SIZE
          : DEFAULT_ZOOM_SLIDER_SIZE,
      ...zoom.slider,
    },
  };
};
