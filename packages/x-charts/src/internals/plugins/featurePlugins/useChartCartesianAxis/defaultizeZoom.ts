import { DEFAULT_ZOOM_BRUSH_SIZE } from '../../../../constants';
import { AxisId } from '../../../../models/axis';
import { DefaultizedZoomOptions } from './useChartCartesianAxis.types';
import { ZoomOptions } from './zoom.types';

const defaultZoomOptions = {
  minStart: 0,
  maxEnd: 100,
  step: 5,
  minSpan: 10,
  maxSpan: 100,
  panning: true,
  filterMode: 'keep',
  overview: { enabled: false, size: DEFAULT_ZOOM_BRUSH_SIZE },
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
      overview: { ...defaultZoomOptions.overview },
    };
  }

  return {
    axisId,
    axisDirection,
    ...defaultZoomOptions,
    ...zoom,
    overview: { ...defaultZoomOptions.overview, ...zoom.overview },
  };
};
