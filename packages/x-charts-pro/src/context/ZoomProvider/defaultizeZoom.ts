import { AxisConfig, ScaleName, ChartsXAxisProps } from '@mui/x-charts';
import { isDefined } from '@mui/x-charts/internals';
import { DefaultizedZoomOptions, ZoomOptions } from './Zoom.types';

const defaultZoomOptions = {
  start: 0,
  end: 100,
  step: 5,
  minSpan: 10,
  maxSpan: 100,
  panning: true,
};

export const defaultizeZoom = (
  axis: Pick<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id' | 'zoom'>[] | undefined,
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
