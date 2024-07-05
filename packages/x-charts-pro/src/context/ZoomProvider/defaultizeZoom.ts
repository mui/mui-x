import { AxisConfig, ScaleName, ChartsXAxisProps } from '@mui/x-charts';
import { AxisId, isDefined } from '@mui/x-charts/internals';
import { ZoomOptions } from './ZoomProps';

const defaultZoomOptions = {
  min: 0,
  max: 100,
  step: 5,
  minSpan: 10,
  maxSpan: 100,
  panning: true,
};

export type DefaultizedZoomOptions = Required<ZoomOptions> & { id: AxisId };

export const defaultizeZoom = (
  axis: Pick<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id' | 'zoom'>[] | undefined,
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
          id: v.id,
          ...defaultZoomOptions,
        };
      }

      return {
        id: v.id,
        ...defaultZoomOptions,
        ...v.zoom,
      };
    })
    .filter(isDefined);

  return defaultized.length > 0 ? defaultized : undefined;
};
