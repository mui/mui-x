import { AxisId, DefaultizedZoomOptions } from '@mui/x-charts/internals';
import { AxisConfig, ChartsXAxisProps, ChartsYAxisProps, ScaleName } from '@mui/x-charts/models';
import { defaultizeZoom } from './defaultizeZoom';

export const creatZoomLookup = (
  axes: AxisConfig<ScaleName, any, ChartsXAxisProps | ChartsYAxisProps>[],
) =>
  axes.reduce<Record<AxisId, DefaultizedZoomOptions>>((acc, v) => {
    const { zoom, id: axisId } = v;
    const defaultizedZoom = defaultizeZoom(zoom, axisId, 'x');
    if (defaultizedZoom) {
      acc[axisId] = defaultizedZoom;
    }
    return acc;
  }, {});
