import { AxisConfig, ScaleName, ChartsXAxisProps } from '@mui/x-charts';
import { isDefined } from '@mui/x-charts/internals';
import { DefaultizedZoomOptions } from './Zoom.types';

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
  axisName: 'x' | 'y',
): DefaultizedZoomOptions[] | undefined => {
  if (!axis) {
    return undefined;
  }

  const defaultized = axis
    .map((v) => {
      if (!v.zoom) {
        return undefined;
      }

      if (v.zoom === true) {
        return {
          axisId: v.id,
          axis: axisName,
          ...defaultZoomOptions,
        };
      }

      return {
        axisId: v.id,
        axis: axisName,
        ...defaultZoomOptions,
        ...v.zoom,
      };
    })
    .filter(isDefined);

  return defaultized.length > 0 ? defaultized : undefined;
};
