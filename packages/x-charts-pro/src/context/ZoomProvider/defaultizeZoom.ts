import { MakeRequired, isDefined } from '@mui/x-charts/internals';
import { AxisConfigForZoom, DefaultizedZoomOptions } from './Zoom.types';

const defaultZoomOptions = {
  minStart: 0,
  maxEnd: 100,
  step: 5,
  minSpan: 10,
  maxSpan: 100,
  panning: true,
};

export const defaultizeZoom = (
  axis: MakeRequired<AxisConfigForZoom, 'id'>[] | undefined,
  axisDirection: 'x' | 'y',
): DefaultizedZoomOptions[] => {
  if (!axis) {
    return [];
  }

  const defaultized = axis
    .map((v) => {
      if (!v.zoom) {
        return undefined;
      }

      if (v.zoom === true) {
        return {
          axisId: v.id,
          axisDirection,
          ...defaultZoomOptions,
        };
      }

      return {
        axisId: v.id,
        axisDirection,
        ...defaultZoomOptions,
        ...v.zoom,
      };
    })
    .filter(isDefined);

  return defaultized;
};
