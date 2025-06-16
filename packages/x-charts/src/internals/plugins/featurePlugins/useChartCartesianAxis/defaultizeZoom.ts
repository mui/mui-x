import {
  DEFAULT_ZOOM_SLIDER_PREVIEW_SIZE,
  DEFAULT_ZOOM_SLIDER_SHOW_TOOLTIP,
  DEFAULT_ZOOM_SLIDER_SIZE,
} from '../../../constants';
import { AxisId } from '../../../../models/axis';
import { DefaultizedZoomOptions } from './useChartCartesianAxis.types';
import { ZoomOptions } from './zoom.types';

export const defaultZoomOptions = {
  minStart: 0,
  maxEnd: 100,
  step: 5,
  minSpan: 10,
  maxSpan: 100,
  panning: true,
  filterMode: 'keep',
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
): DefaultizedZoomOptions | undefined => {
  if (!zoom) {
    return undefined;
  }

  if (zoom === true) {
    return {
      axisId,
      axisDirection,
      ...defaultZoomOptions,
    };
  }

  return {
    axisId,
    axisDirection,
    ...defaultZoomOptions,
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
